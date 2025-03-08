
import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAdmin } from "@/context/AdminContext";
import AdminLayout from "@/components/admin/AdminLayout";
import Dashboard from "@/components/admin/Dashboard";
import ProductsManager from "@/components/admin/ProductsManager";
import OrdersManager from "@/components/admin/OrdersManager";
import UsersManager from "@/components/admin/UsersManager";
import BlogManager from "@/components/admin/BlogManager";
import ReportsManager from "@/components/admin/ReportsManager";
import Settings from "@/components/admin/Settings";

const AdminDashboard: React.FC = () => {
  const { isAdminAuthenticated, isLoading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAdminAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAdminAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products/*" element={<ProductsManager />} />
        <Route path="/orders/*" element={<OrdersManager />} />
        <Route path="/users" element={<UsersManager />} />
        <Route path="/blog/*" element={<BlogManager />} />
        <Route path="/reports" element={<ReportsManager />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;
