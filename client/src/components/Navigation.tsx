import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, FolderKanban } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <FolderKanban className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              TaskFlow
            </span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                location.pathname === '/'
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "hover:bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="font-medium">Projects</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
