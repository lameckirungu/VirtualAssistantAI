import { Intent, Message } from "@shared/schema";
import { INTENTS } from "./intent-classifier";
import { storage } from "../storage";
import { Product, Order } from "@shared/schema";

// Response generator for handling different intents
export class ResponseGenerator {
  // Generate a response based on intent and entities
  async generateResponse(intent: Intent, entities: Array<{ entity: string; value: string }>, contextMessages: Message[] = []): Promise<string> {
    switch (intent.name) {
      case INTENTS.GREETING:
        return this.handleGreeting();
        
      case INTENTS.INVENTORY_CHECK:
        return await this.handleInventoryCheck(entities);
        
      case INTENTS.INVENTORY_RESTOCK:
        return await this.handleInventoryRestock(entities);
        
      case INTENTS.ORDER_STATUS:
        return await this.handleOrderStatus(entities);
        
      case INTENTS.PRODUCT_INQUIRY:
        return await this.handleProductInquiry(entities);
        
      case INTENTS.RETURNS_REFUNDS:
        return this.handleReturnsRefunds();
        
      case INTENTS.HELP:
        return this.handleHelp();
        
      case INTENTS.GOODBYE:
        return this.handleGoodbye();
        
      case INTENTS.GENERAL_INQUIRY:
      default:
        return this.handleGeneralInquiry();
    }
  }
  
  // Generate HTML for product listing (when returning products)
  formatProductsHtml(products: Product[]): string {
    return products.map(product => {
      let statusText = '';
      let statusClass = '';
      
      if (product.status === 'in_stock') {
        statusText = `In Stock: ${product.quantity}`;
        statusClass = 'text-green-600';
      } else if (product.status === 'low_stock') {
        statusText = `Low Stock: ${product.quantity}`;
        statusClass = 'text-amber-600';
      } else {
        statusText = 'Out of Stock';
        statusClass = 'text-red-600';
      }
      
      return `<div class="bg-white p-2 rounded border border-gray-200">
        <div class="flex justify-between">
          <span class="font-medium text-sm">${product.name}</span>
          <span class="${statusClass} text-sm">${statusText}</span>
        </div>
        <p class="text-xs text-gray-500">SKU: ${product.sku}</p>
      </div>`;
    }).join('\n');
  }
  
  // Intent handlers
  private handleGreeting(): string {
    const greetings = [
      "Hello! I'm your BusinessAI Assistant. How can I help you today?",
      "Hi there! I'm ready to assist with inventory management, customer support, and sales. What do you need?",
      "Welcome! How may I assist you with your business needs today?"
    ];
    
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  private async handleInventoryCheck(entities: Array<{ entity: string; value: string }>): Promise<string> {
    // Extract product name or category
    const productEntity = entities.find(e => e.entity === "product");
    const categoryEntity = entities.find(e => e.entity === "category");
    const skuEntity = entities.find(e => e.entity === "sku");
    
    let products: Product[] = [];
    
    if (skuEntity) {
      // Search by SKU
      const product = await storage.getProductBySku(skuEntity.value.toUpperCase());
      if (product) products = [product];
    } else if (productEntity) {
      // Search by product name
      products = await storage.searchProducts(productEntity.value);
    } else if (categoryEntity) {
      // Search by category
      products = await storage.getProductsByCategory(categoryEntity.value);
    } else {
      // No specific product mentioned, return all products
      products = await storage.getProducts();
    }
    
    if (products.length === 0) {
      return "I couldn't find any products matching your query. Could you provide more details or check the spelling?";
    }
    
    return `I found ${products.length} ${products.length === 1 ? 'product' : 'products'} in our inventory:
    
    <div class="mt-3 space-y-2">
      ${this.formatProductsHtml(products)}
    </div>
    
    Would you like to place an order or get more information about any of these products?`;
  }
  
  private async handleInventoryRestock(entities: Array<{ entity: string; value: string }>): Promise<string> {
    // Extract product name or SKU
    const productEntity = entities.find(e => e.entity === "product");
    const skuEntity = entities.find(e => e.entity === "sku");
    
    let product: Product | undefined;
    
    if (skuEntity) {
      // Get by SKU
      product = await storage.getProductBySku(skuEntity.value.toUpperCase());
    } else if (productEntity) {
      // Search by product name and get first result
      const products = await storage.searchProducts(productEntity.value);
      if (products.length > 0) {
        product = products[0];
      }
    }
    
    if (!product) {
      return "I couldn't find the specific product you're asking about. Could you provide the product name or SKU?";
    }
    
    if (product.status !== 'out_of_stock') {
      return `${product.name} (${product.sku}) is currently ${product.status === 'in_stock' ? 'in stock' : 'low in stock'} with ${product.quantity} units available. No restock is currently scheduled.`;
    }
    
    if (product.nextRestock) {
      const restockDate = new Date(product.nextRestock);
      const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      return `I checked our system and the ${product.name} (${product.sku}) is scheduled to be back in stock by ${formatter.format(restockDate)}. We'll be receiving a shipment of 15 units.
      
      Would you like me to notify you when they're available?`;
    } else {
      return `${product.name} (${product.sku}) is currently out of stock. Unfortunately, we don't have a confirmed restock date yet. Would you like me to notify you when we have more information?`;
    }
  }
  
  private async handleOrderStatus(entities: Array<{ entity: string; value: string }>): Promise<string> {
    const orderNumberEntity = entities.find(e => e.entity === "order_number");
    
    if (!orderNumberEntity) {
      return "To check an order status, please provide your order number. For example, 'What's the status of order #38291?'";
    }
    
    const order = await storage.getOrderByNumber(orderNumberEntity.value);
    
    if (!order) {
      return `I couldn't find an order with number #${orderNumberEntity.value}. Please check the number and try again.`;
    }
    
    const statusMessages: Record<string, string> = {
      'pending': 'has been received and is pending processing',
      'processing': 'is currently being processed',
      'completed': 'has been completed',
      'shipped': 'has been shipped and is on its way to you',
      'cancelled': 'has been cancelled'
    };
    
    const statusMessage = statusMessages[order.status] || 'is being processed';
    
    return `Order #${order.orderNumber} ${statusMessage}. This order was placed on ${new Date(order.createdAt).toLocaleDateString()} with a total of $${order.total}.
    
    Can I help you with anything else regarding this order?`;
  }
  
  private async handleProductInquiry(entities: Array<{ entity: string; value: string }>): Promise<string> {
    const productEntity = entities.find(e => e.entity === "product");
    const skuEntity = entities.find(e => e.entity === "sku");
    
    let product: Product | undefined;
    
    if (skuEntity) {
      product = await storage.getProductBySku(skuEntity.value.toUpperCase());
    } else if (productEntity) {
      const products = await storage.searchProducts(productEntity.value);
      if (products.length > 0) {
        product = products[0];
      }
    }
    
    if (!product) {
      return "I couldn't find specific information about that product. Could you provide more details or ask about a different product?";
    }
    
    return `Here's information about ${product.name} (${product.sku}):
    
    ${product.description || 'No detailed description available.'}
    
    Price: $${product.price}
    Availability: ${product.status === 'in_stock' ? `In stock (${product.quantity} units available)` : product.status === 'low_stock' ? `Low stock (${product.quantity} units available)` : 'Out of stock'}
    ${product.status === 'out_of_stock' && product.nextRestock ? `Expected restock: ${new Date(product.nextRestock).toLocaleDateString()}` : ''}
    
    Would you like to know more or place an order for this product?`;
  }
  
  private handleReturnsRefunds(): string {
    return "Our return policy allows returns within 30 days of purchase with the original receipt. To initiate a return or request a refund, please provide your order number and the reason for the return.";
  }
  
  private handleHelp(): string {
    return "I can assist you with various business tasks. Here are some things you can ask me:\n\n" +
      "- Check inventory for specific products\n" +
      "- Get information about product restocking\n" +
      "- Check the status of an order\n" +
      "- Get detailed product information\n" +
      "- Learn about our return and refund policies\n\n" +
      "How can I help you today?";
  }
  
  private handleGoodbye(): string {
    const goodbyes = [
      "Thank you for using BusinessAI Assistant. Have a great day!",
      "Goodbye! Feel free to return if you need any more assistance.",
      "Thanks for chatting. I'm here whenever you need help with your business needs."
    ];
    
    return goodbyes[Math.floor(Math.random() * goodbyes.length)];
  }
  
  private handleGeneralInquiry(): string {
    return "I'm your BusinessAI Assistant, designed to help with inventory management, customer support, and sales assistance. I can check product availability, provide order status updates, answer product questions, and much more. What business task can I help you with today?";
  }
}

export const responseGenerator = new ResponseGenerator();
