
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart as BarChartIcon,
  Calendar,
  Filter,
  Download,
  Loader2
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const ReportsManager: React.FC = () => {
  const [timeRange, setTimeRange] = useState("last7Days");
  const [chartType, setChartType] = useState("sales");

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['reports', timeRange, chartType],
    queryFn: async () => {
      try {
        // In a real implementation, we would query the database based on timeRange and chartType
        // For demo purposes, return mock data
        return generateMockData(timeRange, chartType);
      } catch (error) {
        console.error("Error fetching report data:", error);
        toast.error("Failed to fetch report data");
        return [];
      }
    },
  });

  const generateMockData = (timeRange: string, chartType: string) => {
    let data = [];
    let days = 7;
    
    if (timeRange === "last30Days") days = 30;
    else if (timeRange === "last90Days") days = 90;
    
    if (chartType === "sales") {
      // Generate sales data
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.unshift({
          date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          sales: Math.floor(Math.random() * 500) + 100,
        });
      }
    } else if (chartType === "visitors") {
      // Generate visitor data
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.unshift({
          date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          visitors: Math.floor(Math.random() * 200) + 50,
        });
      }
    } else if (chartType === "orders") {
      // Generate order data
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.unshift({
          date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          orders: Math.floor(Math.random() * 20) + 5,
        });
      }
    }
    
    return data;
  };

  const handleExportData = () => {
    if (!reportData || reportData.length === 0) {
      toast.error("No data to export");
      return;
    }
    
    // In a real implementation, we would generate a CSV/Excel file for download
    toast.success(`${chartType.charAt(0).toUpperCase() + chartType.slice(1)} report exported successfully`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChartIcon className="h-6 w-6" />
          Reports
        </h1>
        <p className="text-muted-foreground">Analyze your store's performance</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Track your store's revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last7Days">Last 7 Days</SelectItem>
                    <SelectItem value="last30Days">Last 30 Days</SelectItem>
                    <SelectItem value="last90Days">Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales Report</SelectItem>
                    <SelectItem value="visitors">Visitor Stats</SelectItem>
                    <SelectItem value="orders">Order Count</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={handleExportData}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-80">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : reportData && reportData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    {chartType === 'sales' && (
                      <Bar dataKey="sales" fill="#8884d8" name="Sales ($)" />
                    )}
                    {chartType === 'visitors' && (
                      <Bar dataKey="visitors" fill="#82ca9d" name="Visitors" />
                    )}
                    {chartType === 'orders' && (
                      <Bar dataKey="orders" fill="#ffc658" name="Orders" />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-80 text-muted-foreground">
                No data available for selected criteria
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products in your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                ['Abstract Canvas Art', 'Watercolor Landscape', 'Portrait Collection'].map((product, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium">{product}</p>
                      <p className="text-sm text-muted-foreground">{Math.floor(Math.random() * 50) + 10} units sold</p>
                    </div>
                    <p className="font-semibold">${(Math.random() * 500 + 100).toFixed(2)}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>Sales by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                ['Abstract', 'Portrait', 'Landscape', 'Modern'].map((category, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{category}</p>
                      <p className="font-semibold">${(Math.random() * 1000 + 200).toFixed(2)}</p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2" 
                        style={{ width: `${Math.floor(Math.random() * 80) + 20}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Conversions</CardTitle>
            <CardDescription>Visitor to customer conversion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                [
                  { user: 'j********@example.com', date: '2 hours ago', amount: '$129.99' },
                  { user: 'a********@gmail.com', date: '5 hours ago', amount: '$79.99' },
                  { user: 'r********@outlook.com', date: '1 day ago', amount: '$249.99' }
                ].map((conversion, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium">{conversion.user}</p>
                      <p className="text-sm text-muted-foreground">{conversion.date}</p>
                    </div>
                    <p className="font-semibold text-green-600">{conversion.amount}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsManager;
