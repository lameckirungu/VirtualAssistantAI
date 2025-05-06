// Entity extractor for NLP processing
// In a production system, this would use more advanced NLP techniques

// Define entity types
export type EntityType = "product" | "quantity" | "sku" | "date" | "order_number" | "customer_name" | "category";

export interface Entity {
  entity: EntityType;
  value: string;
  start: number;
  end: number;
}

// Product entities extractor
export class EntityExtractor {
  // Pattern-based entity extraction
  extractEntities(message: string): Entity[] {
    const entities: Entity[] = [];
    const normalizedMessage = message.toLowerCase();
    
    // Extract product names (using a simple list approach)
    const commonProducts = [
      "headphones", "earbuds", "speakers", "soundbar", "microphone",
      "bluetooth", "wireless", "laptop", "smartphone", "tablet"
    ];
    
    commonProducts.forEach(product => {
      const index = normalizedMessage.indexOf(product);
      if (index >= 0) {
        entities.push({
          entity: "product",
          value: product,
          start: index,
          end: index + product.length
        });
      }
    });
    
    // Extract specific product models
    const productModels = [
      "soundwave pro x", "audiopeak max", "bassboost elite"
    ];
    
    productModels.forEach(model => {
      const index = normalizedMessage.indexOf(model);
      if (index >= 0) {
        entities.push({
          entity: "product",
          value: model,
          start: index,
          end: index + model.length
        });
      }
    });
    
    // Extract SKUs
    const skuRegex = /\b([a-z]{2}-[a-z]{3}-\d{3})\b/gi;
    let skuMatch;
    while ((skuMatch = skuRegex.exec(message)) !== null) {
      entities.push({
        entity: "sku",
        value: skuMatch[1],
        start: skuMatch.index,
        end: skuMatch.index + skuMatch[1].length
      });
    }
    
    // Extract quantities
    const quantityRegex = /\b(\d+)\s+(pcs|pieces|units|items)\b/gi;
    let quantityMatch;
    while ((quantityMatch = quantityRegex.exec(message)) !== null) {
      entities.push({
        entity: "quantity",
        value: quantityMatch[1],
        start: quantityMatch.index,
        end: quantityMatch.index + quantityMatch[0].length
      });
    }
    
    // Extract simple quantities (just numbers)
    const simpleQuantityRegex = /\b(\d+)\b/g;
    let simpleQuantityMatch;
    // Only add simple quantities if no other quantity was found
    if (!entities.some(e => e.entity === "quantity")) {
      while ((simpleQuantityMatch = simpleQuantityRegex.exec(message)) !== null) {
        entities.push({
          entity: "quantity",
          value: simpleQuantityMatch[1],
          start: simpleQuantityMatch.index,
          end: simpleQuantityMatch.index + simpleQuantityMatch[1].length
        });
      }
    }
    
    // Extract order numbers
    const orderRegex = /\border(?:\s+number)?(?:\s*|:)\s*#?(\d+)\b/gi;
    let orderMatch;
    while ((orderMatch = orderRegex.exec(message)) !== null) {
      entities.push({
        entity: "order_number",
        value: orderMatch[1],
        start: orderMatch.index,
        end: orderMatch.index + orderMatch[0].length
      });
    }
    
    // Extract category names
    const categories = ["electronics", "audio", "computers", "accessories", "speakers", "headphones"];
    
    categories.forEach(category => {
      const index = normalizedMessage.indexOf(category);
      if (index >= 0) {
        entities.push({
          entity: "category",
          value: category,
          start: index,
          end: index + category.length
        });
      }
    });
    
    return entities;
  }
  
  // Format entities for response (simplified format)
  formatEntities(entities: Entity[]): Array<{ entity: string; value: string }> {
    return entities.map(({ entity, value }) => ({ entity, value }));
  }
}

export const entityExtractor = new EntityExtractor();
