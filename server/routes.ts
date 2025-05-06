import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { intentClassifier } from "./nlp/intent-classifier";
import { entityExtractor } from "./nlp/entity-extractor";
import { responseGenerator } from "./nlp/response-generator";
import { inventoryService } from "./services/inventory-service";
import { orderService } from "./services/order-service";
import { v4 as uuidv4 } from "uuid";
import { messageSchema, intentSchema, insertProductSchema, insertOrderSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix
  const apiRouter = express.Router();
  app.use("/api", apiRouter);
  
  // Chat endpoint
  apiRouter.post("/chat", async (req: Request, res: Response) => {
    try {
      // Validate the input
      const { message, conversationId } = z.object({
        message: z.string(),
        conversationId: z.string().optional()
      }).parse(req.body);
      
      // Process the message with NLP
      const intent = intentClassifier.classify(message);
      const extractedEntities = entityExtractor.extractEntities(message);
      const formattedEntities = entityExtractor.formatEntities(extractedEntities);
      
      // Get conversation context or create new
      let conversation;
      if (conversationId) {
        conversation = await storage.getConversation(parseInt(conversationId));
      }
      
      // Generate response based on intent and entities
      const response = await responseGenerator.generateResponse(
        intent, 
        formattedEntities,
        conversation?.messages || []
      );
      
      // Create user message
      const userMessage = {
        id: uuidv4(),
        sender: "user",
        content: message,
        timestamp: new Date(),
        entities: formattedEntities,
        intent: intent.name
      };
      
      // Create bot message
      const botMessage = {
        id: uuidv4(),
        sender: "bot",
        content: response,
        timestamp: new Date(),
        intent: intent.name
      };
      
      // Update or create conversation
      if (conversation) {
        await storage.addMessageToConversation(conversation.id, userMessage);
        conversation = await storage.addMessageToConversation(conversation.id, botMessage);
      } else {
        // Create new conversation
        conversation = await storage.createConversation({
          userId: null,
          intent: intent.name,
          messages: [userMessage, botMessage],
          active: true
        });
      }
      
      // Return the response
      res.json({
        message: botMessage,
        intent,
        entities: formattedEntities,
        conversationId: conversation.id
      });
    } catch (error) {
      console.error("Error processing chat message:", error);
      res.status(500).json({ error: "Error processing request" });
    }
  });
  
  // Conversation history
  apiRouter.get("/conversations/:id", async (req: Request, res: Response) => {
    try {
      const conversationId = parseInt(req.params.id);
      const conversation = await storage.getConversation(conversationId);
      
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      
      res.json(conversation);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ error: "Error fetching conversation" });
    }
  });
  
  // Get active conversations
  apiRouter.get("/conversations", async (_req: Request, res: Response) => {
    try {
      const conversations = await storage.getActiveConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Error fetching conversations" });
    }
  });
  
  // Inventory endpoints
  apiRouter.get("/inventory", async (_req: Request, res: Response) => {
    try {
      const products = await inventoryService.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ error: "Error fetching inventory" });
    }
  });
  
  apiRouter.get("/inventory/summary", async (_req: Request, res: Response) => {
    try {
      const summary = await inventoryService.getInventorySummary();
      res.json(summary);
    } catch (error) {
      console.error("Error fetching inventory summary:", error);
      res.status(500).json({ error: "Error fetching inventory summary" });
    }
  });
  
  apiRouter.get("/inventory/low-stock", async (_req: Request, res: Response) => {
    try {
      const lowStockProducts = await inventoryService.getLowStockProducts();
      res.json(lowStockProducts);
    } catch (error) {
      console.error("Error fetching low stock products:", error);
      res.status(500).json({ error: "Error fetching low stock products" });
    }
  });
  
  apiRouter.post("/inventory", async (req: Request, res: Response) => {
    try {
      const product = insertProductSchema.parse(req.body);
      const newProduct = await inventoryService.addProduct(product);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(400).json({ error: "Invalid product data" });
    }
  });
  
  apiRouter.put("/inventory/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const updatedProduct = await inventoryService.updateProduct(id, updates);
      
      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(400).json({ error: "Invalid product data" });
    }
  });
  
  // Order endpoints
  apiRouter.get("/orders", async (_req: Request, res: Response) => {
    try {
      const orders = await orderService.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Error fetching orders" });
    }
  });
  
  apiRouter.get("/orders/recent", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const recentOrders = await orderService.getRecentOrders(limit);
      res.json(recentOrders);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      res.status(500).json({ error: "Error fetching recent orders" });
    }
  });
  
  apiRouter.get("/orders/summary", async (_req: Request, res: Response) => {
    try {
      const summary = await orderService.getOrdersSummary();
      res.json(summary);
    } catch (error) {
      console.error("Error fetching orders summary:", error);
      res.status(500).json({ error: "Error fetching orders summary" });
    }
  });
  
  apiRouter.get("/orders/today", async (_req: Request, res: Response) => {
    try {
      const todaysOrders = await orderService.getTodaysOrders();
      res.json(todaysOrders);
    } catch (error) {
      console.error("Error fetching today's orders:", error);
      res.status(500).json({ error: "Error fetching today's orders" });
    }
  });
  
  apiRouter.post("/orders", async (req: Request, res: Response) => {
    try {
      const order = insertOrderSchema.parse(req.body);
      const newOrder = await orderService.createOrder(order);
      res.status(201).json(newOrder);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(400).json({ error: "Invalid order data" });
    }
  });
  
  apiRouter.put("/orders/:id/status", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = z.object({ status: z.string() }).parse(req.body);
      const updatedOrder = await orderService.updateOrderStatus(id, status);
      
      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(400).json({ error: "Invalid status" });
    }
  });
  
  // Analytics endpoints
  apiRouter.get("/analytics", async (_req: Request, res: Response) => {
    try {
      const analytics = await storage.getLatestAnalytics();
      
      if (!analytics) {
        return res.status(404).json({ error: "No analytics data found" });
      }
      
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Error fetching analytics" });
    }
  });
  
  const httpServer = createServer(app);
  
  return httpServer;
}
