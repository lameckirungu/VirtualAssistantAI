import React from "react";
import { Save, RefreshCw } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Settings: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure your virtual assistant and business preferences</p>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="assistant">Assistant</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage your account and business settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input id="business-name" defaultValue="Business Optimization Inc." />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input id="admin-email" type="email" defaultValue="alex@businessai.example.com" />
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="UTC">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                      <SelectItem value="CST">Central Time (CST)</SelectItem>
                      <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                      <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <div className="text-sm text-muted-foreground">Toggle between light and dark theme</div>
                  </div>
                  <Switch id="dark-mode" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="assistant" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Assistant Settings</CardTitle>
                <CardDescription>Configure your AI assistant behavior and model settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="assistant-name">Assistant Name</Label>
                  </div>
                  <Input id="assistant-name" defaultValue="BusinessAI" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="response-speed">Response Speed</Label>
                    <span className="text-sm text-muted-foreground">Balanced</span>
                  </div>
                  <Slider
                    id="response-speed"
                    defaultValue={[50]}
                    max={100}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Faster</span>
                    <span>More accurate</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="nlp-model">NLP Model</Label>
                  <Select defaultValue="balanced">
                    <SelectTrigger id="nlp-model">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    The balanced model offers good performance with reasonable latency.
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="context-memory">Context Memory</Label>
                    <div className="text-sm text-muted-foreground">Remember previous conversations</div>
                  </div>
                  <Switch id="context-memory" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="learning-mode">Learning Mode</Label>
                    <div className="text-sm text-muted-foreground">Improve from interactions</div>
                  </div>
                  <Switch id="learning-mode" defaultChecked />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset to Defaults
                </Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <div className="text-sm text-muted-foreground">Receive daily summary reports</div>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="low-stock-alerts">Low Stock Alerts</Label>
                    <div className="text-sm text-muted-foreground">Notify when inventory is running low</div>
                  </div>
                  <Switch id="low-stock-alerts" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="order-notifications">New Order Notifications</Label>
                    <div className="text-sm text-muted-foreground">Get alerted for new orders</div>
                  </div>
                  <Switch id="order-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="customer-inquiries">Customer Inquiry Alerts</Label>
                    <div className="text-sm text-muted-foreground">Get notified about new customer inquiries</div>
                  </div>
                  <Switch id="customer-inquiries" defaultChecked />
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Label htmlFor="notification-frequency">Alert Frequency</Label>
                  <Select defaultValue="realtime">
                    <SelectTrigger id="notification-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly Digest</SelectItem>
                      <SelectItem value="daily">Daily Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
