import React from "react";
import Layout from "@/components/Layout";
import ChatInterface from "@/components/ChatInterface";
import BusinessInsights from "@/components/BusinessInsights";
import IntentAnalytics from "@/components/IntentAnalytics";
import RecentOrders from "@/components/RecentOrders";
import { ChatProvider } from "@/contexts/ChatContext";

const Dashboard: React.FC = () => {
  return (
    <ChatProvider>
      <Layout>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ChatBot Column */}
          <div className="lg:col-span-2">
            <ChatInterface />
          </div>
          
          {/* Dashboard Column */}
          <div className="space-y-6">
            <BusinessInsights />
            <IntentAnalytics />
            <RecentOrders />
          </div>
        </div>
      </Layout>
    </ChatProvider>
  );
};

export default Dashboard;
