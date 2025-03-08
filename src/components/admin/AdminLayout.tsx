
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, Link, useLocation } from "react-router-dom";
import { useAdmin } from "@/context/AdminContext";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  BarChart, 
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { admin, adminLogout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePath, setActivePath] = useState("");

  useEffect(() => {
    // Set active path based on current location
    setActivePath(location.pathname);
    
    // Close sidebar on mobile when navigating
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
    toast.success("Logged out successfully");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navigationItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/products", label: "Products", icon: Package },
    { path: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/blog", label: "Blog", icon: FileText },
    { path: "/admin/reports", label: "Reports", icon: BarChart },
    { path: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-background border-b sticky top-0 z-30">
        <Button variant="ghost" onClick={toggleSidebar}>
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
        <h1 className="text-xl font-bold">Artifi Admin</h1>
        <Link to="/" className="text-muted-foreground p-2">
          <Home size={20} />
        </Link>
      </div>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside 
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed md:relative z-20 md:translate-x-0 transition-transform duration-300 w-64 min-h-screen bg-background border-r border-border`}
        >
          <div className="p-6">
            <h1 className="text-2xl font-bold">Artifi Admin</h1>
            <p className="text-sm text-muted-foreground">Control your store</p>
          </div>

          <Separator />

          <div className="p-4">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2 rounded-md text-sm
                    ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"}
                  `}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 w-full p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                {admin?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div>
                <p className="font-medium">{admin?.name || "Admin"}</p>
                <p className="text-xs text-muted-foreground">{admin?.email}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={() => navigate("/")}
              >
                <Home size={16} />
                <span>View Store</span>
                <ChevronRight size={14} className="ml-auto" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 overflow-auto md:max-h-screen">
          {children}
        </main>

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-10"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminLayout;
