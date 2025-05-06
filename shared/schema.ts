import { pgTable, text, serial, integer, boolean, timestamp, numeric, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  role: true,
});

// Product schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sku: text("sku").notNull().unique(),
  description: text("description"),
  price: numeric("price").notNull(),
  quantity: integer("quantity").notNull().default(0),
  status: text("status").default("in_stock"), // in_stock, low_stock, out_of_stock
  category: text("category"),
  reorderPoint: integer("reorder_point").default(5),
  nextRestock: timestamp("next_restock"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  sku: true,
  description: true,
  price: true,
  quantity: true,
  status: true,
  category: true,
  reorderPoint: true,
  nextRestock: true,
  imageUrl: true,
});

// Order schema
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").default("pending"), // pending, processing, completed, shipped, cancelled
  total: numeric("total").notNull(),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  items: json("items").notNull(), // Array of order items
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  orderNumber: true,
  status: true,
  total: true,
  customerName: true,
  customerEmail: true,
  items: true,
});

// Conversation schema
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  intent: text("intent"),
  messages: json("messages").notNull(), // Array of message objects
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertConversationSchema = createInsertSchema(conversations).pick({
  userId: true,
  intent: true,
  messages: true,
  active: true,
});

// Analytics schema
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  date: timestamp("date").defaultNow(),
  intentCounts: json("intent_counts").notNull(), // JSON object with intent counts
  intentAccuracy: numeric("intent_accuracy"),
  activeConversations: integer("active_conversations").default(0),
  completedConversations: integer("completed_conversations").default(0),
  avgResponseTime: numeric("avg_response_time"),
});

export const insertAnalyticsSchema = createInsertSchema(analytics).pick({
  date: true,
  intentCounts: true,
  intentAccuracy: true,
  activeConversations: true,
  completedConversations: true,
  avgResponseTime: true,
});

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;

// Message and Intent types for the chatbot
export const messageSchema = z.object({
  id: z.string(),
  sender: z.enum(["user", "bot"]),
  content: z.string(),
  timestamp: z.date().or(z.string()),
  entities: z.array(z.object({
    entity: z.string(),
    value: z.string(),
  })).optional(),
  intent: z.string().optional(),
});

export type Message = z.infer<typeof messageSchema>;

export const intentSchema = z.object({
  name: z.string(),
  confidence: z.number(),
});

export type Intent = z.infer<typeof intentSchema>;
