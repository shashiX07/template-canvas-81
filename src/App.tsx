import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Templates from "./pages/Templates";
import TemplateDetail from "./pages/TemplateDetail";
import TemplatePreview from "./pages/TemplatePreview";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import EditorPage from "./pages/Editor";
import AdminPage from "./pages/Admin";
import AdminTemplateUploadPage from "./pages/AdminTemplateUpload";
import FreelancerAuth from "./pages/FreelancerAuth";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import Webies from "./pages/Webies";
import WebieDetail from "./pages/WebieDetail";
import CreateWebie from "./pages/CreateWebie";

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
            <Route path="/auth" element={<Auth />} />
            <Route path="/freelancer/auth" element={<FreelancerAuth />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/template/:id" element={<TemplateDetail />} />
            <Route path="/template/:id/preview" element={<TemplatePreview />} />
            <Route path="/editor/:id" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminPage /></ProtectedRoute>} />
            <Route path="/admin/upload" element={<ProtectedRoute requireAdmin><AdminTemplateUploadPage /></ProtectedRoute>} />
            <Route path="/profile/*" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/freelancer/dashboard" element={<ProtectedRoute><FreelancerDashboard /></ProtectedRoute>} />
            <Route path="/webies" element={<Webies />} />
            <Route path="/webie/:id" element={<WebieDetail />} />
            <Route path="/webie/create" element={<ProtectedRoute><CreateWebie /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
