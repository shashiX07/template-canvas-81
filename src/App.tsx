import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Templates from "./pages/Templates";
import TemplateDetail from "./pages/TemplateDetail";
import TemplatePreview from "./pages/TemplatePreview";
import Editor from "./pages/Editor";
import Admin from "./pages/Admin";
import AdminTemplateUpload from "./pages/AdminTemplateUpload";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/template/:id" element={<TemplateDetail />} />
          <Route path="/template/:id/preview" element={<TemplatePreview />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/upload" element={<AdminTemplateUpload />} />
          <Route path="/profile/*" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
