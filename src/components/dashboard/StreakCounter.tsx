import { User } from '@/types';

interface StreakCounterProps {
  user: User;
}

export const StreakCounter = ({ user }: StreakCounterProps) => {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Study Streak</h3>
          <p className="text-sm text-white/70">
            {user.streak === 0 ? 'Start your streak today!' : 'Days in a row'}
          </p>
        </div>
        <div className={`text-3xl ${user.streak > 0 ? 'streak-flame' : ''}`}>
          🔥
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-4xl font-bold text-primary">
          {user.streak}
        </div>
        <div className="text-sm text-white/70 mt-1">
          {user.streak === 0 && 'Complete a task to start your streak!'}
          {user.streak === 1 && 'Great start! Keep it going!'}
          {user.streak >= 2 && user.streak < 7 && 'Building momentum! 💪'}
          {user.streak >= 7 && user.streak < 30 && 'Incredible dedication! 🌟'}
          {user.streak >= 30 && 'Legendary commitment! 👑'}
        </div>
      </div>
    </div>
  );
};