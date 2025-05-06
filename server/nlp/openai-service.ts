import OpenAI from "openai";
import { type Message, type Intent } from "@shared/schema";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class OpenAIService {
  /**
   * Analyzes intent using OpenAI
   */
  async analyzeIntent(text: string): Promise<Intent> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are an intent classifier for a business management assistant focused on inventory and order management. 
            Analyze the user's message to determine their intent and assign a confidence score.
            Respond with JSON in this format: { "name": "intent_name", "confidence": confidence_score }
            
            Possible intents:
            - greeting: Hello, hi, etc.
            - inventory_check: Queries about current inventory levels, stock status
            - inventory_restock: Requests to restock or add more inventory
            - order_status: Questions about an order's current status
            - product_inquiry: Questions about specific products
            - returns_refunds: Inquiries about returning products or getting refunds
            - help: Requests for help or assistance with the system
            - goodbye: Farewell messages, closing the conversation
            - general_inquiry: General questions not fitting other categories`
          },
          {
            role: "user",
            content: text
          }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content);

      return {
        name: result.name,
        confidence: result.confidence
      };
    } catch (error: any) {
      // Check if this is a quota error or other OpenAI error
      if (error?.error?.code === 'insufficient_quota' || error?.code === 'insufficient_quota') {
        console.error("OpenAI API quota exceeded. Using fallback classifier instead:", error.message);
      } else {
        console.error("Error analyzing intent with OpenAI:", error);
      }
      
      // Always throw the error to trigger fallback system
      throw error;
    }
  }

  /**
   * Extracts entities using OpenAI
   */
  async extractEntities(text: string): Promise<Array<{ entity: string, value: string }>> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are an entity extraction system for a Kenyan business management assistant.
            Analyze the user's message to identify and extract relevant entities.
            Respond with a JSON array of entities in this format: [{ "entity": "entity_type", "value": "extracted_value" }]
            
            Entity types to extract:
            - product: Names of products mentioned
            - quantity: Numerical quantities mentioned
            - sku: Product SKU or product codes
            - date: Dates mentioned in any format
            - order_number: Order reference numbers
            - customer_name: Names of customers
            - category: Product categories mentioned
            
            Only extract entities that are explicitly mentioned. Do not infer entities.
            If no entities are found, return an empty array.`
          },
          {
            role: "user",
            content: text
          }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content);
      
      // Ensure we have an array, even if empty
      return Array.isArray(result) ? result : [];
    } catch (error: any) {
      // Check if this is a quota error or other OpenAI error
      if (error?.error?.code === 'insufficient_quota' || error?.code === 'insufficient_quota') {
        console.error("OpenAI API quota exceeded. Using fallback entity extractor instead:", error.message);
      } else {
        console.error("Error extracting entities with OpenAI:", error);
      }
      
      // Always throw the error to trigger fallback system
      throw error;
    }
  }

  /**
   * Generates a response based on intent, entities, and conversation context
   */
  async generateResponse(
    intent: Intent, 
    entities: Array<{ entity: string, value: string }>,
    contextMessages: Message[] = []
  ): Promise<string> {
    try {
      // Prepare conversation history (limited to last 5 messages for context)
      const recentMessages = contextMessages.slice(-5).map(msg => {
        return {
          role: msg.sender === "user" ? "user" as const : "assistant" as const, 
          content: msg.content || ""
        };
      });

      // Prepare prompt with intent and entities information
      const systemPrompt = `You are a helpful virtual assistant for a Kenyan business focused on inventory and order management.
      The user's intent has been classified as "${intent.name}" with confidence ${intent.confidence}.
      The following entities have been extracted: ${JSON.stringify(entities)}
      
      Tips for responding:
      - Use natural, conversational language that's friendly and helpful
      - Always respond in English
      - Always list prices in KSH (Kenyan Shillings)
      - For product inquiries, include details like price, availability, and description
      - For order status requests, provide tracking details if available
      - For inventory checks, be specific about quantities and restocking dates
      - For low stock or out-of-stock items, suggest alternatives if available
      - Keep responses concise but informative
      - If you need more information to fulfill a request, ask specific follow-up questions
      
      If you're not sure how to respond, offer to connect the user with customer service.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: systemPrompt },
          ...recentMessages
        ],
        max_tokens: 500
      });

      return response.choices[0].message.content || "I'm not sure how to respond to that. Can you please rephrase your question?";
    } catch (error) {
      // Check if this is a quota error or other OpenAI error
      if (error?.error?.code === 'insufficient_quota' || error?.code === 'insufficient_quota') {
        console.error("OpenAI API quota exceeded. Using fallback response generator instead:", error.message);
      } else {
        console.error("Error generating response with OpenAI:", error);
      }
      
      // Always throw the error to trigger fallback system
      throw error;
    }
  }
}

export const openaiService = new OpenAIService();