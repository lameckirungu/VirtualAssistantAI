import React from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, BarChart2 } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IntentAnalytics from "@/components/IntentAnalytics";
import BusinessInsights from "@/components/BusinessInsights";
import { Analytics as AnalyticsType } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const Analytics: React.FC = () => {
  const { data: analytics, isLoading } = useQuery<AnalyticsType>({
    queryKey: ["/api/analytics"],
  });
  
  // Prepare data for intent distribution chart
  const intentData = analytics?.intentCounts
    ? Object.entries(analytics.intentCounts || {}).map(([name, value]) => ({
        name: name
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        value
      }))
    : [];
  
  // Colors for pie chart
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6B7280"];
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <IntentAnalytics />
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Intent Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : intentData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <div className="mb-4">
                    <MessageSquare className="h-10 w-10 mx-auto opacity-30" />
                  </div>
                  <p className="mb-2">No conversation data available yet</p>
                  <p className="text-sm">Statistics will appear as customers interact with the assistant</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={intentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {intentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversation Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : !analytics ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <div className="mb-4">
                    <BarChart2 className="h-10 w-10 mx-auto opacity-30" />
                  </div>
                  <p className="mb-2">No performance data available yet</p>
                  <p className="text-sm">Statistics will appear after conversations complete</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Active Conversations", value: analytics?.activeConversations || 0 },
                      { name: "Completed Conversations", value: analytics?.completedConversations || 0 },
                      { name: "Intent Accuracy (%)", value: analytics?.intentAccuracy || 0 },
                      { name: "Avg Response Time (s)", value: analytics?.avgResponseTime || 0 }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BusinessInsights />
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
