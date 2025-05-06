import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/lib/types";

// Format timestamp to relative time (e.g., "15 minutes ago")
const formatRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
};

// Get badge color based on order status
const getStatusBadgeClass = (status: string): string => {
  const statusColors: Record<string, string> = {
    "completed": "bg-green-100 text-green-800",
    "processing": "bg-amber-100 text-amber-800",
    "shipped": "bg-blue-100 text-blue-800",
    "pending": "bg-gray-100 text-gray-800",
    "cancelled": "bg-red-100 text-red-800"
  };
  
  return statusColors[status] || "bg-gray-100 text-gray-800";
};

// Get background color for the icon
const getIconBgClass = (status: string): string => {
  const bgColors: Record<string, string> = {
    "completed": "bg-green-100",
    "processing": "bg-amber-100",
    "shipped": "bg-blue-100",
    "pending": "bg-gray-100",
    "cancelled": "bg-red-100"
  };
  
  return bgColors[status] || "bg-gray-100";
};

// Get icon color
const getIconColorClass = (status: string): string => {
  const iconColors: Record<string, string> = {
    "completed": "text-green-500",
    "processing": "text-amber-500",
    "shipped": "text-blue-500",
    "pending": "text-gray-500",
    "cancelled": "text-red-500"
  };
  
  return iconColors[status] || "text-gray-500";
};

const RecentOrders: React.FC = () => {
  const { data: recentOrders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders/recent"],
  });
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Recent Orders</h3>
          <a href="#" className="text-primary text-sm font-medium hover:underline">View All</a>
        </div>
        
        {isLoading ? (
          <div className="py-4 text-center">
            <span className="animate-pulse text-gray-500">Loading recent orders...</span>
          </div>
        ) : recentOrders && recentOrders.length > 0 ? (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                <div className={`rounded-full p-2 mr-3 ${getIconBgClass(order.status)}`}>
                  <ShoppingBag className={getIconColorClass(order.status)} size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Order #{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">
                    {(order.items as any[])?.length || 0} item{(order.items as any[])?.length !== 1 ? 's' : ''} • {formatRelativeTime(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">KSh {parseFloat(order.totalKsh).toLocaleString()}</p>
                  <Badge variant="outline" className={getStatusBadgeClass(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-gray-500">
            No recent orders found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
