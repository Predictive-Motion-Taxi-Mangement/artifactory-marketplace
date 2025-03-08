
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  ShoppingCart, 
  Package, 
  Users, 
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Eye,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Define proper types for our data
type StatItem = {
  title: string;
  value: string; // Ensure all values are strings to prevent type errors
  change: string;
  trend: "up" | "down";
  icon: React.FC<{ className?: string }>;
  color: string;
  isLoading: boolean;
};

type QuickLink = {
  title: string;
  icon: React.FC<{ className?: string }>;
  path: string;
  color: string;
};

type ActivityItem = {
  type: string;
  title: string;
  description: string;
  time: string;
  icon: React.FC<{ className?: string }>;
  color: string;
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Fetch product count
  const { data: productsCount, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Fetch order count
  const { data: ordersCount, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Fetch user count (mocked since we don't have direct access to auth.users)
  const { data: usersCount, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users-count'],
    queryFn: async () => {
      // For demo purposes, return a mock count
      return 16;
    }
  });

  // Calculate total sales (mocked for demo)
  const { data: totalSales, isLoading: isLoadingSales } = useQuery({
    queryKey: ['total-sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('total');
      
      if (error) throw error;
      
      if (!data || data.length === 0) return 0;
      
      return data.reduce((sum, order) => sum + parseFloat(order.total), 0);
    }
  });

  // Properly define stats with explicit string typing for values
  const stats: StatItem[] = [
    { 
      title: "Total Sales", 
      value: isLoadingSales ? "Loading..." : `$${totalSales !== null ? totalSales.toFixed(2) : "0.00"}`, 
      change: "+12.5%", 
      trend: "up",
      icon: DollarSign,
      color: "text-green-500",
      isLoading: isLoadingSales
    },
    { 
      title: "Products", 
      value: isLoadingProducts ? "Loading..." : `${productsCount !== null ? productsCount : 0}`, 
      change: "+3", 
      trend: "up",
      icon: Package,
      color: "text-blue-500",
      isLoading: isLoadingProducts
    },
    { 
      title: "Orders", 
      value: isLoadingOrders ? "Loading..." : `${ordersCount !== null ? ordersCount : 0}`,
      change: "+22.4%", 
      trend: "up",
      icon: ShoppingBag,
      color: "text-purple-500",
      isLoading: isLoadingOrders
    },
    { 
      title: "Visitors", 
      // Convert to string using template literal to avoid type errors
      value: isLoadingUsers ? "Loading..." : `${usersCount !== null ? usersCount * 178 : 0}`,
      change: "+18.7%", 
      trend: "up",
      icon: Eye,
      color: "text-amber-500",
      isLoading: isLoadingUsers
    },
  ];

  const quickLinks: QuickLink[] = [
    { title: "Manage Products", icon: Package, path: "/admin/products", color: "bg-blue-100 dark:bg-blue-900" },
    { title: "Process Orders", icon: ShoppingCart, path: "/admin/orders", color: "bg-purple-100 dark:bg-purple-900" },
    { title: "View Users", icon: Users, path: "/admin/users", color: "bg-green-100 dark:bg-green-900" },
    { title: "Manage Blog", icon: FileText, path: "/admin/blog", color: "bg-amber-100 dark:bg-amber-900" },
  ];

  const recentActivity: ActivityItem[] = [
    {
      type: "order",
      title: "New order received",
      description: "Order #2476 - $129.99",
      time: "24 minutes ago",
      icon: ShoppingCart,
      color: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
    },
    {
      type: "user",
      title: "New user registered",
      description: "johndoe@example.com",
      time: "1 hour ago",
      icon: Users,
      color: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300"
    },
    {
      type: "blog",
      title: "New blog post published",
      description: "\"Exploring AI-Generated Art Trends in 2023\"",
      time: "3 hours ago",
      icon: FileText,
      color: "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300"
    }
  ];

  // Render components
  const renderStatCard = (stat: StatItem, index: number) => (
    <Card key={index}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {stat.title}
        </CardTitle>
        <div className={`rounded-full p-2 ${stat.color} bg-opacity-10`}>
          {stat.isLoading ? (
            <Loader2 className={`h-4 w-4 ${stat.color} animate-spin`} />
          ) : (
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stat.value}</div>
        <p className={`text-xs ${stat.trend === "up" ? "text-green-500" : "text-red-500"} flex items-center`}>
          {stat.change}
          {stat.trend === "up" ? (
            <TrendingUp className="ml-1 h-3 w-3" />
          ) : (
            <TrendingDown className="ml-1 h-3 w-3" />
          )}
        </p>
      </CardContent>
    </Card>
  );

  const renderQuickLinkCard = (link: QuickLink, index: number) => (
    <Card key={index} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className={`rounded-full p-2 w-12 h-12 flex items-center justify-center ${link.color}`}>
          <link.icon className="h-6 w-6" />
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-lg">{link.title}</CardTitle>
        <CardDescription>Manage your store content</CardDescription>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate(link.path)}
        >
          Go to {link.title.split(' ')[1]}
        </Button>
      </CardFooter>
    </Card>
  );

  const renderActivityItem = (activity: ActivityItem, index: number) => (
    <div key={index} className={`flex items-start gap-4 ${index !== recentActivity.length - 1 ? 'border-b pb-4' : ''}`}>
      <div className={`${activity.color} p-2 rounded`}>
        <activity.icon className="h-4 w-4" />
      </div>
      <div>
        <p className="font-medium">{activity.title}</p>
        <p className="text-sm text-muted-foreground">{activity.description}</p>
        <p className="text-xs text-muted-foreground">{activity.time}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your admin dashboard</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(renderStatCard)}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map(renderQuickLinkCard)}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <Card>
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
            <CardDescription>Latest events in your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map(renderActivityItem)}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate("/admin/reports")}>View All Activity</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
