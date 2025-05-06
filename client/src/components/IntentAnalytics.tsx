import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Analytics } from "@/lib/types";

// Intent bar with label, percentage and colored bar
interface IntentBarProps {
  label: string;
  percentage: number;
  color: string;
}

const IntentBar: React.FC<IntentBarProps> = ({ label, percentage, color }) => {
  return (
    <div className="flex items-center">
      <div className="w-32 text-sm">{label}</div>
      <div className="flex-1 ml-2">
        <div className="bg-gray-100 h-2 rounded-full w-full overflow-hidden">
          <div 
            className={`h-2 rounded-full`} 
            style={{ width: `${percentage}%`, backgroundColor: color }}
          ></div>
        </div>
      </div>
      <div className="ml-2 text-sm font-medium">{percentage}%</div>
    </div>
  );
};

const IntentAnalytics: React.FC = () => {
  const { data: analytics, isLoading } = useQuery<Analytics>({
    queryKey: ["/api/analytics"],
  });
  
  // Get intent counts from database
  const intentCounts = analytics?.intentCounts || {};
  
  // Colors for different intents
  const intentColors: Record<string, string> = {
    "product_inquiry": "#3B82F6", // blue
    "order_status": "#10B981", // green
    "inventory_check": "#F59E0B", // amber
    "returns_refunds": "#EF4444", // red
    "other": "#6B7280" // gray
  };
  
  // Intent labels for display
  const intentLabels: Record<string, string> = {
    "product_inquiry": "Product Inquiries",
    "order_status": "Order Status",
    "inventory_check": "Inventory Check",
    "returns_refunds": "Returns/Refunds",
    "other": "Other"
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Intent Recognition</h3>
        
        <div className="space-y-3">
          {Object.entries(intentCounts).map(([intent, count]) => (
            <IntentBar 
              key={intent}
              label={intentLabels[intent] || intent}
              percentage={count}
              color={intentColors[intent] || "#6B7280"}
            />
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Intent Accuracy</span>
            <span className="text-lg font-bold text-green-600">
              {isLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                `${analytics?.intentAccuracy ? parseFloat(analytics.intentAccuracy).toFixed(1) : '0.0'}%`
              )}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Based on {isLoading ? "..." : (analytics?.completedConversations || 0)} conversations in the past 7 days
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntentAnalytics;
