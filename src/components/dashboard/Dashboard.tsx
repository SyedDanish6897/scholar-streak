import { useEffect, useMemo, useRef, useState } from 'react';
import { User, Task, Badge } from '@/types';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { XPProgress } from './XPProgress';
import { StreakCounter } from './StreakCounter';
import { BadgeDisplay } from './BadgeDisplay';
import { TaskList } from '@/components/tasks/TaskList';
import { AddTaskForm } from '@/components/tasks/AddTaskForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Music2, Pause, Play, Plus, TrendingUp, Target, Timer, Sparkles } from 'lucide-react';

interface DashboardProps {
  user: User;
  tasks: Task[];
  badges: Badge[];
  onLogout: () => void;
  onAddTask: (title: string, description?: string, dueDate?: string, category?: string) => void;
  onCompleteTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const Dashboard = ({
  user,
  tasks,
  badges,
  onLogout,
  onAddTask,
  onCompleteTask,
  onDeleteTask
}: DashboardProps) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [confettiBurst, setConfettiBurst] = useState(0);
  const [showChallenge, setShowChallenge] = useState(false);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const musicOscRef = useRef<OscillatorNode | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(600);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<number | null>(null);
  const shownDueIdsRef = useRef<Set<string>>(new Set());
  const { toast } = useToast();

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const handleAddTask = (title: string, description?: string, dueDate?: string, category?: string) => {
    onAddTask(title, description, dueDate, category);
    setShowAddTask(false);
  };

  // Confetti trigger wrapper on complete
  const handleCompleteTask = (taskId: string) => {
    setConfettiBurst(prev => prev + 1);
    setShowChallenge(true);
    onCompleteTask(taskId);
    toast({ title: 'Great job! 🎉', description: 'Task completed. XP incoming!' });
  };

  // Minimal confetti pieces
  const confettiPieces = useMemo(() => Array.from({ length: 30 }, (_, i) => i + confettiBurst * 1000), [confettiBurst]);

  useEffect(() => {
    if (confettiBurst > 0) {
      const t = setTimeout(() => setConfettiBurst(0), 2000);
      return () => clearTimeout(t);
    }
  }, [confettiBurst]);

  // Music controls using WebAudio API
  const toggleMusic = async () => {
    if (!isMusicOn) {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 174; // calming frequency
      gain.gain.value = 0.02;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      musicOscRef.current = osc;
      musicGainRef.current = gain;
      setIsMusicOn(true);
    } else {
      musicOscRef.current?.stop();
      musicOscRef.current?.disconnect();
      musicGainRef.current?.disconnect();
      musicOscRef.current = null;
      musicGainRef.current = null;
      setIsMusicOn(false);
    }
  };

  // Simple timer with end beep
  useEffect(() => {
    if (!isTimerRunning) return;
    timerRef.current = window.setInterval(() => {
      setTimerSeconds((s) => {
        if (s <= 1) {
          window.clearInterval(timerRef.current!);
          setIsTimerRunning(false);
          // Beep
          const ctx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
          audioCtxRef.current = ctx;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = 880;
          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          osc.connect(gain).connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
          toast({ title: 'Timer done ⏰', description: 'Great focus session!' });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isTimerRunning, toast]);

  const resetTimer = (seconds: number) => {
    setTimerSeconds(seconds);
    setIsTimerRunning(false);
    if (timerRef.current) window.clearInterval(timerRef.current);
  };

  // Daily motivational quote + GIF
  const quotes = useMemo(() => [
    { q: 'Small steps lead to big results.', gif: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDJkYjlydTk4bW1kYm1lbnU0eXJ0djg0OGZrM2Z1cGJrMmlsazN6OSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oKIPo2n3a8cQv4Zb6/giphy.gif' },
    { q: 'Stay consistent. Your future self will thank you.', gif: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2F1bnlmcjhxbGZxZ3Z4cndzN2JybjZ2ZjFyaXRmN2h0cWtrb2J6OSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l0HlOvJ7yaacpuSas/giphy.gif' },
    { q: 'Progress, not perfection.', gif: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDRmYXI3Z3Y1c280NDA2aGg1cGQ5YjNna3hhdWtvZ3Z0dWd3cXJ3NiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xT8qBepJQzUjXPEl5C/giphy.gif' },
    { q: 'Focus today. Shine tomorrow.', gif: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmQ0Z2d0cWEydHptOGh3a3M5b2ltc3V0c2lscmRzZ3F2N2JkNTdxYSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26BROrSHlmyzzHf3i/giphy.gif' },
  ], []);
  const dailyIndex = useMemo(() => Math.abs(Array.from(new Date().toDateString()).reduce((a, c) => a + c.charCodeAt(0), 0)) % quotes.length, [quotes.length]);
  const daily = quotes[dailyIndex];

  // Smart suggestion
  const suggestion = useMemo(() => {
    if (activeTasks.length === 0) return { title: 'Add a task', reason: 'No active tasks yet.' };
    const withDue = activeTasks.filter(t => t.dueDate);
    if (withDue.length) {
      const next = withDue.sort((a,b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())[0];
      return { title: next.title, reason: `Due soon: ${new Date(next.dueDate!).toLocaleDateString()}` };
    }
    return { title: activeTasks[0].title, reason: 'Start with the first task in your list.' };
  }, [activeTasks]);

  // Deadline notifications (once per id)
  useEffect(() => {
    const soon = activeTasks.filter(t => t.dueDate && (new Date(t.dueDate!).getTime() - Date.now()) < 24*60*60*1000);
    if (soon.length) {
      soon.slice(0,1).forEach(t => {
        if (!shownDueIdsRef.current.has(t.id)) {
          shownDueIdsRef.current.add(t.id);
          toast({ title: 'Upcoming deadline ⏳', description: `${t.title} is due by ${new Date(t.dueDate!).toLocaleString()}` });
        }
      });
    }
  }, [activeTasks, toast]);

  // Mini flashcards content
  const flashcards = useMemo(() => [
    { front: 'What is spaced repetition?', back: 'A learning technique that increases intervals of time between reviews.' },
    { front: 'Define Pomodoro.', back: 'A time management method: 25 min focus + 5 min break cycles.' },
    { front: 'Active recall?', back: 'Actively stimulating memory during the learning process.' },
  ], []);

  // Avatar/pet evolution
  const pet = useMemo(() => {
    if (user.xp >= 500) return { emoji: '🐉', stage: 'Elder Dragon' };
    if (user.xp >= 200) return { emoji: '🦅', stage: 'Soaring Eagle' };
    if (user.xp >= 50) return { emoji: '🐥', stage: 'Curious Chick' };
    return { emoji: '🥚', stage: 'Hatching Egg' };
  }, [user.xp]);

  const formatTime = (s: number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <div className="min-h-screen">
      <Header user={user} onLogout={onLogout} />

      <main className="container mx-auto px-4 py-6 space-y-6 animate-fade-in-up relative">
        {/* Confetti Overlay */}
        {confettiBurst > 0 && (
          <div className="pointer-events-none fixed inset-0 z-50">
            {confettiPieces.map((k) => {
              const left = Math.random() * 100;
              const size = 6 + Math.random() * 8;
              const colors = ['#a78bfa','#34d399','#fbbf24','#60a5fa','#f472b6'];
              const color = colors[Math.floor(Math.random()*colors.length)];
              const delay = Math.random() * 0.2;
              return (
                <span
                  key={k}
                  className="absolute rounded-sm animate-confetti"
                  style={{ left: `${left}%`, top: '-10vh', width: size, height: size, background: color, animationDelay: `${delay}s` }}
                />
              );
            })}
          </div>
        )}

        {/* Welcome + Motivation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="glass-card p-6 text-center animate-slide-in-left lg:col-span-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 animate-bounce-in">
              Welcome back, {user.username}! 👋
            </h2>
            <div className="text-white/70 text-sm md:text-base space-y-1">
              <p>Ready to continue your learning journey? Let's make today productive!</p>
              <p>Did you drink water today? 💧 </p>
              <p>Your brain says: Let’s study! 🧠 </p>
              <p>Oops… your tasks are plotting against you! 😱</p>
            </div>
          </div>

          <Card className="glass-card overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Daily Motivation</CardTitle>
              <CardDescription>{daily.q}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="aspect-video w-full rounded-md overflow-hidden">
                <img src={daily.gif} alt="motivational gif" className="w-full h-full object-cover animate-glow" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <XPProgress user={user} />
          <StreakCounter user={user} />

          {/* Quick Stats */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Progress</h3>
              <TrendingUp className="text-success" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/70">Active Tasks</span>
                <span className="font-semibold text-primary">{activeTasks.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/70">Completed</span>
                <span className="font-semibold text-success">{completedTasks.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/70">Total XP</span>
                <span className="font-semibold text-accent">{user.xp}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Focus Music + Timer + Pet + Suggestion */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg flex items-center gap-2"><Music2 className="w-4 h-4" /> Focus Music</CardTitle>
              <CardDescription>Calming tone to help you focus.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 flex items-center gap-2">
              <Button variant="gradient" size="sm" onClick={toggleMusic} className="active:scale-[0.98]">
                {isMusicOn ? <Pause /> : <Play />}
                {isMusicOn ? 'Pause' : 'Play'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => { musicGainRef.current && (musicGainRef.current.gain.value = Math.max(0.005, Math.min(0.08, (musicGainRef.current.gain.value + 0.01)))); }}>
                Louder
              </Button>
              <Button variant="outline" size="sm" onClick={() => { musicGainRef.current && (musicGainRef.current.gain.value = Math.max(0.005, musicGainRef.current.gain.value - 0.01)); }}>
                Softer
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg flex items-center gap-2"><Timer className="w-4 h-4" /> Focus Timer</CardTitle>
              <CardDescription>Quick sessions for momentum.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 flex items-center gap-2">
              <div className="font-mono text-xl min-w-[72px] text-center"><p>{formatTime(timerSeconds)}</p></div>
              <Button variant="success" size="sm" className="rounded-[14px]" onClick={() => setIsTimerRunning(true)} disabled={isTimerRunning}>Start</Button>
              <Button variant="outline" size="sm" onClick={() => setIsTimerRunning(false)} disabled={!isTimerRunning}>Pause</Button>
              <Button variant="outline" size="sm" onClick={() => resetTimer(600)}>Reset</Button>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg flex items-center gap-2"><Sparkles className="w-4 h-4" /> Study Buddy</CardTitle>
              <CardDescription>{pet.stage}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 flex items-center gap-3">
              <div className="text-4xl animate-float">{pet.emoji}</div>
              <div className="text-sm text-white/80">Keep earning XP to evolve your buddy!</div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Next best task</CardTitle>
              <CardDescription>{suggestion.reason}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-white font-medium">{suggestion.title}</div>
            </CardContent>
          </Card>
        </div>

        {/* Badges */}
        <BadgeDisplay badges={badges} />

        {/* Tasks Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-white" />
              <h2 className="text-xl font-semibold text-white">Your Tasks</h2>
            </div>

            <Button
              onClick={() => setShowAddTask(!showAddTask)}
              className="bg-gradient-to-r from-primary to-primary-light hover:shadow-lg hover:shadow-primary/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>

          {/* Add Task Form */}
          {showAddTask && (
            <div className="animate-slide-up animate-scale-in">
              <AddTaskForm
                onAddTask={handleAddTask}
                onCancel={() => setShowAddTask(false)}
              />
            </div>
          )}

          {/* Task List */}
          <TaskList
            tasks={tasks}
            onComplete={handleCompleteTask}
            onDelete={onDeleteTask}
          />
        </div>
      </main>

      <Footer />

      {/* Mini Challenge / Flashcards Dialog */}
      <Dialog open={showChallenge} onOpenChange={setShowChallenge}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle className="text-white">Quick Flashcards</DialogTitle>
            <DialogDescription>Reinforce your learning in 30 seconds.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white text-base">{flashcards[currentChallengeIndex % flashcards.length].front}</CardTitle>
                <CardDescription>{flashcards[currentChallengeIndex % flashcards.length].back}</CardDescription>
              </CardHeader>
            </Card>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setCurrentChallengeIndex((i)=>i+1)}>Next</Button>
              <Button variant="success" onClick={() => setShowChallenge(false)}>Done</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
