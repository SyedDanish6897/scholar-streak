import { useState } from 'react';
import { useStudyPlanner } from '@/hooks/useStudyPlanner';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Dashboard } from '@/components/dashboard/Dashboard';

export const StudyPlanner = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const {
    currentUser,
    tasks,
    badges,
    register,
    login,
    logout,
    addTask,
    completeTask,
    deleteTask,
  } = useStudyPlanner();

  if (!currentUser) {
    if (authMode === 'login') {
      return (
        <LoginForm
          onLogin={login}
          onSwitchToRegister={() => setAuthMode('register')}
        />
      );
    } else {
      return (
        <RegisterForm
          onRegister={register}
          onSwitchToLogin={() => setAuthMode('login')}
        />
      );
    }
  }

  return (
    <Dashboard
      user={currentUser}
      tasks={tasks}
      badges={badges}
      onLogout={logout}
      onAddTask={addTask}
      onCompleteTask={completeTask}
      onDeleteTask={deleteTask}
    />
  );
};