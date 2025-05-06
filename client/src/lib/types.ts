// Basic types for frontend

export interface Message {
  id: string;
  sender: "user" | "bot";
  content: string;
  timestamp: Date | string;
  entities?: Array<{
    entity: string;
    value: string;
  }>;
  intent?: string;
}

export interface Conversation {
  id: number;
  messages: Message[];
  active: boolean;
  intent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Intent {
  name: string;
  confidence: number;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string;
  price: string;
  quantity: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
  category?: string;
  reorderPoint?: number;
  nextRestock?: string | null;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: "pending" | "processing" | "completed" | "shipped" | "cancelled";
  total: string;
  customerName?: string;
  customerEmail?: string;
  items: any[]; // Array of order items
  createdAt: string;
  updatedAt: string;
}

export interface InventorySummary {
  totalProducts: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  averageStock: number;
}

export interface OrderSummary {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  shippedOrders: number;
  cancelledOrders: number;
  totalValue: number;
  averageValue: number;
}

export interface TodaysOrders {
  count: number;
  totalValue: number;
  averageValue: number;
}

export interface Analytics {
  id: number;
  date: string;
  intentCounts: Record<string, number>;
  intentAccuracy: number;
  activeConversations: number;
  completedConversations: number;
  avgResponseTime: number;
}

export interface ChatResponse {
  message: Message;
  intent: Intent;
  entities: Array<{
    entity: string;
    value: string;
  }>;
  conversationId: number;
}
