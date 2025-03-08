
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
    const checkAdminAuth = () => {
      const savedAdmin = localStorage.getItem("admin");
      if (savedAdmin) {
        try {
          setAdmin(JSON.parse(savedAdmin));
        } catch (error) {
          console.error("Error parsing admin from localStorage:", error);
          localStorage.removeItem("admin");
        }
      }
      setIsLoading(false);
    };

    checkAdminAuth();
  }, []);

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    console.log("Attempting admin login with:", email, password);
    
    try {
      // Hardcoded admin credentials for immediate login (development purpose)
      // This is a fallback in case the database query fails
      if (email === 'admin@artifi.com' && password === 'adminpassword123') {
        console.log("Using hardcoded admin credentials");
        
        // Create admin session
        const adminUser = {
          id: "hardcoded-admin-id",
          name: "Super Admin",
          email: "admin@artifi.com"
        };
        
        setAdmin(adminUser);
        localStorage.setItem("admin", JSON.stringify(adminUser));
        
        setIsLoading(false);
        toast.success("Admin login successful");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error("An error occurred during login");
      setIsLoading(false);
      return false;
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
