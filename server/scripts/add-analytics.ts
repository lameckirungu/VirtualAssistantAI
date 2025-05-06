import { db } from "../db";
import { analytics } from "../../shared/schema";

async function addAnalytics() {
  try {
    // Create sample analytics data
    const sampleAnalytics = {
      date: new Date(),
      intentCounts: {
        product_inquiry: 45,
        order_status: 32,
        inventory_check: 18,
        returns_refunds: 12,
        other: 8
      },
      intentAccuracy: "88.5",
      activeConversations: 12,
      completedConversations: 115,
      avgResponseTime: "1.2"
    };
    
    const [result] = await db.insert(analytics).values(sampleAnalytics).returning();
    
    console.log("Successfully added analytics data:", result);
    process.exit(0);
  } catch (error) {
    console.error("Error adding analytics data:", error);
    process.exit(1);
  }
}

addAnalytics();