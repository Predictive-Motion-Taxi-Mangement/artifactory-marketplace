
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, Search, ArrowUpDown, Eye, Loader2 } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Order {
  id: string;
  user_id: string;
  created_at: string;
  status: string;
  total: number;
}

const OrdersManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const fetchOrders = async () => {
    try {
      let query = supabase
        .from('orders')
        .select('*');
      
      query = query.order(sortField, { ascending: sortDirection === "asc" });
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }
      
      return (data || []) as Order[];
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to fetch orders");
      return [];
    }
  };

  const { data: orders = [], isLoading, error, refetch } = useQuery({
    queryKey: ['orders', sortField, sortDirection],
    queryFn: fetchOrders,
  });

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return "bg-green-100 text-green-800 hover:bg-green-100 border-green-300";
      case 'processing':
        return "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-300";
      case 'cancelled':
        return "bg-red-100 text-red-800 hover:bg-red-100 border-red-300";
      case 'pending':
        return "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-300";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-300";
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Orders
          </h1>
        </div>
        <Card className="p-6 text-center">
          <p className="text-destructive text-lg">Error loading orders</p>
          <p className="text-muted-foreground">Please try again later or contact support</p>
          <Button className="mt-4" onClick={() => refetch()}>Try Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" />
          Orders
        </h1>
        <p className="text-muted-foreground">Manage and track customer orders</p>
      </div>

      <Card className="p-4">
        <div className="flex items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders by ID or status..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-lg">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-10">
            <ShoppingCart className="h-10 w-10 mx-auto text-muted-foreground" />
            <p className="mt-2 text-lg font-medium">No orders found</p>
            <p className="text-muted-foreground">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("id")}>
                    <div className="flex items-center">
                      Order ID
                      {sortField === "id" && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("created_at")}>
                    <div className="flex items-center">
                      Date
                      {sortField === "created_at" && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                    <div className="flex items-center">
                      Status
                      {sortField === "status" && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("total")}>
                    <div className="flex items-center">
                      Total
                      {sortField === "total" && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeVariant(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>${parseFloat(order.total.toString()).toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => toast.info("Order details view not implemented")}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default OrdersManager;
