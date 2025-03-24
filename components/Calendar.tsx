"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Task, Category } from '@/types/task'; 

interface CalendarProps {
  tasks: Task[];
  categories: Category[]; 
  addTask?: (title: string, date?: Date) => void;
  updateTask?: (id: string, updates: Partial<Task>) => void;
}

const Calendar: React.FC<CalendarProps> = ({ 
  tasks = [], 
  categories = [], // Add this with default empty array
  addTask, 
  updateTask 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewType, setViewType] = useState('month'); // 'month', 'week', or 'day'
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  
  // New state for the context menu
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    taskId: string;
    visible: boolean;
  }>({
    x: 0,
    y: 0,
    taskId: '', // Changed from -1 to ''
    visible: false
  });

  // New state for the date picker in context menu
  const [rescheduleDate, setRescheduleDate] = useState<Date | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Hide context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(prev => ({ ...prev, visible: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const goToThisMonth = () => {
    setCurrentMonth(new Date());
  };
  
  // Helper function to get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper function to get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    // Adjust for Monday as first day of week
    const firstDayIndex = firstDay === 0 ? 6 : firstDay - 1;
    
    // Get days from previous month
    const prevMonthDays = [];
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);
    
    for (let i = daysInPrevMonth - firstDayIndex + 1; i <= daysInPrevMonth; i++) {
      prevMonthDays.push({
        day: i,
        currentMonth: false,
        date: new Date(prevMonthYear, prevMonth, i)
      });
    }
    
    // Current month days
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        day: i,
        currentMonth: true,
        date: new Date(year, month, i)
      });
    }
    
    // Next month days
    const nextMonthDays = [];
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    const totalDaysDisplayed = Math.ceil((firstDayIndex + daysInMonth) / 7) * 7;
    const daysFromNextMonth = totalDaysDisplayed - (prevMonthDays.length + currentMonthDays.length);
    
    for (let i = 1; i <= daysFromNextMonth; i++) {
      nextMonthDays.push({
        day: i,
        currentMonth: false,
        date: new Date(nextMonthYear, nextMonth, i)
      });
    }
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  // Generate weeks from days
  const generateCalendarWeeks = () => {
    const days = generateCalendarDays();
    const weeks = [];
    
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    
    return weeks;
  };

  // Handle date selection - FIXED: Now cancels editing if a date is clicked
  const handleDateClick = (date: Date) => {
    // If we're already editing a task, cancel the editing and allow selecting a new date
    if (editingTask) {
      setEditingTask(null);
      setEditTaskTitle('');
    }
    
    setSelectedDate(date);
    // Hide context menu if it's open
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  // Handle task addition
  const handleAddTask = () => {
    if (newTaskTitle.trim() !== '' && selectedDate && addTask) {
      addTask(newTaskTitle, selectedDate);
      setNewTaskTitle('');
      setSelectedDate(null);
    }
  };

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  const handleTaskDragStart = (e: React.DragEvent, taskId: string) => {
    e.stopPropagation();
    setDraggingTaskId(taskId); // No need to convert, since draggingTaskId now accepts a string
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };
  
    // New function to handle right-click on a task
  const handleTaskRightClick = (e: React.MouseEvent, taskId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const task = tasks.find(t => t.id === taskId);
    if (task && task.dueDate) {
      setRescheduleDate(new Date(task.dueDate));
    } else {
      setRescheduleDate(new Date());
    }
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      taskId: taskId,
      visible: true
    });
  };

  // Handle dropping a task onto a day
  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    e.stopPropagation();
    const taskId = e.dataTransfer.getData('text/plain');
    
    if (updateTask && taskId) {
      updateTask(taskId, { dueDate: date });
    }
    
    setDraggingTaskId(null);
  };

  // Allow drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle task click for editing
  const handleTaskClick = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    
    // Clear any selected date to prevent new task form from showing
    setSelectedDate(null);
    
    // Set up task editing
    setEditingTask(task);
    setEditTaskTitle(task.title);
    
    // Hide context menu if it's open
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  // New function to reschedule a task
  const handleRescheduleTask = () => {
    if (updateTask && contextMenu.taskId !== '' && rescheduleDate) { // Changed from -1 to ''
      updateTask(contextMenu.taskId, { dueDate: rescheduleDate });
      // Hide context menu
      setContextMenu(prev => ({ ...prev, visible: false }));
    }
  };

  // Format date for the date input
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Update task title
  const handleTaskUpdate = () => {
    if (editingTask && updateTask && editTaskTitle.trim() !== '') {
      updateTask(editingTask.id, { title: editTaskTitle });
      setEditingTask(null);
      setEditTaskTitle('');
    }
  };

  // Cancel task editing
  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditTaskTitle('');
  };

  // Toggle task completion status
  const handleToggleComplete = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    if (updateTask) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        updateTask(taskId, { completed: !task.completed });
      }
    }
  };
  
  return (
    <div className="flex h-screen">
      {/* Left sidebar with small calendar */}
      <div className="w-64 border-r bg-white p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm">Choose month</div>
          <div className="flex items-center text-sm text-gray-500">
            <span>{monthNames[currentMonth.getMonth()].slice(0, 3)} {currentMonth.getFullYear()}</span>
            <button onClick={goToPrevMonth} className="ml-2 text-blue-500 hover:text-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button onClick={goToNextMonth} className="ml-1 text-blue-500 hover:text-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mini calendar */}
        <div className="mb-8">
          <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-1">
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
            <div>S</div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {generateCalendarWeeks().flat().map((day, i) => (
              <div 
                key={i} 
                className={`w-6 h-6 flex items-center justify-center rounded-full 
                  ${day.currentMonth ? 'cursor-pointer hover:bg-gray-100' : 'text-gray-400 cursor-pointer hover:bg-gray-100'}
                  ${day.day === new Date().getDate() && day.currentMonth && 
                     currentMonth.getMonth() === new Date().getMonth() && 
                     currentMonth.getFullYear() === new Date().getFullYear() ? 'bg-gray-200' : ''}
                `}
                onClick={() => day.currentMonth && handleDateClick(day.date)}
              >
                {day.day}
              </div>
            ))}
          </div>
        </div>
        
        {/* Sessions section */}
        <div className="mb-8">
          <h3 className="text-sm font-medium mb-3">Your sessions</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-2" />
              <span className="text-sm">My published sessions</span>
            </div>
            <div className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-2" />
              <span className="text-sm">Sessions I'm invited to</span>
            </div>
            <div className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-2" />
              <span className="text-sm">My booked sessions</span>
            </div>
            <div className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-2" />
              <span className="text-sm">My events</span>
            </div>
          </div>
        </div>
        
        {/* Calendars section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Your calendars</h3>
            <button className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="8"></line>
              </svg>
            </button>
          </div>
          <div className="flex items-center">
            <input type="checkbox" defaultChecked className="mr-2" />
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm">Sessions</span>
          </div>
        </div>
      </div>
      
      {/* Main calendar area */}
      <div className="flex-1 bg-white flex flex-col">
        {/* Calendar header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{monthNames[currentMonth.getMonth()]} - {currentMonth.getFullYear()}</h2>
          <div className="flex items-center space-x-4">
            <button onClick={goToThisMonth} className="text-blue-500 hover:text-blue-700 text-sm font-medium">
              This month
            </button>
            <div className="flex space-x-2">
              <button onClick={goToPrevMonth} className="p-1 rounded border hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button onClick={goToNextMonth} className="p-1 rounded border hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
            <div className="relative">
              <button className="flex items-center space-x-1 border rounded px-3 py-1 hover:bg-gray-100">
                <span className="text-sm">{viewType.charAt(0).toUpperCase() + viewType.slice(1)} view</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Month view calendar */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-7 border-b">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="p-2 text-center border-r">
                <div className="font-medium">{day}</div>
                <div className="inline-flex items-center justify-center">
                  <span className="text-sm text-gray-500 mr-1">0</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7">
            {generateCalendarWeeks().map((week, weekIndex) => (
              <React.Fragment key={weekIndex}>
                {week.map((day, dayIndex) => (
                  <div 
                    key={`${weekIndex}-${dayIndex}`} 
                    className={`border-r border-b p-2 min-h-20 ${
                      day.currentMonth ? 'bg-white hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'
                    } ${
                      selectedDate && 
                      selectedDate.getDate() === day.date.getDate() && 
                      selectedDate.getMonth() === day.date.getMonth() && 
                      selectedDate.getFullYear() === day.date.getFullYear() ? 
                      'ring-2 ring-blue-500 ring-inset' : ''
                    }`}
                    onClick={() => day.currentMonth && handleDateClick(day.date)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day.date)}
                  >
                    <div className={`text-right text-sm ${
                      day.currentMonth ? '' : 'text-gray-500'
                    }`}>
                      {day.day}
                    </div>
                    
                    {/* Display tasks for this day */}
                    <div className="mt-1">
                      {getTasksForDate(day.date).map(task => (
                        <div 
                          key={task.id}
                          className={`text-xs p-1 mb-1 rounded cursor-move flex items-center justify-between ${
                            task.completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          } ${draggingTaskId === task.id ? 'opacity-50' : ''}`}
                          onClick={(e) => handleTaskClick(e, task)}
                          onContextMenu={(e) => handleTaskRightClick(e, task.id)}
                          draggable
                          onDragStart={(e) => handleTaskDragStart(e, task.id)}
                        >
                          <div className="flex items-center">
                            <input 
                              type="checkbox"
                              className="mr-1"
                              checked={task.completed || false}
                              onChange={(e) => {}}
                              onClick={(e) => handleToggleComplete(e, task.id)}
                            />
                            <span className={task.completed ? 'line-through' : ''}>{task.title}</span>
                          </div>
                          <div className="cursor-grab" title="Drag to reschedule">⋮</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Context menu for rescheduling tasks */}
        {contextMenu.visible && (
            <div 
              ref={contextMenuRef}
              className="fixed bg-white shadow-lg rounded border p-3 z-50"
              style={{ 
                left: `${contextMenu.x}px`, 
                top: `${contextMenu.y}px`,
                minWidth: '200px'
              }}
            >
              <h3 className="text-sm font-medium mb-2">Task Options</h3>
              <div className="flex flex-col space-y-3">
                <div>
                  <label className="block text-xs mb-1">Due Date</label>
                  <input 
                    type="date" 
                    className="border rounded p-1 text-sm w-full"
                    value={rescheduleDate ? formatDateForInput(rescheduleDate) : ''}
                    onChange={(e) => setRescheduleDate(e.target.value ? new Date(e.target.value) : null)}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Category</label>
                  <select
                    value={tasks.find(t => t.id === contextMenu.taskId)?.categoryId || ''}
                    onChange={(e) => {
                      const categoryId = e.target.value || undefined;
                      if (updateTask) {
                        updateTask(contextMenu.taskId, { categoryId });
                      }
                    }}
                    className="border rounded p-1 text-sm w-full"
                  >
                    <option value="">Uncategorized</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-between pt-2">
                  <button 
                    onClick={handleRescheduleTask}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
                  >
                    Apply
                  </button>
                  <button 
                    onClick={() => setContextMenu(prev => ({ ...prev, visible: false }))}
                    className="text-gray-500 px-2 py-1 rounded hover:bg-gray-100 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
        )}
        
        {/* Task input form (shows when a date is selected) */}
        {selectedDate && !editingTask && (
          <div className="border-t p-4 bg-gray-50">
            <h3 className="text-sm font-medium mb-2">
              Add task for {selectedDate.toLocaleDateString()}
            </h3>
            <div className="flex">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter task title"
                className="flex-1 border rounded-l p-2 text-sm"
              />
              <button 
                onClick={handleAddTask}
                className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 text-sm"
              >
                Add Task
              </button>
            </div>
            <button 
              onClick={() => setSelectedDate(null)}
              className="text-sm text-gray-500 mt-2 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        )}
        
        {/* Task edit form (shows when a task is selected for editing) */}
        {editingTask && (
  <div className="border-t p-4 bg-gray-50">
    <h3 className="text-sm font-medium mb-2">Edit task</h3>
    <div className="flex mb-2">
      <input
        type="text"
        value={editTaskTitle}
        onChange={(e) => setEditTaskTitle(e.target.value)}
        placeholder="Enter task title"
        className="flex-1 border rounded p-2 text-sm"
      />
    </div>
    <div className="flex items-center mb-2">
      <label className="text-sm mr-2">Category:</label>
      <select
        value={editingTask.categoryId || ''}
        onChange={(e) => {
          const categoryId = e.target.value || undefined;
          if (updateTask) {
            updateTask(editingTask.id, { categoryId });
          }
        }}
        className="border rounded p-1 text-sm"
      >
        <option value="">Uncategorized</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
    {editingTask.dueDate && (
      <div className="flex items-center mb-2">
        <label className="text-sm mr-2">Due Date:</label>
        <input
          type="date"
          value={formatDateForInput(new Date(editingTask.dueDate))}
          onChange={(e) => {
            if (updateTask && e.target.value) {
              updateTask(editingTask.id, { dueDate: new Date(e.target.value) });
            }
          }}
          className="border rounded p-1 text-sm"
        />
      </div>
    )}
    <div className="flex justify-between">
      <button
        onClick={handleTaskUpdate}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
      >
        Save
      </button>
      <button
        onClick={handleCancelEdit}
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        Cancel
      </button>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default Calendar;