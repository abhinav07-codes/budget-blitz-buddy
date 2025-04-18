
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Oops! Page not found</p>
        <Button asChild>
          <a href="/" className="flex items-center gap-2">
            <HomeIcon className="h-4 w-4" />
            Return to Dashboard
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
