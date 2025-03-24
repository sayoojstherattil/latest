// components/EditTaskModal.tsx
"use client"

import React, { useState, useEffect } from 'react';
import { Task, Category } from '@/types/task';

interface EditTaskModalProps {
  task: Task;
  categories: Category[];
  onSave: (taskId: string, updates: Partial<Task>) => void;
  onClose: () => void;
}

export default function EditTaskModal({ task, categories, onSave, onClose }: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title);
  const [categoryId, setCategoryId] = useState<string | undefined>(task.categoryId);
  const [dueDate, setDueDate] = useState<string | undefined>(
    task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : undefined
  );
  const [reminderDate, setReminderDate] = useState<string | undefined>(
    task.reminderDate ? new Date(task.reminderDate).toISOString().split('T')[0] : undefined
  );

  const handleSave = () => {
    onSave(task.id, {
      title,
      categoryId,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      reminderDate: reminderDate ? new Date(reminderDate) : undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Title
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={categoryId || ''}
            onChange={(e) => setCategoryId(e.target.value || undefined)}
          >
            <option value="">Uncategorized</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={dueDate || ''}
            onChange={(e) => setDueDate(e.target.value || undefined)}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reminder Date
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={reminderDate || ''}
            onChange={(e) => setReminderDate(e.target.value || undefined)}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}