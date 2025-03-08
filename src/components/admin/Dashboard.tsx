
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingCart, 
  Package, 
  Users, 
  FileText,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Eye
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { 
      title: "Total Sales", 
      value: "$4,294.75", 
      change: "+12.5%", 
      trend: "up",
      icon: DollarSign,
      color: "text-green-500" 
    },
    { 
      title: "Products", 
      value: "48", 
      change: "+3", 
      trend: "up",
      icon: Package,
      color: "text-blue-500" 
    },
    { 
      title: "Orders", 
      value: "156", 
      change: "+22.4%", 
      trend: "up",
      icon: ShoppingBag,
      color: "text-purple-500" 
    },
    { 
      title: "Visitors", 
      value: "2,845", 
      change: "+18.7%", 
      trend: "up",
      icon: Eye,
      color: "text-amber-500" 
    },
  ];

  const quickLinks = [
    { title: "Manage Products", icon: Package, path: "/admin/products", color: "bg-blue-100 dark:bg-blue-900" },
    { title: "Process Orders", icon: ShoppingCart, path: "/admin/orders", color: "bg-purple-100 dark:bg-purple-900" },
    { title: "View Users", icon: Users, path: "/admin/users", color: "bg-green-100 dark:bg-green-900" },
    { title: "Manage Blog", icon: FileText, path: "/admin/blog", color: "bg-amber-100 dark:bg-amber-900" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your admin dashboard</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.trend === "up" ? "text-green-500" : "text-red-500"} flex items-center`}>
                {stat.change}
                <TrendingUp className="ml-1 h-3 w-3" />
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link, index) => (
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
          ))}
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
              <div className="flex items-start gap-4 border-b pb-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
                  <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="font-medium">New order received</p>
                  <p className="text-sm text-muted-foreground">Order #2476 - $129.99</p>
                  <p className="text-xs text-muted-foreground">24 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 border-b pb-4">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded">
                  <Users className="h-4 w-4 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <p className="font-medium">New user registered</p>
                  <p className="text-sm text-muted-foreground">johndoe@example.com</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded">
                  <FileText className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                </div>
                <div>
                  <p className="font-medium">New blog post published</p>
                  <p className="text-sm text-muted-foreground">"Exploring AI-Generated Art Trends in 2023"</p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Activity</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
