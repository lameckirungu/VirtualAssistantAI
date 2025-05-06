import { storage } from "../storage";
import { Order, InsertOrder } from "@shared/schema";
import { inventoryService } from "./inventory-service";

export class OrderService {
  // Get all orders
  async getAllOrders(): Promise<Order[]> {
    return storage.getOrders();
  }
  
  // Get recent orders
  async getRecentOrders(limit: number = 5): Promise<Order[]> {
    return storage.getRecentOrders(limit);
  }
  
  // Get order by ID
  async getOrderById(id: number): Promise<Order | undefined> {
    return storage.getOrder(id);
  }
  
  // Get order by order number
  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    return storage.getOrderByNumber(orderNumber);
  }
  
  // Create new order
  async createOrder(order: InsertOrder): Promise<Order> {
    // Create the order
    const newOrder = await storage.createOrder(order);
    
    // Update inventory based on ordered items
    for (const item of newOrder.items as any[]) {
      if (item.productId && item.quantity) {
        await inventoryService.updateStock(item.productId, -item.quantity);
      }
    }
    
    return newOrder;
  }
  
  // Update order status
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    return storage.updateOrder(id, { status });
  }
  
  // Get orders summary statistics
  async getOrdersSummary(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    completedOrders: number;
    shippedOrders: number;
    cancelledOrders: number;
    totalValue: number;
    averageValue: number;
  }> {
    const orders = await storage.getOrders();
    
    const pendingOrders = orders.filter(o => o.status === "pending");
    const processingOrders = orders.filter(o => o.status === "processing");
    const completedOrders = orders.filter(o => o.status === "completed");
    const shippedOrders = orders.filter(o => o.status === "shipped");
    const cancelledOrders = orders.filter(o => o.status === "cancelled");
    
    const totalValue = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const averageValue = orders.length > 0 ? totalValue / orders.length : 0;
    
    return {
      totalOrders: orders.length,
      pendingOrders: pendingOrders.length,
      processingOrders: processingOrders.length,
      completedOrders: completedOrders.length,
      shippedOrders: shippedOrders.length,
      cancelledOrders: cancelledOrders.length,
      totalValue,
      averageValue
    };
  }
  
  // Get today's orders
  async getTodaysOrders(): Promise<{
    count: number;
    totalValue: number;
    averageValue: number;
  }> {
    const allOrders = await storage.getOrders();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysOrders = allOrders.filter(order => {
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });
    
    const totalValue = todaysOrders.reduce((sum, order) => sum + Number(order.total), 0);
    const averageValue = todaysOrders.length > 0 ? totalValue / todaysOrders.length : 0;
    
    return {
      count: todaysOrders.length,
      totalValue,
      averageValue
    };
  }
}

export const orderService = new OrderService();
