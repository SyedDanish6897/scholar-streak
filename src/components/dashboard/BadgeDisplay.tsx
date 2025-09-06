import { Badge } from '@/types';

interface BadgeDisplayProps {
  badges: Badge[];
}

export const BadgeDisplay = ({ badges }: BadgeDisplayProps) => {
  const earnedBadges = badges.filter(badge => badge.earned);
  const totalBadges = badges.length;

  return (
    <div className="glass-card p-4 md:p-6 space-y-4 animate-slide-in-right hover-glow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Achievements</h3>
          <p className="text-sm text-white/70">
            {earnedBadges.length}/{totalBadges} badges earned
          </p>
        </div>
        <div className="text-2xl animate-glow">🏆</div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`
              p-3 rounded-lg border transition-all duration-300
              ${badge.earned 
                ? 'bg-success/20 border-success/40 hover:bg-success/30' 
                : 'bg-muted/50 border-muted opacity-50'
              }
            `}
          >
            <div className="text-center space-y-2">
              <div className="text-2xl">
                {badge.icon}
              </div>
              <div>
                <div className={`font-semibold text-sm ${badge.earned ? 'text-success' : 'text-white/50'}`}>
                  {badge.name}
                </div>
                <div className={`text-xs ${badge.earned ? 'text-white/70' : 'text-white/30'}`}>
                  {badge.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {earnedBadges.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-white/70">
            Complete tasks to earn your first badges! 🌟
          </p>
        </div>
      )}
    </div>
  );
};