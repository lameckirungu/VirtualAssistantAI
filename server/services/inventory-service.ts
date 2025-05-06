import { storage } from "../storage";
import { Product, InsertProduct } from "@shared/schema";

export class InventoryService {
  // Get all products
  async getAllProducts(): Promise<Product[]> {
    return storage.getProducts();
  }
  
  // Get product by ID
  async getProductById(id: number): Promise<Product | undefined> {
    return storage.getProduct(id);
  }
  
  // Get product by SKU
  async getProductBySku(sku: string): Promise<Product | undefined> {
    return storage.getProductBySku(sku);
  }
  
  // Search products
  async searchProducts(query: string): Promise<Product[]> {
    return storage.searchProducts(query);
  }
  
  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    return storage.getProductsByCategory(category);
  }
  
  // Add new product
  async addProduct(product: InsertProduct): Promise<Product> {
    return storage.createProduct(product);
  }
  
  // Update product
  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
    return storage.updateProduct(id, updates);
  }
  
  // Delete product
  async deleteProduct(id: number): Promise<boolean> {
    return storage.deleteProduct(id);
  }
  
  // Update product stock
  async updateStock(id: number, quantity: number): Promise<Product | undefined> {
    const product = await storage.getProduct(id);
    
    if (!product) {
      return undefined;
    }
    
    const newQuantity = product.quantity + quantity;
    let status = product.status;
    
    // Update status based on new quantity
    if (newQuantity <= 0) {
      status = "out_of_stock";
    } else if (newQuantity <= product.reorderPoint) {
      status = "low_stock";
    } else {
      status = "in_stock";
    }
    
    return storage.updateProduct(id, {
      quantity: newQuantity,
      status
    });
  }
  
  // Set restock date
  async setRestockDate(id: number, date: Date): Promise<Product | undefined> {
    return storage.updateProduct(id, {
      nextRestock: date
    });
  }
  
  // Get low stock products that need reordering
  async getLowStockProducts(): Promise<Product[]> {
    const products = await storage.getProducts();
    return products.filter(product => 
      product.status === "low_stock" || product.status === "out_of_stock"
    );
  }
  
  // Get inventory summary statistics
  async getInventorySummary(): Promise<{
    totalProducts: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
    averageStock: number;
  }> {
    const products = await storage.getProducts();
    
    const inStockProducts = products.filter(p => p.status === "in_stock");
    const lowStockProducts = products.filter(p => p.status === "low_stock");
    const outOfStockProducts = products.filter(p => p.status === "out_of_stock");
    
    const totalStock = products.reduce((sum, product) => sum + product.quantity, 0);
    const averageStock = products.length > 0 ? totalStock / products.length : 0;
    
    return {
      totalProducts: products.length,
      inStock: inStockProducts.length,
      lowStock: lowStockProducts.length,
      outOfStock: outOfStockProducts.length,
      averageStock
    };
  }
}

export const inventoryService = new InventoryService();
