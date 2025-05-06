import React from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, Package, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InventorySummary, TodaysOrders } from "@/lib/types";

const BusinessInsights: React.FC = () => {
  const { data: inventorySummary, isLoading: isLoadingInventory } = useQuery<InventorySummary>({
    queryKey: ["/api/inventory/summary"],
  });
  
  const { data: analytics, isLoading: isLoadingAnalytics } = useQuery<{ activeConversations: number }>({
    queryKey: ["/api/analytics"],
  });
  
  const { data: todaysOrders, isLoading: isLoadingOrders } = useQuery<TodaysOrders>({
    queryKey: ["/api/orders/today"],
  });
  
  const isLoading = isLoadingInventory || isLoadingAnalytics || isLoadingOrders;
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Business Insights</h3>
        
        <div className="space-y-4">
          {/* Active Conversations */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-blue-700">Active Conversations</p>
                <p className="text-2xl font-bold text-blue-800">
                  {isLoading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    analytics?.activeConversations || 0
                  )}
                </p>
              </div>
              <MessageSquare className="text-blue-500" size={24} />
            </div>
            <div className="mt-2">
              <div className="bg-blue-100 h-1.5 rounded-full w-full overflow-hidden">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "100%" }}></div>
              </div>
              <p className="text-xs text-blue-700 mt-1">Active customer conversations</p>
            </div>
          </div>
          
          {/* Inventory Status */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-green-700">Inventory Status</p>
                <p className="text-2xl font-bold text-green-800">
                  {isLoadingInventory ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    `${Math.round(
                      ((inventorySummary?.inStock || 0) / (inventorySummary?.totalProducts || 1)) * 100
                    )}%`
                  )}
                </p>
              </div>
              <Package className="text-green-500" size={24} />
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              <div className="bg-green-100 p-1.5 rounded text-center">
                <span className="font-medium text-green-800">
                  {isLoadingInventory ? "..." : inventorySummary?.inStock || 0}
                </span>
                <p className="text-green-700">In Stock</p>
              </div>
              <div className="bg-amber-100 p-1.5 rounded text-center">
                <span className="font-medium text-amber-800">
                  {isLoadingInventory ? "..." : inventorySummary?.lowStock || 0}
                </span>
                <p className="text-amber-700">Low Stock</p>
              </div>
              <div className="bg-red-100 p-1.5 rounded text-center">
                <span className="font-medium text-red-800">
                  {isLoadingInventory ? "..." : inventorySummary?.outOfStock || 0}
                </span>
                <p className="text-red-700">Out of Stock</p>
              </div>
            </div>
          </div>
          
          {/* Today's Orders */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-purple-700">Today's Orders</p>
                <p className="text-2xl font-bold text-purple-800">
                  {isLoadingOrders ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    todaysOrders?.count || 0
                  )}
                </p>
              </div>
              <ShoppingCart className="text-purple-500" size={24} />
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-purple-700">
                <span>
                  Total Value: KSh {isLoadingOrders ? "..." : (todaysOrders?.totalValue || 0).toLocaleString() || "0"}
                </span>
                <span>
                  Avg: KSh {isLoadingOrders ? "..." : (todaysOrders?.averageValue || 0).toLocaleString() || "0"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessInsights;
