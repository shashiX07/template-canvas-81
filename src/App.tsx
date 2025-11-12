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
import Editor from "./pages/Editor";
import Admin from "./pages/Admin";
import AdminTemplateUpload from "./pages/AdminTemplateUpload";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

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
            <Route path="/templates" element={<Templates />} />
            <Route path="/template/:id" element={<TemplateDetail />} />
            <Route path="/template/:id/preview" element={<TemplatePreview />} />
            <Route path="/editor/:id" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
            <Route path="/admin/upload" element={<ProtectedRoute requireAdmin><AdminTemplateUpload /></ProtectedRoute>} />
            <Route path="/profile/*" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
