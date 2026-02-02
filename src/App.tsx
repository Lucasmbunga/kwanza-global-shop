import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/admin/Login";
import ResetPassword from "./pages/admin/ResetPassword";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import OrderDetails from "./pages/admin/OrderDetails";
import Customers from "./pages/admin/Customers";
import Reports from "./pages/admin/Reports";
import Team from "./pages/admin/Team";
import Settings from "./pages/admin/Settings";
import Support from "./pages/admin/Support";
import Reviews from "./pages/admin/Reviews";

// Customer Portal
import CustomerLogin from "./pages/customer/Login";
import CustomerSignup from "./pages/customer/Signup";
import CustomerPortal from "./pages/customer/Portal";
import OrderTracking from "./pages/customer/OrderTracking";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Customer Portal */}
            <Route path="/portal/login" element={<CustomerLogin />} />
            <Route path="/portal/cadastro" element={<CustomerSignup />} />
            <Route path="/portal" element={<CustomerPortal />} />
            <Route path="/portal/pedido/:id" element={<OrderTracking />} />
            
            {/* Admin */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
            <Route path="/admin/orders" element={<AdminLayout><Orders /></AdminLayout>} />
            <Route path="/admin/orders/:id" element={<AdminLayout><OrderDetails /></AdminLayout>} />
            <Route path="/admin/customers" element={<AdminLayout><Customers /></AdminLayout>} />
            <Route path="/admin/reports" element={<AdminLayout><Reports /></AdminLayout>} />
            <Route path="/admin/team" element={<AdminLayout><Team /></AdminLayout>} />
            <Route path="/admin/settings" element={<AdminLayout><Settings /></AdminLayout>} />
            <Route path="/admin/support" element={<AdminLayout><Support /></AdminLayout>} />
            <Route path="/admin/reviews" element={<AdminLayout><Reviews /></AdminLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
