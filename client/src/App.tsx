import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { ChatProvider } from "@/contexts/ChatContext";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import Orders from "@/pages/Orders";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import AuthPage from "@/pages/auth-page";
import { JSX } from "react";

// Wrapper components to fix type issues
const DashboardWrapper = (): JSX.Element => <Dashboard />;
const InventoryWrapper = (): JSX.Element => <Inventory />;
const OrdersWrapper = (): JSX.Element => <Orders />;
const AnalyticsWrapper = (): JSX.Element => <Analytics />;
const SettingsWrapper = (): JSX.Element => <Settings />;
const NotFoundWrapper = (): JSX.Element => <NotFound />;
const AuthPageWrapper = (): JSX.Element => <AuthPage />;

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={DashboardWrapper} />
      <ProtectedRoute path="/inventory" component={InventoryWrapper} />
      <ProtectedRoute path="/orders" component={OrdersWrapper} />
      <ProtectedRoute path="/analytics" component={AnalyticsWrapper} />
      <ProtectedRoute path="/settings" component={SettingsWrapper} />
      <Route path="/auth" component={AuthPageWrapper} />
      {/* Fallback to 404 */}
      <Route component={NotFoundWrapper} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="business-assistant-theme">
        <AuthProvider>
          <ChatProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </ChatProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
