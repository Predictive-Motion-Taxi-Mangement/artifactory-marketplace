
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/context/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("admin@artifi.com");
  const [password, setPassword] = useState("adminpassword123"); // Pre-fill with default password for demo
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");
  const { adminLogin, isAdminAuthenticated, isLoading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAdminAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    if (!email || !password) {
      setLoginError("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Submitting with email:", email, "and password:", password);
      const success = await adminLogin(email, password);
      
      if (success) {
        navigate("/admin/dashboard");
      } else {
        setLoginError("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-xl shadow-lg border border-border">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-muted-foreground mt-2">
            Enter your credentials to access the admin dashboard
          </p>
        </div>

        {loginError && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@artifi.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={toggleShowPassword}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login to Admin Panel"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          <p>Default admin credentials (for demo):</p>
          <p>Email: admin@artifi.com</p>
          <p>Password: adminpassword123</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
