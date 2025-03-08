
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
    console.log("Attempting admin login for:", email);
    
    try {
      // Verify admin credentials against the database
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email);
      
      if (error) {
        console.error("Database error during admin login:", error);
        toast.error("Error connecting to database");
        setIsLoading(false);
        return false;
      }
      
      if (!data || data.length === 0) {
        console.log("No admin found with email:", email);
        toast.error("Invalid admin credentials");
        setIsLoading(false);
        return false;
      }
      
      const adminData = data[0];
      console.log("Found admin with matching email");
      
      // Simple password check (in a real app, you'd use bcrypt or similar)
      if (adminData.password !== password) {
        console.log("Password mismatch for admin");
        toast.error("Invalid admin credentials");
        setIsLoading(false);
        return false;
      }
      
      console.log("Admin credentials validated successfully");
      
      // Create admin session
      const adminUser = {
        id: adminData.id,
        name: adminData.name,
        email: adminData.email
      };
      
      setAdmin(adminUser);
      localStorage.setItem("admin", JSON.stringify(adminUser));
      
      // Create session in database
      const sessionToken = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
      
      const { error: sessionError } = await supabase.from('admin_sessions').insert({
        admin_id: adminData.id,
        token: sessionToken,
        expires_at: expiresAt.toISOString()
      });
      
      if (sessionError) {
        console.error("Error creating admin session:", sessionError);
        // Continue anyway as the admin is authenticated
      }
      
      setIsLoading(false);
      toast.success("Admin login successful");
      return true;
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
