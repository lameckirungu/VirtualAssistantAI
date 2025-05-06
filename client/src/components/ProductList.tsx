import React from "react";
import { Product } from "@/lib/types";

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No products found
      </div>
    );
  }
  
  return (
    <div className="mt-3 space-y-2">
      {products.map(product => {
        let statusText = '';
        let statusClass = '';
        
        if (product.status === 'in_stock') {
          statusText = `In Stock: ${product.quantity}`;
          statusClass = 'text-green-600';
        } else if (product.status === 'low_stock') {
          statusText = `Low Stock: ${product.quantity}`;
          statusClass = 'text-amber-600';
        } else {
          statusText = 'Out of Stock';
          statusClass = 'text-red-600';
        }
        
        return (
          <div key={product.id} className="bg-white p-2 rounded border border-gray-200">
            <div className="flex justify-between">
              <span className="font-medium text-sm">{product.name}</span>
              <span className={`${statusClass} text-sm`}>{statusText}</span>
            </div>
            <p className="text-xs text-gray-500">SKU: {product.sku}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;
