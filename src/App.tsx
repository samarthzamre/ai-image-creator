import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import CategoryDetail from "./pages/CategoryDetail";
import SubcategoryDetail from "./pages/SubcategoryDetail";
import Generate from "./pages/Generate";
import History from "./pages/History";
import Admin from "./pages/Admin";
import Edit from "./pages/Edit";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="ai-imagegen-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:categoryId" element={<CategoryDetail />} />
            <Route path="/categories/:categoryId/:subcategoryId" element={<SubcategoryDetail />} />
            <Route path="/generate" element={<Generate />} />
            <Route path="/generate/:categoryId/:subcategoryId" element={<Generate />} />
            <Route path="/history" element={<History />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/edit" element={<Edit />} />
            <Route path="/edit/:imageId" element={<Edit />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
