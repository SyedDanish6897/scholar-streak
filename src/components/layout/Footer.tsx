import { cn } from '@/lib/utils';

export const Footer = ({ className }: { className?: string }) => {
  const year = new Date().getFullYear();
  return (
    <footer className={cn('mt-10', className)}>
      <div className="container mx-auto px-4 py-6">
        <div className="glass-card p-4 sm:p-5 text-center text-sm text-white/80 rounded-lg">
          <p>
            © {year} Study Planner — Crafted with ❤️ for better learning. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
