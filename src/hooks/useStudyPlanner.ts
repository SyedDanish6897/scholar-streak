import { useState, useEffect } from 'react';
import { User, Task, Badge, StudyPlannerData } from '@/types';
import { 
  getStorageData, 
  saveStorageData, 
  generateId, 
  calculateStreak, 
  checkBadges 
} from '@/utils/storage';
import { toast } from '@/hooks/use-toast';

export const useStudyPlanner = () => {
  const [data, setData] = useState<StudyPlannerData>(getStorageData());

  useEffect(() => {
    saveStorageData(data);
  }, [data]);

  const register = (username: string, password: string): boolean => {
    if (data.users.find(u => u.username === username)) {
      toast({
        title: "Username taken",
        description: "Please choose a different username",
        variant: "destructive",
      });
      return false;
    }

    const newUser: User = {
      id: generateId(),
      username,
      xp: 0,
      streak: 0,
      createdAt: new Date().toISOString(),
    };

    setData(prev => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUser: newUser,
    }));

    toast({
      title: "Welcome to Study Planner! 🎉",
      description: `Account created successfully for ${username}`,
    });

    return true;
  };

  const login = (username: string, password: string): boolean => {
    const user = data.users.find(u => u.username === username);
    
    if (!user) {
      toast({
        title: "Login failed",
        description: "Username not found",
        variant: "destructive",
      });
      return false;
    }

    setData(prev => ({
      ...prev,
      currentUser: user,
    }));

    toast({
      title: `Welcome back, ${username}! 👋`,
      description: "Ready to continue your learning journey?",
    });

    return true;
  };

  const logout = () => {
    setData(prev => ({
      ...prev,
      currentUser: null,
    }));

    toast({
      title: "See you later! 👋",
      description: "You've been logged out successfully",
    });
  };

  const addTask = (title: string, description?: string, dueDate?: string, category?: string): Task => {
    if (!data.currentUser) throw new Error('No user logged in');

    const newTask: Task = {
      id: generateId(),
      title,
      description,
      dueDate,
      category,
      completed: false,
      userId: data.currentUser.id,
      createdAt: new Date().toISOString(),
    };

    setData(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));

    toast({
      title: "Task added! 📝",
      description: `"${title}" has been added to your study list`,
    });

    return newTask;
  };

  const completeTask = (taskId: string) => {
    if (!data.currentUser) throw new Error('No user logged in');

    const task = data.tasks.find(t => t.id === taskId);
    if (!task || task.completed) return;

    const updatedTasks = data.tasks.map(t => 
      t.id === taskId 
        ? { ...t, completed: true, completedAt: new Date().toISOString() }
        : t
    );

    const updatedUser = {
      ...data.currentUser,
      xp: data.currentUser.xp + 10,
      lastCompletedDate: new Date().toISOString(),
    };

    // Calculate new streak
    updatedUser.streak = calculateStreak(updatedUser, updatedTasks);

    // Check for new badges
    const updatedBadges = checkBadges(updatedUser, updatedTasks, data.badges);
    const newBadges = updatedBadges.filter((badge, index) => 
      badge.earned && !data.badges[index].earned
    );

    setData(prev => ({
      ...prev,
      currentUser: updatedUser,
      users: prev.users.map(u => u.id === updatedUser.id ? updatedUser : u),
      tasks: updatedTasks,
      badges: updatedBadges,
    }));

    // Show completion toast
    toast({
      title: "Task completed! 🎉",
      description: `+10 XP earned! You now have ${updatedUser.xp} XP`,
    });

    // Show badge notifications
    newBadges.forEach(badge => {
      setTimeout(() => {
        toast({
          title: `Badge earned! ${badge.icon}`,
          description: `${badge.name}: ${badge.description}`,
          variant: "default",
        });
      }, 500);
    });

    // Show streak notification
    if (updatedUser.streak > 1) {
      setTimeout(() => {
        toast({
          title: `${updatedUser.streak} day streak! 🔥`,
          description: "Keep up the amazing work!",
        });
      }, 1000);
    }
  };

  const deleteTask = (taskId: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId),
    }));

    toast({
      title: "Task deleted",
      description: "Task has been removed from your list",
    });
  };

  return {
    currentUser: data.currentUser,
    tasks: data.tasks.filter(t => t.userId === data.currentUser?.id),
    badges: data.badges,
    register,
    login,
    logout,
    addTask,
    completeTask,
    deleteTask,
  };
};