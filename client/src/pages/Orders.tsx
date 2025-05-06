import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, RefreshCw } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/lib/types";

const Orders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: orders, isLoading, refetch } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });
  
  // Filter orders based on search query
  const filteredOrders = orders?.filter(order =>
    order.orderNumber.includes(searchQuery) ||
    (order.customerName && order.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (order.customerEmail && order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Get status badge component
  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      "pending": "bg-gray-100 text-gray-800 hover:bg-gray-200",
      "processing": "bg-amber-100 text-amber-800 hover:bg-amber-200",
      "completed": "bg-green-100 text-green-800 hover:bg-green-200",
      "shipped": "bg-blue-100 text-blue-800 hover:bg-blue-200",
      "cancelled": "bg-red-100 text-red-800 hover:bg-red-200"
    };
    
    const style = statusStyles[status] || "bg-gray-100 text-gray-800 hover:bg-gray-200";
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    
    return <Badge className={style}>{label}</Badge>;
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">Order Management</h1>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button variant="outline" size="icon">
              <Filter size={18} />
            </Button>
            
            <Button variant="outline" size="icon" onClick={() => refetch()}>
              <RefreshCw size={18} />
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-gray-500">Loading order data...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders && filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.orderNumber}</TableCell>
                        <TableCell>{order.customerName || "Anonymous"}</TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">{(order.items as any[]).length}</TableCell>
                        <TableCell className="text-right">KSh {parseFloat(order.totalKsh).toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                        {searchQuery ? "No orders match your search" : "No orders found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Orders;
