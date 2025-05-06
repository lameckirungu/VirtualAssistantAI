import React from "react";
import { Link, useLocation } from "wouter";
import { ToyBrick, MessageSquareText, Package2, ShoppingCart, Eye, Settings } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  return (
    <aside className={`bg-gray-800 text-white ${collapsed ? 'w-16' : 'w-64'} flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out`}>
      <div className="flex items-center justify-center md:justify-start h-16 px-4 border-b border-gray-700">
        <ToyBrick className="text-primary mr-2" size={24} />
        <h1 className={`text-xl font-bold ${collapsed ? 'hidden' : 'block'}`}>BusinessAI</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul>
          <li className="mb-2">
            <Link href="/">
              <a className={`flex items-center py-2 px-4 text-gray-300 hover:bg-gray-700 rounded mx-2 ${isActive('/') ? 'bg-gray-700' : ''}`}>
                <MessageSquareText className="mr-3" size={20} />
                <span className={collapsed ? 'hidden' : 'block'}>Chat Assistant</span>
              </a>
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/inventory">
              <a className={`flex items-center py-2 px-4 text-gray-300 hover:bg-gray-700 rounded mx-2 ${isActive('/inventory') ? 'bg-gray-700' : ''}`}>
                <Package2 className="mr-3" size={20} />
                <span className={collapsed ? 'hidden' : 'block'}>Inventory</span>
              </a>
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/orders">
              <a className={`flex items-center py-2 px-4 text-gray-300 hover:bg-gray-700 rounded mx-2 ${isActive('/orders') ? 'bg-gray-700' : ''}`}>
                <ShoppingCart className="mr-3" size={20} />
                <span className={collapsed ? 'hidden' : 'block'}>Orders</span>
              </a>
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/analytics">
              <a className={`flex items-center py-2 px-4 text-gray-300 hover:bg-gray-700 rounded mx-2 ${isActive('/analytics') ? 'bg-gray-700' : ''}`}>
                <Eye className="mr-3" size={20} />
                <span className={collapsed ? 'hidden' : 'block'}>Analytics</span>
              </a>
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/settings">
              <a className={`flex items-center py-2 px-4 text-gray-300 hover:bg-gray-700 rounded mx-2 ${isActive('/settings') ? 'bg-gray-700' : ''}`}>
                <Settings className="mr-3" size={20} />
                <span className={collapsed ? 'hidden' : 'block'}>Settings</span>
              </a>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className={`p-4 border-t border-gray-700 ${collapsed ? 'hidden' : 'block'}`}>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-600 mr-3 flex items-center justify-center text-gray-200">
            A
          </div>
          <div>
            <p className="text-sm font-medium">Alex Kariuki</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
