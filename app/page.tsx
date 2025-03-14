// File: app/page.tsx
'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TaskList from '@/components/TaskList';
import AddTaskInput from '@/components/AddTaskInput';
import { Task } from '@/types/task';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Random Task 1', completed: false, isStarred: false },
    { id: 2, title: 'Random Task 2', completed: false, isStarred: false },
    { id: 3, title: 'Completed Task Example', completed: true, isStarred: false },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const addTask = (title: string) => {
    if (title.trim() === '') return;
    
    const newTask: Task = {
      id: Date.now(),
      title: title,
      completed: false,
      isStarred: false
    };
    
    setTasks([...tasks, newTask]);
  };

  const toggleComplete = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const toggleStar = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, isStarred: !task.isStarred } : task
    ));
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
      
      <div className="flex-1 bg-gray-800 p-4 flex flex-col">
        <TaskList 
          tasks={filteredTasks} 
          toggleComplete={toggleComplete} 
          toggleStar={toggleStar} 
        />
        
        <AddTaskInput addTask={addTask} />
      </div>
    </div>
  );
}