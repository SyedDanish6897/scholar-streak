import { User } from '@/types';

interface XPProgressProps {
  user: User;
}

export const XPProgress = ({ user }: XPProgressProps) => {
  const level = Math.floor(user.xp / 100) + 1;
  const currentLevelXP = user.xp % 100;
  const progressPercentage = currentLevelXP;

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Level {level}</h3>
          <p className="text-sm text-muted-foreground">
            {currentLevelXP}/100 XP to next level
          </p>
        </div>
        <div className="text-3xl animate-glow">⭐</div>
      </div>
      
      <div className="space-y-2">
        <div className="progress-bar h-3">
          <div 
            className="progress-fill animate-pulse"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>0 XP</span>
          <span className="xp-gradient font-bold">{user.xp} XP Total</span>
          <span>100 XP</span>
        </div>
      </div>
    </div>
  );
};