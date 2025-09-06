import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export const Header = ({ user, onLogout }: HeaderProps) => {
  return (
    <header className="glass-card border-b border-primary/20 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-xl animate-float">
              📚
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Study Planner</h1>
              <p className="text-sm text-primary-light">Gamified Learning</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <UserIcon className="w-4 h-4" />
              <span className="font-medium">{user.username}</span>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={onLogout}
              className="border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};