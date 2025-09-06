import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LoginFormProps {
  onLogin: (username: string, password: string) => boolean;
  onSwitchToRegister: () => void;
}

export const LoginForm = ({ onLogin, onSwitchToRegister }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setIsLoading(true);
    
    // Simulate API delay for better UX
    setTimeout(() => {
      onLogin(username.trim(), password);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <Card className="glass-card border-primary/20 hover-glow animate-scale-in">
          <CardHeader className="text-center space-y-4 animate-fade-in-up">
            <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-2xl animate-float">
              📚
            </div>
            <div>
              <CardTitle className="text-2xl sm:text-3xl gradient-text drop-shadow-lg relative z-10">Welcome Back</CardTitle>
              <CardDescription className="text-muted-foreground/80">
                Sign in to continue your learning journey
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="animate-slide-up">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="glass-card border-primary/30 focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-card border-primary/30 focus:border-primary"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary-light hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button
                  onClick={onSwitchToRegister}
                  className="text-primary hover:text-primary-light transition-colors duration-200 font-medium"
                >
                  Create one here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
