
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import { Eye, EyeOff } from "lucide-react";

const Login: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError("");
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      let success;
      
      if (isLoginMode) {
        success = await login(email, password);
      } else {
        if (!name) {
          setError("Please enter your name");
          return;
        }
        success = await signup(name, email, password);
      }

      if (success) {
        navigate("/");
      } else {
        setError(isLoginMode ? "Invalid email or password" : "Failed to create account");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-20 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-medium p-8 border border-border">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-medium mb-2">
                {isLoginMode ? "Welcome back" : "Create an account"}
              </h1>
              <p className="text-muted-foreground">
                {isLoginMode
                  ? "Sign in to access your account"
                  : "Sign up to start exploring AI artwork"}
              </p>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLoginMode && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-apple"
                    placeholder="Enter your name"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-apple"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-apple"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {isLoginMode && (
                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-apple hover:bg-primary/90"
              >
                {isLoginMode ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={toggleMode}
                  className="ml-1 text-primary hover:underline focus:outline-none"
                >
                  {isLoginMode ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
