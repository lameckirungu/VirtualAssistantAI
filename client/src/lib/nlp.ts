import { apiRequest } from "@/lib/queryClient";
import { Intent } from "@/lib/types";

// This file contains helper functions for NLP-related tasks

// Map between intent names and human-readable descriptions
export const intentDescriptions: Record<string, string> = {
  "greeting": "Greeting",
  "inventory_check": "Inventory Check",
  "inventory_restock": "Inventory Restock",
  "order_status": "Order Status",
  "order_placement": "Order Placement",
  "product_inquiry": "Product Inquiry",
  "returns_refunds": "Returns & Refunds",
  "general_inquiry": "General Inquiry",
  "help": "Help Request",
  "goodbye": "Farewell"
};

// Get human-readable intent description
export const getIntentDescription = (intent: string): string => {
  return intentDescriptions[intent] || intent;
};

// Format confidence percentage
export const formatConfidence = (confidence: number): string => {
  return `${Math.round(confidence * 100)}%`;
};

// Determine if confidence is high enough to be reliable
export const isConfidenceReliable = (confidence: number): boolean => {
  return confidence >= 0.7;
};

// Extract HTML from bot message content if present
export const extractHtmlContent = (content: string): { 
  text: string; 
  html: string | null;
} => {
  // Check if the content contains any HTML tags
  const hasHtmlTags = /<[a-z][\s\S]*>/i.test(content);
  
  if (hasHtmlTags) {
    // Extract the text part (everything before the first HTML tag)
    const firstTagIndex = content.indexOf('<');
    const text = firstTagIndex > 0 ? content.substring(0, firstTagIndex).trim() : '';
    
    // Extract all HTML content
    const html = firstTagIndex >= 0 ? content.substring(firstTagIndex) : content;
    
    return { text, html };
  }
  
  return { text: content, html: null };
};

// Parse entities from a message
export const parseEntities = (
  entities: Array<{ entity: string; value: string }>
): Record<string, string[]> => {
  const parsed: Record<string, string[]> = {};
  
  entities.forEach(({ entity, value }) => {
    if (!parsed[entity]) {
      parsed[entity] = [];
    }
    
    parsed[entity].push(value);
  });
  
  return parsed;
};

// Get entity display names
export const getEntityDisplayName = (entity: string): string => {
  const displayNames: Record<string, string> = {
    "product": "Product",
    "quantity": "Quantity",
    "sku": "SKU",
    "order_number": "Order Number",
    "date": "Date",
    "category": "Category",
    "customer_name": "Customer"
  };
  
  return displayNames[entity] || entity;
};
