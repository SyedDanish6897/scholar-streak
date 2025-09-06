export interface User {
  id: string;
  username: string;
  xp: number;
  streak: number;
  lastCompletedDate?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  category?: string;
  completed: boolean;
  completedAt?: string;
  userId: string;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: BadgeCondition;
  earned: boolean;
  earnedAt?: string;
}

export interface BadgeCondition {
  type: 'xp' | 'streak' | 'tasks_completed' | 'first_task';
  value?: number;
}

export interface StudyPlannerData {
  currentUser: User | null;
  users: User[];
  tasks: Task[];
  badges: Badge[];
}