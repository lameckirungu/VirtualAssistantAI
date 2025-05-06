import React from "react";
import { Menu, HelpCircle, Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <button id="sidebar-toggle" className="text-gray-500 focus:outline-none" onClick={toggleSidebar}>
            <Menu size={20} />
          </button>
          <h2 className="ml-4 text-xl font-medium text-gray-800">AI-powered Virtual Assistant</h2>
        </div>
        
        <div className="flex items-center">
          <button className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none mr-4">
            <HelpCircle size={20} />
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none mr-4 relative">
                <Bell size={20} />
                <span className="bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center absolute translate-x-2 -translate-y-2">3</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col">
                  <span className="font-medium">New order received</span>
                  <span className="text-sm text-gray-500">Order #38292 - 5 minutes ago</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col">
                  <span className="font-medium">Low stock alert</span>
                  <span className="text-sm text-gray-500">AudioPeak Max - 30 minutes ago</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col">
                  <span className="font-medium">Restock arrived</span>
                  <span className="text-sm text-gray-500">BassBoost Elite - 2 hours ago</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary cursor-pointer">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AK</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Alex Kariuki</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
