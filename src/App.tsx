
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { ExpenseProvider } from "@/contexts/ExpenseContext";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/components/Dashboard";
import ImportHistory from "./pages/ImportHistory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);
  
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <QueryClientProvider client={queryClient}>
      <ExpenseProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen dark:bg-background bg-background">
              <AppLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/import-history" element={<ImportHistory />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppLayout>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ExpenseProvider>
    </QueryClientProvider>
  );
};

export default App;
