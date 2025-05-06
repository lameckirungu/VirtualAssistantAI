import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Filter, RefreshCw } from "lucide-react";
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
import { Product } from "@/lib/types";
import AddProductModal from "@/components/AddProductModal";

const Inventory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const { data: products, isLoading, refetch } = useQuery<Product[]>({
    queryKey: ["/api/inventory"],
  });
  
  // Filter products based on search query
  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Get status badge component
  const getStatusBadge = (status: string) => {
    if (status === "in_stock") {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">In Stock</Badge>;
    } else if (status === "low_stock") {
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Low Stock</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Out of Stock</Badge>;
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search products..."
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
            
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus size={16} className="mr-2" />
              Add Product
            </Button>
          </div>
        </div>
        
        <AddProductModal 
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
        />
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-gray-500">Loading inventory data...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Next Restock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts && filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell className="text-right">KSH {parseFloat(product.priceKsh).toFixed(2)}</TableCell>
                        <TableCell className="text-right">{product.quantity}</TableCell>
                        <TableCell>{getStatusBadge(product.status)}</TableCell>
                        <TableCell>{product.category || "-"}</TableCell>
                        <TableCell>
                          {product.nextRestock ? new Date(product.nextRestock).toLocaleDateString() : "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                        {searchQuery ? "No products match your search" : "No products found"}
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

export default Inventory;
