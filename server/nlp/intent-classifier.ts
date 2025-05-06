import { Intent } from "@shared/schema";

// Define available intents
export const INTENTS = {
  GREETING: "greeting",
  INVENTORY_CHECK: "inventory_check",
  INVENTORY_RESTOCK: "inventory_restock",
  ORDER_STATUS: "order_status", 
  ORDER_PLACEMENT: "order_placement",
  PRODUCT_INQUIRY: "product_inquiry",
  RETURNS_REFUNDS: "returns_refunds",
  GENERAL_INQUIRY: "general_inquiry",
  HELP: "help",
  GOODBYE: "goodbye"
};

// Simple pattern-based intent classifier
// In a production system, this would use more advanced NLP techniques
export class IntentClassifier {
  private patterns: Record<string, string[]>;
  
  constructor() {
    this.patterns = {
      [INTENTS.GREETING]: [
        "hello", "hi", "hey", "good morning", "good afternoon", "good evening", "howdy"
      ],
      [INTENTS.INVENTORY_CHECK]: [
        "check inventory", "check stock", "do you have", "how many", "in stock", "available", 
        "check for", "stock level", "stock status"
      ],
      [INTENTS.INVENTORY_RESTOCK]: [
        "restock", "when will", "back in stock", "get more", "next shipment", "restocking",
        "replenish", "new stock", "availability date", "when can i get"
      ],
      [INTENTS.ORDER_STATUS]: [
        "order status", "track order", "where is my order", "shipping status", "delivery status",
        "order #", "order number", "has my order shipped"
      ],
      [INTENTS.ORDER_PLACEMENT]: [
        "place order", "buy", "purchase", "add to cart", "checkout", "ordering", "want to order"
      ],
      [INTENTS.PRODUCT_INQUIRY]: [
        "product details", "tell me about", "features", "specifications", "compare", "difference between",
        "product information", "what is", "how does", "description"
      ],
      [INTENTS.RETURNS_REFUNDS]: [
        "return", "refund", "money back", "exchange", "broken", "damaged", "not working", "defective"
      ],
      [INTENTS.HELP]: [
        "help", "assist", "support", "guide", "how do i", "can you help", "need assistance"
      ],
      [INTENTS.GOODBYE]: [
        "goodbye", "bye", "see you", "thanks", "thank you", "that's all", "exit", "quit"
      ],
      [INTENTS.GENERAL_INQUIRY]: [
        "what can you do", "capabilities", "features", "ability"
      ]
    };
  }
  
  classify(message: string): Intent {
    const normalizedMessage = message.toLowerCase();
    let highestConfidence = 0;
    let detectedIntent = INTENTS.GENERAL_INQUIRY;
    
    // Check each intent pattern for matches
    for (const [intent, patterns] of Object.entries(this.patterns)) {
      const matchCount = patterns.filter(pattern => 
        normalizedMessage.includes(pattern)
      ).length;
      
      const confidence = matchCount > 0 ? matchCount / patterns.length : 0;
      
      if (confidence > highestConfidence) {
        highestConfidence = confidence;
        detectedIntent = intent;
      }
    }
    
    // Extract entities (in a real system, this would be more sophisticated)
    // If confidence is too low, default to general inquiry
    if (highestConfidence < 0.1) {
      detectedIntent = INTENTS.GENERAL_INQUIRY;
      highestConfidence = 1.0;
    }
    
    // Calculate final confidence score
    const confidenceScore = Math.min(0.5 + highestConfidence, 1.0);
    
    return {
      name: detectedIntent,
      confidence: confidenceScore
    };
  }
}

export const intentClassifier = new IntentClassifier();
