// AddTaskInput.tsx
import { useState, useRef, useEffect } from 'react';
import { FiUser, FiClock, FiArrowUp, FiList, FiCalendar, FiFolder } from 'react-icons/fi';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface AddTaskInputProps {
  addTask: (title: string, reminderDate?: Date, categoryId?: string) => void;
  categories: Category[];
}

export default function AddTaskInput({ addTask, categories = [] }: AddTaskInputProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [reminderDate, setReminderDate] = useState<Date | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showReminderDropdown, setShowReminderDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close dropdowns when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowReminderDropdown(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowCustomDatePicker(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Set default values for custom date/time pickers
  useEffect(() => {
    const now = new Date();
    const dateString = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const nextHour = new Date(now.setHours(now.getHours() + 1, 0, 0, 0));
    const timeString = nextHour.toTimeString().slice(0, 5); // HH:MM
    
    setCustomDate(dateString);
    setCustomTime(timeString);
  }, [showCustomDatePicker]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim() !== '') {
      addTask(newTaskTitle, reminderDate, selectedCategory?.id);
      setNewTaskTitle('');
      setReminderDate(undefined);
      setSelectedCategory(null);
    }
  };

  const setReminderOption = (option: string) => {
    const now = new Date();
    let newDate = new Date();
    
    switch(option) {
      case "later_today":
        newDate.setHours(18, 0, 0, 0); // 6:00 PM today
        break;
      case "tomorrow":
        newDate.setDate(now.getDate() + 1);
        newDate.setHours(9, 0, 0, 0); // 9:00 AM tomorrow
        break;
      case "next_week":
        newDate.setDate(now.getDate() + 7);
        newDate.setHours(9, 0, 0, 0); // 9:00 AM next week
        break;
      case "weekend":
        // Find the next Saturday
        const daysUntilWeekend = (6 - now.getDay() + 7) % 7 || 7;
        newDate.setDate(now.getDate() + daysUntilWeekend);
        newDate.setHours(10, 0, 0, 0); // 10:00 AM on weekend
        break;
      case "custom":
        setShowCustomDatePicker(true);
        return;
      case "none":
        setReminderDate(undefined);
        setShowReminderDropdown(false);
        return;
      default:
        // One hour from now
        newDate.setHours(now.getHours() + 1);
        break;
    }
    
    setReminderDate(newDate);
    setShowReminderDropdown(false);
  };

  const handleCustomDateSelection = () => {
    if (customDate && customTime) {
      const [year, month, day] = customDate.split('-').map(Number);
      const [hours, minutes] = customTime.split(':').map(Number);
      
      const customReminderDate = new Date(year, month - 1, day, hours, minutes);
      
      if (!isNaN(customReminderDate.getTime())) {
        setReminderDate(customReminderDate);
        setShowCustomDatePicker(false);
        setShowReminderDropdown(false);
      }
    }
  };

  const handleCategorySelection = (category: Category) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
  };

  const formatReminderText = (date: Date) => {
    const now = new Date();
    const isToday = date.getDate() === now.getDate() && 
                   date.getMonth() === now.getMonth() && 
                   date.getFullYear() === now.getFullYear();
    
    const isTomorrow = date.getDate() === new Date(now.getTime() + 86400000).getDate() && 
                       date.getMonth() === now.getMonth() && 
                       date.getFullYear() === now.getFullYear();
    
    if (isToday) {
      return `Today at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    } else if (isTomorrow) {
      return `Tomorrow at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    } else {
      return date.toLocaleDateString([], {weekday: 'short', month: 'short', day: 'numeric'}) + 
             ` at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
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
          <FiUser 
            className="text-gray-500 cursor-pointer hover:text-blue-500" 
            onClick={() => alert('Assign user feature coming soon')}
            title="Assign to user"
          />
          <div className="relative" ref={dropdownRef}>
            <FiClock 
              className={`cursor-pointer ${reminderDate ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-500`} 
              onClick={() => {
                setShowReminderDropdown(!showReminderDropdown);
                setShowCustomDatePicker(false);
                setShowCategoryDropdown(false);
              }}
              title="Set reminder"
            />
            {showReminderDropdown && (
              <div className="absolute right-0 mt-1 py-2 w-48 bg-white rounded-md shadow-xl z-10">
                <div 
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setReminderOption("later_today")}
                >
                  Later today
                </div>
                <div 
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setReminderOption("tomorrow")}
                >
                  Tomorrow morning
                </div>
                <div 
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setReminderOption("next_week")}
                >
                  Next week
                </div>
                <div 
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setReminderOption("weekend")}
                >
                  This weekend
                </div>
                <div 
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => setReminderOption("custom")}
                >
                  <FiCalendar className="mr-2" />
                  Custom date/time
                </div>
                <div 
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setReminderOption("none")}
                >
                  No reminder
                </div>
              </div>
            )}
            {showCustomDatePicker && (
              <div 
                className="absolute right-0 mt-1 p-3 bg-white rounded-md shadow-xl z-20 w-64"
                ref={datePickerRef}
              >
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    onClick={() => setShowCustomDatePicker(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleCustomDateSelection}
                  >
                    Set Reminder
                  </button>
                </div>
              </div>
            )}
          </div>
          <FiArrowUp 
            className="text-gray-500 cursor-pointer border border-gray-300 rounded p-1 hover:bg-gray-100" 
            onClick={handleAddTask}
            title="Add task"
          />
          <div className="relative" ref={categoryDropdownRef}>
            <div 
              className={`border border-gray-300 rounded p-1 cursor-pointer hover:bg-gray-100 ${selectedCategory ? 'bg-gray-100' : ''}`}
              onClick={() => {
                setShowCategoryDropdown(!showCategoryDropdown);
                setShowReminderDropdown(false);
                setShowCustomDatePicker(false);
              }}
              title="Add to category"
            >
              <FiList className={`${selectedCategory ? 'text-blue-500' : 'text-gray-500'}`} />
            </div>
            {showCategoryDropdown && (
              <div className="absolute right-0 mt-1 py-2 w-48 bg-white rounded-md shadow-xl z-10">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-b">
                  Categories
                </div>
                
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div 
                      key={category.id}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => handleCategorySelection(category)}
                    >
                      <span 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: category.color }}
                      ></span>
                      {category.name}
                      {selectedCategory?.id === category.id && (
                        <span className="ml-auto text-blue-500">✓</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500 italic">
                    No categories found
                  </div>
                )}
                
                <div className="border-t mt-1">
                  <div 
                    className="px-4 py-2 text-sm text-blue-500 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => {
                      setShowCategoryDropdown(false);
                      alert('Create category feature coming soon');
                    }}
                  >
                    <FiFolder className="mr-2" />
                    Create new category
                  </div>
                  
                  {selectedCategory && (
                    <div 
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedCategory(null);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      Clear selection
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 text-sm text-gray-300 mt-1 pl-2">
        {reminderDate && (
          <div className="flex items-center">
            <FiClock className="mr-1 text-xs" />
            {formatReminderText(reminderDate)}
          </div>
        )}
        {selectedCategory && (
          <div className="flex items-center">
            <span 
              className="w-2 h-2 rounded-full mr-1" 
              style={{ backgroundColor: selectedCategory.color }}
            ></span>
            {selectedCategory.name}
          </div>
        )}
      </div>
    </div>
  );
}