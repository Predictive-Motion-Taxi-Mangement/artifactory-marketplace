
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  TrendingUp, 
  Clock,
  CreditCard,
  Inbox
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon, trend }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {trend && <p className="text-xs text-green-500 mt-1">{trend}</p>}
    </CardContent>
  </Card>
);

interface RecentActivity {
  id: string;
  type: string;
  name: string;
  time: string;
  amount?: string;
}

const Dashboard: React.FC = () => {
  // Fetch products count
  const { data: productsCount = "0" } = useQuery({
    queryKey: ["productsCount"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count?.toString() || "0";
    },
  });

  // Fetch orders count
  const { data: ordersCount = "0" } = useQuery({
    queryKey: ["ordersCount"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count?.toString() || "0";
    },
  });

  // Sales data for chart
  const salesData = [
    { name: "Jan", sales: 4000 },
    { name: "Feb", sales: 3000 },
    { name: "Mar", sales: 5000 },
    { name: "Apr", sales: 4500 },
    { name: "May", sales: 6000 },
    { name: "Jun", sales: 5500 },
  ];

  // Recent activity
  const recentActivity: RecentActivity[] = [
    { id: "1", type: "order", name: "New order #1082", time: "5 minutes ago", amount: "$129.99" },
    { id: "2", type: "product", name: "Product 'Abstract Forest' added", time: "2 hours ago" },
    { id: "3", type: "order", name: "Order #1081 completed", time: "Yesterday", amount: "$245.50" },
    { id: "4", type: "user", name: "New user registered", time: "Yesterday" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your art gallery store</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={productsCount}
          description="Total products in catalog"
          icon={<Package />}
        />
        <StatCard
          title="Total Orders"
          value={ordersCount}
          description="Orders processed"
          icon={<ShoppingCart />}
        />
        <StatCard
          title="Revenue"
          value="$12,458"
          description="Last 30 days"
          icon={<DollarSign />}
          trend="+14.2% from last month"
        />
        <StatCard
          title="Active Visitors"
          value="245"
          description="Current users browsing"
          icon={<Users />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest transactions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    {activity.type === "order" && <ShoppingCart className="h-5 w-5 text-blue-500" />}
                    {activity.type === "product" && <Package className="h-5 w-5 text-green-500" />}
                    {activity.type === "user" && <Users className="h-5 w-5 text-purple-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.name}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" /> {activity.time}
                      {activity.amount && (
                        <>
                          <span className="mx-1">•</span>
                          <DollarSign className="mr-1 h-3 w-3" /> {activity.amount}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center p-2 rounded-lg bg-background hover:bg-accent cursor-pointer">
              <Package className="mr-2 h-5 w-5 text-primary" />
              <span>Add New Product</span>
            </div>
            <div className="flex items-center p-2 rounded-lg bg-background hover:bg-accent cursor-pointer">
              <CreditCard className="mr-2 h-5 w-5 text-primary" />
              <span>Process Orders</span>
            </div>
            <div className="flex items-center p-2 rounded-lg bg-background hover:bg-accent cursor-pointer">
              <Inbox className="mr-2 h-5 w-5 text-primary" />
              <span>Manage Inventory</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Abstract</span>
                <span className="text-sm font-medium">32%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Portrait</span>
                <span className="text-sm font-medium">28%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Landscape</span>
                <span className="text-sm font-medium">24%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Modern</span>
                <span className="text-sm font-medium">16%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between">
                  <span className="text-sm">Monthly Goal</span>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span className="text-sm">Quarterly Goal</span>
                  <span className="text-sm font-medium">68%</span>
                </div>
                <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: "68%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
