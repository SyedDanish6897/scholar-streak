import { StudyPlannerData, User, Task, Badge } from '@/types';

const STORAGE_KEY = 'study_planner_data';

const defaultBadges: Badge[] = [
  {
    id: 'first-task',
    name: 'First Steps',
    description: 'Complete your first task',
    icon: '🌟',
    condition: { type: 'first_task' },
    earned: false,
  },
  {
    id: 'streak-5',
    name: 'Consistent Learner',
    description: 'Maintain a 5-day streak',
    icon: '🔥',
    condition: { type: 'streak', value: 5 },
    earned: false,
  },
  {
    id: 'xp-100',
    name: 'Study Master',
    description: 'Earn 100 XP',
    icon: '👑',
    condition: { type: 'xp', value: 100 },
    earned: false,
  },
  {
    id: 'tasks-10',
    name: 'Task Crusher',
    description: 'Complete 10 tasks',
    icon: '💪',
    condition: { type: 'tasks_completed', value: 10 },
    earned: false,
  },
];

export const getStorageData = (): StudyPlannerData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  
  return {
    currentUser: null,
    users: [],
    tasks: [],
    badges: [...defaultBadges],
  };
};

export const saveStorageData = (data: StudyPlannerData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const calculateStreak = (user: User, tasks: Task[]): number => {
  const userTasks = tasks
    .filter(task => task.userId === user.id && task.completed && task.completedAt)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

  if (userTasks.length === 0) return 0;

  let streak = 1;
  let currentDate = new Date(userTasks[0].completedAt!);
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 1; i < userTasks.length; i++) {
    const taskDate = new Date(userTasks[i].completedAt!);
    taskDate.setHours(0, 0, 0, 0);
    
    const dayDifference = Math.floor((currentDate.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dayDifference === 1) {
      streak++;
      currentDate = taskDate;
    } else if (dayDifference > 1) {
      break;
    }
  }

  // Check if the last task was completed today or yesterday
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastTaskDate = new Date(userTasks[0].completedAt!);
  lastTaskDate.setHours(0, 0, 0, 0);
  
  const daysSinceLastTask = Math.floor((today.getTime() - lastTaskDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceLastTask > 1) {
    return 0; // Streak broken
  }

  return streak;
};

export const checkBadges = (user: User, tasks: Task[], badges: Badge[]): Badge[] => {
  const userTasks = tasks.filter(task => task.userId === user.id);
  const completedTasks = userTasks.filter(task => task.completed);
  
  return badges.map(badge => {
    if (badge.earned) return badge;

    let shouldEarn = false;

    switch (badge.condition.type) {
      case 'first_task':
        shouldEarn = completedTasks.length > 0;
        break;
      case 'xp':
        shouldEarn = user.xp >= (badge.condition.value || 0);
        break;
      case 'streak':
        shouldEarn = user.streak >= (badge.condition.value || 0);
        break;
      case 'tasks_completed':
        shouldEarn = completedTasks.length >= (badge.condition.value || 0);
        break;
    }

    return {
      ...badge,
      earned: shouldEarn,
      earnedAt: shouldEarn && !badge.earned ? new Date().toISOString() : badge.earnedAt,
    };
  });
};