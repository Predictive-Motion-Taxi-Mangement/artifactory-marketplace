
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isAdminContext } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Admin {
  id: string;
  name: string;
  email: string;
}

interface AdminContextType {
  admin: Admin | null;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for admin session in localStorage
    const checkAdminAuth = async () => {
      try {
        const savedAdmin = localStorage.getItem("admin");
        
        if (savedAdmin) {
          // Parse the saved admin data
          const parsedAdmin = JSON.parse(savedAdmin);
          
          // Validate the admin session
          const { data, error } = await supabase
            .from('admins')
            .select('*')
            .eq('email', parsedAdmin.email)
            .maybeSingle();
          
          if (data) {
            // Admin exists in the database, session is valid
            setAdmin(parsedAdmin);
            console.log("Admin session restored:", parsedAdmin.email);
          } else {
            // Admin doesn't exist or session is invalid
            console.log("Invalid admin session, logging out");
            localStorage.removeItem("admin");
            setAdmin(null);
          }
        }
      } catch (error) {
        console.error("Error checking admin authentication:", error);
        localStorage.removeItem("admin");
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAuth();
  }, []);

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    console.log("Attempting admin login with:", email);
    
    try {
      // First try to authenticate against Supabase
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching admin:", error);
        throw error;
      }
      
      // For development, we allow a hardcoded login
      // In production, this should be replaced with proper auth
      if ((data && data.password === password) || 
          (email === 'admin@artifi.com' && password === 'adminpassword123')) {
        
        // Create admin session
        const adminUser = data || {
          id: "hardcoded-admin-id",
          name: "Super Admin",
          email: "admin@artifi.com"
        };
        
        setAdmin(adminUser);
        localStorage.setItem("admin", JSON.stringify(adminUser));
        
        toast.success("Admin login successful");
        return true;
      }
      
      toast.error("Invalid email or password");
      return false;
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error("An error occurred during login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogout = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
    toast.success("Admin logged out successfully");
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        isAdminAuthenticated: !!admin,
        isLoading,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
