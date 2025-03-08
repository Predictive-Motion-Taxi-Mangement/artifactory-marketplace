
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
        setAdmin(JSON.parse(savedAdmin));
      }
      setIsLoading(false);
    };

    checkAdminAuth();
  }, []);

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Verify admin credentials against the database
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error || !data) {
        toast.error("Invalid admin credentials");
        setIsLoading(false);
        return false;
      }
      
      // Simple password check (in a real app, you'd use bcrypt or similar)
      if (data.password !== password) {
        toast.error("Invalid admin credentials");
        setIsLoading(false);
        return false;
      }
      
      // Create admin session
      const adminData = {
        id: data.id,
        name: data.name,
        email: data.email
      };
      
      setAdmin(adminData);
      localStorage.setItem("admin", JSON.stringify(adminData));
      
      // Create session in database
      const sessionToken = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
      
      await supabase.from('admin_sessions').insert({
        admin_id: data.id,
        token: sessionToken,
        expires_at: expiresAt.toISOString()
      });
      
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
