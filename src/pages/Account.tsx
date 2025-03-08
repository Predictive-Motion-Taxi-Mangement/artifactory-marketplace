
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { User, LogOut, Settings, ShoppingBag, Heart, Clock } from "lucide-react";

const Account = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  // If still loading, show loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse">Loading account information...</div>
        </div>
      </Layout>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="font-medium">{user?.name || "User"}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    activeTab === "profile" ? "bg-secondary" : ""
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  <User size={18} className="mr-2" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    activeTab === "orders" ? "bg-secondary" : ""
                  }`}
                  onClick={() => setActiveTab("orders")}
                >
                  <ShoppingBag size={18} className="mr-2" />
                  Orders
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    activeTab === "favorites" ? "bg-secondary" : ""
                  }`}
                  onClick={() => setActiveTab("favorites")}
                >
                  <Heart size={18} className="mr-2" />
                  Favorites
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    activeTab === "history" ? "bg-secondary" : ""
                  }`}
                  onClick={() => setActiveTab("history")}
                >
                  <Clock size={18} className="mr-2" />
                  Browsing History
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    activeTab === "settings" ? "bg-secondary" : ""
                  }`}
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings size={18} className="mr-2" />
                  Settings
                </Button>

                <Separator className="my-4" />

                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </Button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-8 bg-transparent space-x-6 border-b p-0 h-auto">
                <TabsTrigger
                  value="profile"
                  className={`pb-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent`}
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="orders"
                  className={`pb-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent`}
                >
                  Orders
                </TabsTrigger>
                <TabsTrigger
                  value="favorites"
                  className={`pb-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent`}
                >
                  Favorites
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className={`pb-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent`}
                >
                  History
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className={`pb-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent`}
                >
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Profile Content */}
              <TabsContent value="profile" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-xl font-medium mb-4">Account Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Name</h4>
                      <p>{user?.name || "Not provided"}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
                      <p>{user?.email}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Member Since</h4>
                      <p>September 2023</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button>Edit Profile</Button>
                  </div>
                </div>
              </TabsContent>

              {/* Orders Content */}
              <TabsContent value="orders" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-xl font-medium mb-4">Order History</h3>
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
                    <p className="mt-1">When you make purchases, they will appear here.</p>
                    <Button className="mt-4" variant="outline">Start Shopping</Button>
                  </div>
                </div>
              </TabsContent>

              {/* Favorites Content */}
              <TabsContent value="favorites" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-xl font-medium mb-4">Saved Artworks</h3>
                  <div className="text-center py-8 text-muted-foreground">
                    <Heart className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">No favorites yet</h3>
                    <p className="mt-1">Save your favorite artworks to view them later.</p>
                    <Button className="mt-4" variant="outline">Explore Artworks</Button>
                  </div>
                </div>
              </TabsContent>

              {/* History Content */}
              <TabsContent value="history" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-xl font-medium mb-4">Recently Viewed</h3>
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">No browsing history</h3>
                    <p className="mt-1">Artworks you view will appear here.</p>
                    <Button className="mt-4" variant="outline">Discover Artworks</Button>
                  </div>
                </div>
              </TabsContent>

              {/* Settings Content */}
              <TabsContent value="settings" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-xl font-medium mb-4">Account Settings</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Password</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Change your password to keep your account secure.
                      </p>
                      <Button variant="outline">Change Password</Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-2">Notifications</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Manage email notification preferences.
                      </p>
                      <Button variant="outline">Notification Settings</Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-2">Delete Account</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Permanently delete your account and all associated data.
                      </p>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
