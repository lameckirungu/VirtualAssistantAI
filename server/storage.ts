import {
  users, products, orders, conversations, analytics,
  type User, type InsertUser,
  type Product, type InsertProduct,
  type Order, type InsertOrder,
  type Conversation, type InsertConversation,
  type Analytics, type InsertAnalytics,
  type Message, messageSchema
} from "@shared/schema";

// Storage interface with CRUD methods for all models
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Order methods
  getOrders(): Promise<Order[]>;
  getRecentOrders(limit: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrderByNumber(orderNumber: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<Order>): Promise<Order | undefined>;
  
  // Conversation methods
  getConversations(): Promise<Conversation[]>;
  getActiveConversations(): Promise<Conversation[]>;
  getConversation(id: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: number, conversation: Partial<Conversation>): Promise<Conversation | undefined>;
  addMessageToConversation(id: number, message: Message): Promise<Conversation | undefined>;
  
  // Analytics methods
  getAnalytics(): Promise<Analytics[]>;
  getLatestAnalytics(): Promise<Analytics | undefined>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  updateAnalytics(id: number, analytics: Partial<Analytics>): Promise<Analytics | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private conversations: Map<number, Conversation>;
  private analyticsData: Map<number, Analytics>;
  
  private userId: number = 1;
  private productId: number = 1;
  private orderId: number = 1;
  private conversationId: number = 1;
  private analyticsId: number = 1;
  
  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.conversations = new Map();
    this.analyticsData = new Map();
    
    // Initialize with some sample data for development
    this.initializeData();
  }
  
  private initializeData() {
    // Add sample products
    const sampleProducts: InsertProduct[] = [
      {
        name: "SoundWave Pro X",
        sku: "WH-SWP-100",
        description: "Premium wireless headphones with noise cancellation",
        price: "129.99",
        quantity: 24,
        status: "in_stock",
        category: "Electronics",
        reorderPoint: 10,
        nextRestock: null,
        imageUrl: null
      },
      {
        name: "AudioPeak Max",
        sku: "WH-APM-200",
        description: "Wireless headphones with enhanced bass",
        price: "89.99",
        quantity: 3,
        status: "low_stock",
        category: "Electronics",
        reorderPoint: 5,
        nextRestock: null,
        imageUrl: null
      },
      {
        name: "BassBoost Elite",
        sku: "WH-BBE-300",
        description: "Premium bass-focused wireless headphones",
        price: "149.99",
        quantity: 0,
        status: "out_of_stock",
        category: "Electronics",
        reorderPoint: 5,
        nextRestock: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        imageUrl: null
      }
    ];
    
    sampleProducts.forEach(product => this.createProduct(product));
    
    // Add sample orders
    const sampleOrders: InsertOrder[] = [
      {
        orderNumber: "38291",
        status: "completed",
        total: "124.95",
        customerName: "John Doe",
        customerEmail: "john.doe@example.com",
        items: [{ productId: 1, quantity: 1, price: "124.95" }]
      },
      {
        orderNumber: "38290",
        status: "processing",
        total: "89.99",
        customerName: "Jane Smith",
        customerEmail: "jane.smith@example.com",
        items: [{ productId: 2, quantity: 1, price: "89.99" }]
      },
      {
        orderNumber: "38289",
        status: "shipped",
        total: "245.50",
        customerName: "Bob Johnson",
        customerEmail: "bob.johnson@example.com",
        items: [{ productId: 3, quantity: 1, price: "149.99" }, { productId: 2, quantity: 1, price: "89.99" }]
      }
    ];
    
    sampleOrders.forEach(order => this.createOrder(order));
    
    // Add sample analytics
    const sampleAnalytics: InsertAnalytics = {
      date: new Date(),
      intentCounts: {
        "product_inquiry": 38,
        "order_status": 24,
        "inventory_check": 18,
        "returns_refunds": 12,
        "other": 8
      },
      intentAccuracy: 94.7,
      activeConversations: 12,
      completedConversations: 154,
      avgResponseTime: 1.5
    };
    
    this.createAnalytics(sampleAnalytics);
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = { ...user, id, createdAt: new Date() };
    this.users.set(id, newUser);
    return newUser;
  }
  
  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductBySku(sku: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(product => product.sku === sku);
  }
  
  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(product => 
      product.name.toLowerCase().includes(lowerQuery) || 
      product.sku.toLowerCase().includes(lowerQuery) ||
      (product.description && product.description.toLowerCase().includes(lowerQuery))
    );
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => 
      product.category === category
    );
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const now = new Date();
    const newProduct: Product = { 
      ...product, 
      id, 
      createdAt: now, 
      updatedAt: now
    };
    this.products.set(id, newProduct);
    return newProduct;
  }
  
  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct: Product = { 
      ...product, 
      ...updates, 
      updatedAt: new Date()
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
  
  // Order methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }
  
  async getRecentOrders(limit: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(order => order.orderNumber === orderNumber);
  }
  
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderId++;
    const now = new Date();
    const newOrder: Order = { 
      ...order, 
      id, 
      createdAt: now, 
      updatedAt: now
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }
  
  async updateOrder(id: number, updates: Partial<Order>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder: Order = { 
      ...order, 
      ...updates, 
      updatedAt: new Date()
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Conversation methods
  async getConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values());
  }
  
  async getActiveConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).filter(conversation => conversation.active);
  }
  
  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }
  
  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const id = this.conversationId++;
    const now = new Date();
    const newConversation: Conversation = { 
      ...conversation, 
      id, 
      createdAt: now, 
      updatedAt: now
    };
    this.conversations.set(id, newConversation);
    return newConversation;
  }
  
  async updateConversation(id: number, updates: Partial<Conversation>): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(id);
    if (!conversation) return undefined;
    
    const updatedConversation: Conversation = { 
      ...conversation, 
      ...updates, 
      updatedAt: new Date()
    };
    this.conversations.set(id, updatedConversation);
    return updatedConversation;
  }
  
  async addMessageToConversation(id: number, message: Message): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(id);
    if (!conversation) return undefined;
    
    const validatedMessage = messageSchema.parse(message);
    const messages = [...(conversation.messages as Message[]), validatedMessage];
    
    const updatedConversation: Conversation = { 
      ...conversation, 
      messages, 
      updatedAt: new Date()
    };
    this.conversations.set(id, updatedConversation);
    return updatedConversation;
  }
  
  // Analytics methods
  async getAnalytics(): Promise<Analytics[]> {
    return Array.from(this.analyticsData.values());
  }
  
  async getLatestAnalytics(): Promise<Analytics | undefined> {
    return Array.from(this.analyticsData.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }
  
  async createAnalytics(analytics: InsertAnalytics): Promise<Analytics> {
    const id = this.analyticsId++;
    const newAnalytics: Analytics = { 
      ...analytics, 
      id
    };
    this.analyticsData.set(id, newAnalytics);
    return newAnalytics;
  }
  
  async updateAnalytics(id: number, updates: Partial<Analytics>): Promise<Analytics | undefined> {
    const analytics = this.analyticsData.get(id);
    if (!analytics) return undefined;
    
    const updatedAnalytics: Analytics = { 
      ...analytics, 
      ...updates
    };
    this.analyticsData.set(id, updatedAnalytics);
    return updatedAnalytics;
  }
}

export const storage = new MemStorage();
