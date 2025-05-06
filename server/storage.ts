import {
  users, products, orders, conversations, analytics,
  type User, type InsertUser,
  type Product, type InsertProduct,
  type Order, type InsertOrder,
  type Conversation, type InsertConversation,
  type Analytics, type InsertAnalytics,
  type Message, messageSchema
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, like, desc, and, gt, gte, or } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";

// Storage interface with CRUD methods for all models
export interface IStorage {
  // Session store for authentication
  sessionStore: session.Store;
  
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
  
  public sessionStore: session.Store;
  
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
    
    // Initialize memory-based session store
    const MemoryStore = require('memorystore')(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Initialize with some sample data for development
    this.initializeData();
  }
  
  private initializeData() {
    // Add Kenya-specific products
    const kenyaProducts: InsertProduct[] = [
      {
        name: "M-KOPA Solar Home System",
        sku: "KEN-MKP-001",
        description: "Complete solar power system for homes with lights, radio, and phone charging",
        price: "99.99",
        priceKsh: "12500",
        quantity: 45,
        status: "in_stock",
        category: "Solar",
        reorderPoint: 10,
        nextRestock: null,
        imageUrl: null,
        isPopular: true
      },
      {
        name: "Jikokoa Charcoal Stove",
        sku: "KEN-JKS-002",
        description: "Energy-efficient charcoal cooking stove that reduces fuel consumption by 50%",
        price: "39.99",
        priceKsh: "5000",
        quantity: 78,
        status: "in_stock",
        category: "Kitchen",
        reorderPoint: 15,
        nextRestock: null,
        imageUrl: null,
        isPopular: true
      },
      {
        name: "Kenyan Premium Coffee Beans",
        sku: "KEN-COF-003",
        description: "Premium AA grade Kenyan coffee beans from Central Highlands, 500g pack",
        price: "14.99",
        priceKsh: "1875",
        quantity: 120,
        status: "in_stock",
        category: "Food",
        reorderPoint: 30,
        nextRestock: null,
        imageUrl: null,
        isPopular: true
      },
      {
        name: "Maasai Beaded Necklace",
        sku: "KEN-BDN-004",
        description: "Handcrafted traditional Maasai beaded necklace in vibrant colors",
        price: "29.99",
        priceKsh: "3750",
        quantity: 35,
        status: "in_stock",
        category: "Crafts",
        reorderPoint: 10,
        nextRestock: null,
        imageUrl: null,
        isPopular: false
      },
      {
        name: "Kiondo Basket Bag",
        sku: "KEN-KIO-005",
        description: "Handwoven sisal and leather basket bag, traditional Kenyan craft",
        price: "49.99",
        priceKsh: "6250",
        quantity: 25,
        status: "in_stock",
        category: "Crafts",
        reorderPoint: 8,
        nextRestock: null,
        imageUrl: null,
        isPopular: true
      },
      {
        name: "Kikoy Beach Towel",
        sku: "KEN-KIK-006",
        description: "Traditional Kenyan cotton kikoy fabric, perfect for beach or home use",
        price: "19.99",
        priceKsh: "2500",
        quantity: 60,
        status: "in_stock",
        category: "Textiles",
        reorderPoint: 15,
        nextRestock: null,
        imageUrl: null,
        isPopular: false
      },
      {
        name: "Kenyan Tea Leaves",
        sku: "KEN-TEA-007",
        description: "Premium loose leaf Kenyan black tea from Central Highlands, 250g pack",
        price: "8.99",
        priceKsh: "1125",
        quantity: 95,
        status: "in_stock",
        category: "Food",
        reorderPoint: 20,
        nextRestock: null,
        imageUrl: null,
        isPopular: true
      },
      {
        name: "Maasai Shuka Blanket",
        sku: "KEN-MSB-008",
        description: "Traditional red checked Maasai shuka blanket/wrap",
        price: "34.99",
        priceKsh: "4375",
        quantity: 40,
        status: "in_stock",
        category: "Textiles",
        reorderPoint: 10,
        nextRestock: null,
        imageUrl: null,
        isPopular: false
      },
      {
        name: "Soapstone Sculpture",
        sku: "KEN-SSS-009",
        description: "Hand-carved Kisii soapstone animal figurine",
        price: "24.99",
        priceKsh: "3125",
        quantity: 30,
        status: "in_stock",
        category: "Crafts",
        reorderPoint: 8,
        nextRestock: null,
        imageUrl: null,
        isPopular: false
      },
      {
        name: "Safari Hat",
        sku: "KEN-SFH-010",
        description: "Wide-brimmed safari hat, perfect for Kenyan safaris",
        price: "22.99",
        priceKsh: "2875",
        quantity: 50,
        status: "in_stock",
        category: "Clothing",
        reorderPoint: 12,
        nextRestock: null,
        imageUrl: null,
        isPopular: false
      },
      {
        name: "Maize Flour (Unga)",
        sku: "KEN-UNG-011",
        description: "Premium white maize flour for making ugali, 2kg package",
        price: "4.99",
        priceKsh: "625",
        quantity: 3,
        status: "low_stock",
        category: "Food",
        reorderPoint: 20,
        nextRestock: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        imageUrl: null,
        isPopular: true
      },
      {
        name: "Recycled Flip Flops Art",
        sku: "KEN-FFA-012",
        description: "Colorful animal figurines made from recycled flip-flops",
        price: "18.99",
        priceKsh: "2375",
        quantity: 25,
        status: "in_stock",
        category: "Crafts",
        reorderPoint: 8,
        nextRestock: null,
        imageUrl: null,
        isPopular: false
      },
      {
        name: "African Print Fabric",
        sku: "KEN-APF-013",
        description: "Vibrant Ankara/Kitenge fabric, 2 yards",
        price: "15.99",
        priceKsh: "2000",
        quantity: 65,
        status: "in_stock",
        category: "Textiles",
        reorderPoint: 15,
        nextRestock: null,
        imageUrl: null,
        isPopular: true
      },
      {
        name: "Kenyan Honey",
        sku: "KEN-HON-014",
        description: "Pure natural honey from Kenyan highlands, 500g jar",
        price: "12.99",
        priceKsh: "1625",
        quantity: 2,
        status: "low_stock",
        category: "Food",
        reorderPoint: 10,
        nextRestock: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        imageUrl: null,
        isPopular: false
      },
      {
        name: "Akala Sandals",
        sku: "KEN-AKL-015",
        description: "Traditional Kenyan sandals made from recycled tires",
        price: "16.99",
        priceKsh: "2125",
        quantity: 40,
        status: "in_stock",
        category: "Footwear",
        reorderPoint: 10,
        nextRestock: null,
        imageUrl: null,
        isPopular: false
      },
      {
        name: "Wooden Salad Servers",
        sku: "KEN-WSS-016",
        description: "Hand-carved olive wood salad servers",
        price: "19.99",
        priceKsh: "2500",
        quantity: 35,
        status: "in_stock",
        category: "Kitchen",
        reorderPoint: 10,
        nextRestock: null,
        imageUrl: null,
        isPopular: false
      },
      {
        name: "Masai Beaded Belt",
        sku: "KEN-MBB-017",
        description: "Colorful handcrafted Masai beaded belt",
        price: "27.99",
        priceKsh: "3500",
        quantity: 0,
        status: "out_of_stock",
        category: "Clothing",
        reorderPoint: 5,
        nextRestock: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        imageUrl: null,
        isPopular: false
      },
      {
        name: "Coconut Oil",
        sku: "KEN-CCO-018",
        description: "Cold-pressed virgin coconut oil from Kenyan coast, 250ml",
        price: "9.99",
        priceKsh: "1250",
        quantity: 28,
        status: "in_stock",
        category: "Health",
        reorderPoint: 10,
        nextRestock: null,
        imageUrl: null,
        isPopular: false
      },
      {
        name: "Kanga Fabric",
        sku: "KEN-KNG-019",
        description: "Traditional Kanga cotton fabric with proverb, set of 2",
        price: "23.99",
        priceKsh: "3000",
        quantity: 45,
        status: "in_stock",
        category: "Textiles",
        reorderPoint: 12,
        nextRestock: null,
        imageUrl: null,
        isPopular: true
      },
      {
        name: "Soapstone Chess Set",
        sku: "KEN-SCS-020",
        description: "Hand-carved Kisii soapstone chess set with African motifs",
        price: "59.99",
        priceKsh: "7500",
        quantity: 0,
        status: "out_of_stock",
        category: "Crafts",
        reorderPoint: 5,
        nextRestock: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        imageUrl: null,
        isPopular: false
      }
    ];
    
    kenyaProducts.forEach(product => this.createProduct(product));
    
    // Add sample orders for Kenya with KSH pricing
    const sampleOrders: InsertOrder[] = [
      {
        orderNumber: "38291",
        status: "completed",
        total: "124.95",
        totalKsh: "15619",
        customerName: "John Doe",
        customerEmail: "john.doe@example.com",
        items: [{ productId: 1, quantity: 1, price: "124.95", priceKsh: "15619" }]
      },
      {
        orderNumber: "38290",
        status: "processing",
        total: "89.99",
        totalKsh: "11249",
        customerName: "Jane Smith",
        customerEmail: "jane.smith@example.com",
        items: [{ productId: 2, quantity: 1, price: "89.99", priceKsh: "11249" }]
      },
      {
        orderNumber: "38289",
        status: "shipped",
        total: "245.50",
        totalKsh: "30688",
        customerName: "Bob Johnson",
        customerEmail: "bob.johnson@example.com",
        items: [
          { productId: 3, quantity: 1, price: "149.99", priceKsh: "18749" }, 
          { productId: 2, quantity: 1, price: "89.99", priceKsh: "11249" }
        ]
      }
    ];
    
    sampleOrders.forEach(order => this.createOrder(order));
    
    // Add sample analytics
    const sampleAnalytics: InsertAnalytics = {
      date: new Date(),
      intentCounts: {
        "product_inquiry": "38",
        "order_status": "24",
        "inventory_check": "18",
        "returns_refunds": "12",
        "other": "8"
      },
      intentAccuracy: "94.7",
      activeConversations: "12",
      completedConversations: "154",
      avgResponseTime: "1.5"
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

export class DatabaseStorage implements IStorage {
  // Session store for authentication
  public sessionStore: session.Store;

  constructor() {
    // Initialize session store with PostgreSQL
    const PostgresStore = connectPg(session);
    this.sessionStore = new PostgresStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      tableName: 'session',
      createTableIfMissing: true,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }
  
  // Product methods
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }
  
  async getProductBySku(sku: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.sku, sku));
    return product;
  }
  
  async searchProducts(query: string): Promise<Product[]> {
    const searchTerm = `%${query}%`;
    return await db.select().from(products).where(
      or(
        like(products.name, searchTerm),
        like(products.sku, searchTerm),
        like(products.description, searchTerm)
      )
    );
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }
  
  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result !== null && result.rowCount > 0;
  }
  
  // Order methods
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }
  
  async getRecentOrders(limit: number): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limit);
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }
  
  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
    return order;
  }
  
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }
  
  async updateOrder(id: number, updates: Partial<Order>): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }
  
  // Conversation methods
  async getConversations(): Promise<Conversation[]> {
    return await db.select().from(conversations);
  }
  
  async getActiveConversations(): Promise<Conversation[]> {
    return await db.select().from(conversations).where(eq(conversations.active, true));
  }
  
  async getConversation(id: number): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation;
  }
  
  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const [newConversation] = await db.insert(conversations).values(conversation).returning();
    return newConversation;
  }
  
  async updateConversation(id: number, updates: Partial<Conversation>): Promise<Conversation | undefined> {
    const [updatedConversation] = await db
      .update(conversations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(conversations.id, id))
      .returning();
    return updatedConversation;
  }
  
  async addMessageToConversation(id: number, message: Message): Promise<Conversation | undefined> {
    // First get the current conversation
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id));
    
    if (!conversation) return undefined;
    
    // Validate the message
    const validatedMessage = messageSchema.parse(message);
    
    // Append the new message to existing messages
    const messages = [...(conversation.messages as Message[]), validatedMessage];
    
    // Update the conversation with new messages
    const [updatedConversation] = await db
      .update(conversations)
      .set({ 
        messages, 
        updatedAt: new Date()
      })
      .where(eq(conversations.id, id))
      .returning();
    
    return updatedConversation;
  }
  
  // Analytics methods
  async getAnalytics(): Promise<Analytics[]> {
    return await db.select().from(analytics);
  }
  
  async getLatestAnalytics(): Promise<Analytics | undefined> {
    const [latestAnalytics] = await db
      .select()
      .from(analytics)
      .orderBy(desc(analytics.date))
      .limit(1);
    return latestAnalytics;
  }
  
  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const [newAnalytics] = await db.insert(analytics).values(analyticsData).returning();
    return newAnalytics;
  }
  
  async updateAnalytics(id: number, updates: Partial<Analytics>): Promise<Analytics | undefined> {
    const [updatedAnalytics] = await db
      .update(analytics)
      .set(updates)
      .where(eq(analytics.id, id))
      .returning();
    return updatedAnalytics;
  }
}

// Use the database storage implementation
export const storage = new DatabaseStorage();
