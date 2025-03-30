"use client"

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TaskList from '@/components/TaskList';
import AddTaskInput from '@/components/AddTaskInput';
import Calendar from '@/components/Calendar';
import LoginForm from '@/components/LoginForm';
import LogoutButton from '@/components/LogoutButton';
import { Task, Category } from '@/types/task';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: 'work', name: 'Work', color: '#4299e1' },
    { id: 'personal', name: 'Personal', color: '#48bb78' },
    { id: 'shopping', name: 'Shopping', color: '#ed8936' },
  ]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#4299e1');
  const [viewMode, setViewMode] = useState<'tasks' | 'calendar'>('tasks');
  const router = useRouter();

  // Check auth state and load data
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const currentUser = localStorage.getItem('currentUser');
    setIsAuthenticated(!!(authToken && currentUser));
    
    if (authToken && currentUser) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Handle route protection
  useEffect(() => {
    if (isAuthenticated === false && !isLoading) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const loadData = () => {
    const savedTasks = localStorage.getItem('tasks');
    const savedCategories = localStorage.getItem('categories');
    
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        const processedTasks = parsedTasks.map((task: any) => ({
          ...task,
          reminderDate: task.reminderDate ? new Date(task.reminderDate) : undefined,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          createdAt: new Date(task.createdAt)
        }));
        setTasks(processedTasks);
      } catch (error) {
        console.error('Error parsing saved tasks:', error);
      }
    }
    
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (error) {
        console.error('Error parsing saved categories:', error);
      }
    }
    
    setIsLoading(false);
  };

  // Save data only when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, isAuthenticated]);
  
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('categories', JSON.stringify(categories));
    }
  }, [categories, isAuthenticated]);

  // Task management functions (unchanged)
  const addTask = (title: string, reminderDate?: Date, categoryId?: string) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      completed: false,
      categoryId,
      reminderDate,
      createdAt: new Date()
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const addTaskWithDueDate = (title: string, dueDate?: Date) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      completed: false,
      dueDate,
      createdAt: new Date()
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const updateTaskCategory = (taskId: string, categoryId: string | undefined) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, categoryId } : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const addCategory = () => {
    if (newCategoryName.trim() === '') return;
    
    const newCategory: Category = {
      id: uuidv4(),
      name: newCategoryName.trim(),
      color: newCategoryColor
    };
    
    setCategories(prevCategories => [...prevCategories, newCategory]);
    setNewCategoryName('');
    setNewCategoryColor('#4299e1');
    setShowCreateCategoryModal(false);
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(prevCategories => 
      prevCategories.filter(category => category.id !== categoryId)
    );
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.categoryId === categoryId ? { ...task, categoryId: undefined } : task
      )
    );
  };

  // Filter tasks based on selected category
  const filteredTasks = selectedCategoryId === null 
    ? tasks 
    : selectedCategoryId === 'uncategorized'
      ? tasks.filter(task => !task.categoryId)
      : tasks.filter(task => task.categoryId === selectedCategoryId);

  if (isAuthenticated === null || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        tasks={tasks}
        categories={categories}
        onCategoryClick={setSelectedCategoryId}
        selectedCategoryId={selectedCategoryId}
        onCreateCategory={() => setShowCreateCategoryModal(true)}
      />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-700">
            {selectedCategoryId === null 
              ? 'All Tasks' 
              : selectedCategoryId === 'uncategorized'
                ? 'Uncategorized'
                : categories.find(c => c.id === selectedCategoryId)?.name || 'Tasks'}
          </h1>
          <div className="flex space-x-2 items-center">
            <button 
              onClick={() => setViewMode('tasks')}
              className={`px-3 py-1 rounded ${viewMode === 'tasks' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              List View
            </button>
            <button 
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded ${viewMode === 'calendar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Calendar View
            </button>
            <LogoutButton />
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          {viewMode === 'tasks' ? (
            <div className="p-4">
              <TaskList 
                tasks={filteredTasks}
                categories={categories}
                onToggleComplete={toggleTaskCompletion}
                onUpdateCategory={updateTaskCategory}
                onDeleteTask={deleteTask}
                onUpdateTask={updateTask}
              />
            </div>
          ) : (
            <Calendar 
              tasks={tasks} 
              categories={categories}
              addTask={addTaskWithDueDate}
              updateTask={updateTask}
            />
          )}
        </main>
        
        {viewMode === 'tasks' && (
          <div className="p-4 bg-white shadow-top">
            <AddTaskInput 
              addTask={addTask} 
              categories={categories}
            />
          </div>
        )}
      </div>
      
      {showCreateCategoryModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Create New Category</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Work, Personal, Shopping"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  className="w-8 h-8 border-0 p-0"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                />
                <span className="text-sm text-gray-500">
                  {newCategoryColor}
                </span>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                onClick={() => setShowCreateCategoryModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={addCategory}
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;