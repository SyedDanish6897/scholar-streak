import { useState } from 'react';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Calendar, Tag } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard = ({ task, onComplete, onDelete }: TaskCardProps) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    
    // Add animation delay
    setTimeout(() => {
      onComplete(task.id);
      setIsCompleting(false);
    }, 500);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div 
      className={`
        glass-card p-3 md:p-4 space-y-3 transition-all duration-500 animate-fade-in-up
        ${task.completed ? 'task-complete opacity-60' : 'hover-glow'}
        ${isCompleting ? 'animate-pulse scale-105 animate-wobble' : ''}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <h4 className={`font-medium ${task.completed ? 'line-through text-white/60' : 'text-white'}`}>
            {task.title}
          </h4>
          
          {task.description && (
            <p className={`text-sm ${task.completed ? 'text-white/50' : 'text-white/70'}`}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-2 flex-wrap">
            {task.category && (
              <Badge variant="outline" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {task.category}
              </Badge>
            )}
            
            {task.dueDate && (
              <Badge variant="outline" className="text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(task.dueDate)}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          {!task.completed && (
            <Button
              size="sm"
              onClick={handleComplete}
              disabled={isCompleting}
              className="bg-gradient-to-r from-success to-success-light hover:shadow-lg hover:shadow-success/30"
            >
              {isCompleting ? (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-xs">Done</span>
                </div>
              ) : (
                'Complete'
              )}
            </Button>
          )}
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(task.id)}
            className="border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      {task.completed && task.completedAt && (
        <div className="text-xs text-success flex items-center gap-1">
          ✅ Completed on {formatDate(task.completedAt)}
        </div>
      )}
    </div>
  );
};