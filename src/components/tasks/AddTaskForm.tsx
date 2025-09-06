import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface AddTaskFormProps {
  onAddTask: (title: string, description?: string, dueDate?: string, category?: string) => void;
  onCancel?: () => void;
}

export const AddTaskForm = ({ onAddTask, onCancel }: AddTaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    
    // Simulate form processing
    setTimeout(() => {
      onAddTask(
        title.trim(),
        description.trim() || undefined,
        dueDate || undefined,
        category.trim() || undefined
      );
      
      // Reset form
      setTitle('');
      setDescription('');
      setDueDate('');
      setCategory('');
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <Card className="glass-card border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Plus className="w-5 h-5" />
          Add New Task
        </CardTitle>
        <CardDescription>
          Create a new study task and start earning XP!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              placeholder="What do you want to study?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="glass-card border-primary/30 focus:border-primary"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add more details about this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="glass-card border-primary/30 focus:border-primary resize-none"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g., Math, Science, Languages"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="glass-card border-primary/30 focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="glass-card border-primary/30 focus:border-primary"
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button 
              type="submit"
              disabled={!title.trim() || isSubmitting}
              className="flex-1 bg-gradient-to-r from-primary to-primary-light hover:shadow-lg hover:shadow-primary/30"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding...
                </div>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </>
              )}
            </Button>
            
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="border-muted hover:bg-muted/20"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};