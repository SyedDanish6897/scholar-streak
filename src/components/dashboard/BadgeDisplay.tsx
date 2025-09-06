import { Badge } from '@/types';

interface BadgeDisplayProps {
  badges: Badge[];
}

export const BadgeDisplay = ({ badges }: BadgeDisplayProps) => {
  const earnedBadges = badges.filter(badge => badge.earned);
  const totalBadges = badges.length;

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Achievements</h3>
          <p className="text-sm text-muted-foreground">
            {earnedBadges.length}/{totalBadges} badges earned
          </p>
        </div>
        <div className="text-2xl animate-glow">🏆</div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`
              p-3 rounded-lg border transition-all duration-300
              ${badge.earned 
                ? 'badge-earned glass-card border-success/30 hover-glow' 
                : 'bg-muted/50 border-muted opacity-50'
              }
            `}
          >
            <div className="text-center space-y-2">
              <div className={`text-2xl ${badge.earned ? 'animate-bounce-in' : ''}`}>
                {badge.icon}
              </div>
              <div>
                <div className={`font-semibold text-sm ${badge.earned ? 'text-success' : 'text-muted-foreground'}`}>
                  {badge.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {badge.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {earnedBadges.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Complete tasks to earn your first badges! 🌟
          </p>
        </div>
      )}
    </div>
  );
};