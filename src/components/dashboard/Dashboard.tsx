import { useState } from 'react';
import { User, Task, Badge } from '@/types';
import { Header } from '@/components/layout/Header';
import { XPProgress } from './XPProgress';
import { StreakCounter } from './StreakCounter';
import { BadgeDisplay } from './BadgeDisplay';
import { TaskList } from '@/components/tasks/TaskList';
import { AddTaskForm } from '@/components/tasks/AddTaskForm';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Target } from 'lucide-react';

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

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const handleAddTask = (title: string, description?: string, dueDate?: string, category?: string) => {
    onAddTask(title, description, dueDate, category);
    setShowAddTask(false);
  };

  return (
    <div className="min-h-screen">
      <Header user={user} onLogout={onLogout} />
      
      <main className="container mx-auto px-4 py-6 space-y-6 animate-fade-in-up">
        {/* Welcome Section */}
        <div className="glass-card p-6 text-center animate-slide-in-left">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 animate-bounce-in">
            Welcome back, {user.username}! 👋
          </h2>
          <p className="text-white/70 text-sm md:text-base">
            Ready to continue your learning journey? Let's make today productive!
          </p>
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
            onComplete={onCompleteTask}
            onDelete={onDeleteTask}
          />
        </div>
      </main>
    </div>
  );
};