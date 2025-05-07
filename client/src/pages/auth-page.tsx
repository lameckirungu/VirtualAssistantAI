import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    
    loginMutation.mutate({ username, password });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    
    registerMutation.mutate({ 
      username, 
      password,
      fullName: fullName || undefined
    });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Tabs 
          defaultValue="login" 
          className="w-full max-w-md" 
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          {/* Login Form */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Account Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      name="username" 
                      placeholder="username" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      name="password" 
                      type="password" 
                      placeholder="••••••••" 
                      required 
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={loginMutation.isPending}>
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          {/* Register Form */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create account</CardTitle>
                <CardDescription>
                  Register a new account to get started.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName" 
                      name="fullName" 
                      placeholder="John Kamau" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-username">Username</Label>
                    <Input 
                      id="reg-username" 
                      name="username" 
                      placeholder="username" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input 
                      id="reg-password" 
                      name="password" 
                      type="password" 
                      placeholder="••••••••" 
                      required 
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={registerMutation.isPending}>
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Right side - Hero section */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-r from-primary/20 to-primary/40 flex-col justify-center p-12">
        <div className="space-y-6 max-w-lg">
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
              AI-Powered Virtual Assistant
            </span>
            <br />
            For Business Optimization
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your inventory, process orders, and get business insights with our
            powerful AI assistant. Built specifically for Kenyan businesses.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
              <p className="text-sm font-medium">Natural language processing capabilities</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
              <p className="text-sm font-medium">Real-time inventory management</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
              <p className="text-sm font-medium">Business analytics and reporting</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
              <p className="text-sm font-medium">Kenyan market optimized</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}