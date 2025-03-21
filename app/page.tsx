// File: app/page.tsx
'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TaskList from '@/components/TaskList';
import AddTaskInput from '@/components/AddTaskInput';
import Calendar from '@/components/Calendar';
import { Task } from '@/types/task';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Random Task 1', completed: false, isStarred: false },
    { id: 2, title: 'Random Task 2', completed: false, isStarred: false },
    { id: 3, title: 'Completed Task Example', completed: true, isStarred: false },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [activeView, setActiveView] = useState('tasks'); // 'tasks' or 'calendar'

  const addTask = (title: string, date?: Date) => {
    if (title.trim() === '') return;
    
    const newTask: Task = {
      id: Date.now(),
      title: title,
      completed: false,
      isStarred: false,
      dueDate: date // Add the date if provided
    };
    
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const toggleComplete = (id: number) => {
    updateTask(id, { completed: !tasks.find(t => t.id === id)?.completed });
  };

  const toggleStar = (id: number) => {
    updateTask(id, { isStarred: !tasks.find(t => t.id === id)?.isStarred });
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'today') return !task.completed;
    if (activeTab === 'completed') return task.completed;
    return true;
  }).filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      {activeView === 'tasks' ? (
        <div className="flex-1 bg-gray-800 p-4 flex flex-col">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl text-white font-semibold">Task Manager</h2>
            <button 
              onClick={() => setActiveView('calendar')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Switch to Calendar
            </button>
          </div>
          <TaskList 
            tasks={filteredTasks} 
            toggleComplete={toggleComplete} 
            toggleStar={toggleStar} 
          />
          <AddTaskInput addTask={addTask} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="p-4 bg-white border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">Calendar View</h2>
            <button 
              onClick={() => setActiveView('tasks')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Switch to Tasks
            </button>
          </div>
          <div className="flex-1">
            <Calendar 
              tasks={tasks} 
              addTask={addTask} 
              updateTask={updateTask}
            />
          </div>
        </div>
      )}
    </div>
  );
}