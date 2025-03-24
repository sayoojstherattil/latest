// components/TaskList.tsx
"use client"

import React from 'react';
import TaskItem from './TaskItem';
import { Task, Category } from '@/types/task';

interface TaskListProps {
  tasks: Task[];
  categories: Category[];
  onToggleComplete: (id: string) => void;
  onUpdateCategory: (taskId: string, categoryId: string | undefined) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onToggleStar?: (id: string) => void;
}

export default function TaskList({ 
  tasks, 
  categories, 
  onToggleComplete, 
  onUpdateCategory, 
  onDeleteTask,
  onUpdateTask,
  onToggleStar 
}: TaskListProps) {
  return (
    <div>
      {tasks.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No tasks to display. Add a new task below!
        </div>
      ) : (
        tasks.map(task => (
          <TaskItem 
            key={task.id} 
            task={task} 
            categories={categories}
            toggleComplete={onToggleComplete}
            toggleStar={onToggleStar}
            updateTask={onUpdateTask}
          />
        ))
      )}
    </div>
  );
}