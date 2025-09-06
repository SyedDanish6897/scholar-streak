import { Task } from '@/types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export const TaskList = ({ tasks, onComplete, onDelete }: TaskListProps) => {
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  if (tasks.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="text-4xl mb-4">📚</div>
        <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
        <p className="text-muted-foreground">
          Add your first task to start your learning journey!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Active Tasks</h3>
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {activeTasks.length}
            </span>
          </div>
          <div className="grid gap-4">
            {activeTasks.map((task, index) => (
              <div 
                key={task.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <TaskCard 
                  task={task} 
                  onComplete={onComplete} 
                  onDelete={onDelete} 
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-success">Completed Tasks</h3>
            <span className="bg-success text-success-foreground text-xs px-2 py-1 rounded-full">
              {completedTasks.length}
            </span>
          </div>
          <div className="grid gap-4">
            {completedTasks.map((task, index) => (
              <div 
                key={task.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TaskCard 
                  task={task} 
                  onComplete={onComplete} 
                  onDelete={onDelete} 
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};