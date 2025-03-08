
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would check for an existing session here
    // For demo purposes, we'll just simulate a loading state
    const checkAuth = setTimeout(() => {
      // Check if user data exists in localStorage (demo purposes only)
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(checkAuth);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // This is a mock implementation
      // In a real app, you would make an API call here
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Validate credentials (mock)
      if (email && password) {
        const mockUser = {
          id: "user-" + Math.random().toString(36).substring(2, 9),
          name: email.split("@")[0],
          email,
        };
        
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // This is a mock implementation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (name && email && password) {
        const mockUser = {
          id: "user-" + Math.random().toString(36).substring(2, 9),
          name,
          email,
        };
        
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Signup error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
