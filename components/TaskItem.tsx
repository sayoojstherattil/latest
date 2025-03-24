// File: components/TaskItem.tsx
"use client"

import { FiStar, FiEdit2 } from 'react-icons/fi';
import { BsCheck2 } from 'react-icons/bs';
import { useState } from 'react';
import { Task, Category } from '@/types/task';
import EditTaskModal from '@/components/TaskModal';

interface TaskItemProps {
  task: Task;
  categories: Category[];
  toggleComplete: (id: string) => void;
  toggleStar?: (id: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
}

export default function TaskItem({ task, categories, toggleComplete, toggleStar, updateTask }: TaskItemProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg p-3 flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <div 
            className={`h-6 w-6 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer ${
              task.completed ? 'bg-green-100' : ''
            }`}
            onClick={() => toggleComplete(task.id)}
          >
            {task.completed && <BsCheck2 className="text-green-500" />}
          </div>
          <div>
            <span className={task.completed ? 'line-through' : ''}>{task.title}</span>
            {task.dueDate && (
              <div className="text-xs text-gray-500">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="text-sm px-2 py-1 text-gray-500 flex items-center gap-1"
            onClick={() => setShowEditModal(true)}
          >
            <FiEdit2 size={14} /> edit
          </button>
          <button className="text-sm px-2 py-1 text-gray-500">reply</button>
          <button className="text-sm px-2 py-1 text-gray-500">collaborate</button>
          {toggleStar && (
            <FiStar 
              className={`cursor-pointer ${task.isStarred ? 'text-yellow-400' : 'text-gray-400'}`}
              onClick={() => toggleStar(task.id)}
            />
          )}
        </div>
      </div>

      {showEditModal && (
        <EditTaskModal
          task={task}
          categories={categories}
          onSave={updateTask}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}