// File: components/AddTaskInput.tsx
import { useState } from 'react';
import { FiUser, FiClock, FiArrowUp, FiList } from 'react-icons/fi';

interface AddTaskInputProps {
  addTask: (title: string) => void;
}

export default function AddTaskInput({ addTask }: AddTaskInputProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask(newTaskTitle);
      setNewTaskTitle('');
    }
  };

  return (
    <div className="mt-auto pt-4">
      <div className="bg-white rounded-lg p-2 flex justify-between items-center">
        <input
          type="text"
          placeholder="Enter your task here"
          className="flex-1 outline-none px-2"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <div className="flex items-center space-x-2">
          <FiUser className="text-gray-500 cursor-pointer" />
          <FiClock className="text-gray-500 cursor-pointer" />
          <FiArrowUp className="text-gray-500 cursor-pointer border border-gray-300 rounded p-1" />
          <div className="border border-gray-300 rounded p-1 cursor-pointer">
            <FiList className="text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
}