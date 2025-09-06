import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RegisterFormProps {
  onRegister: (username: string, password: string) => boolean;
  onSwitchToLogin: () => void;
}

export const RegisterForm = ({ onRegister, onSwitchToLogin }: RegisterFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      return;
    }

    if (password !== confirmPassword) {
      // Handle password mismatch - could add toast here
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay for better UX
    setTimeout(() => {
      onRegister(username.trim(), password);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <Card className="glass-card border-primary/20 hover-glow animate-scale-in">
          <CardHeader className="text-center space-y-4 animate-fade-in-up">
            <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-success to-success-light flex items-center justify-center text-2xl animate-float">
              🚀
            </div>
            <div>
              <CardTitle className="text-2xl sm:text-3xl text-foreground drop-shadow-lg relative z-10">Join Study Planner</CardTitle>
              <CardDescription className="text-muted-foreground/80">
                Create your account and start your learning adventure
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
                  placeholder="Choose a username"
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
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-card border-primary/30 focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`glass-card border-primary/30 focus:border-primary ${
                    password && confirmPassword && password !== confirmPassword
                      ? 'border-destructive'
                      : ''
                  }`}
                  required
                />
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-sm text-destructive">Passwords do not match</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-success to-success-light hover:shadow-lg hover:shadow-success/30 transition-all duration-300 active:scale-[0.98]"
                disabled={isLoading || (password && confirmPassword && password !== confirmPassword)}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  onClick={onSwitchToLogin}
                  className="text-primary hover:text-primary-light transition-colors duration-200 font-medium"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
