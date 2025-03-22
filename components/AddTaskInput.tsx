// Modified AddTaskInput.tsx with fixed reminder options only
import { useState, useRef, useEffect } from 'react';
import { FiUser, FiClock, FiArrowUp, FiList } from 'react-icons/fi';

interface AddTaskInputProps {
  addTask: (title: string, reminderDate?: Date) => void;
}

export default function AddTaskInput({ addTask }: AddTaskInputProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [reminderDate, setReminderDate] = useState<Date | undefined>(undefined);
  const [showReminderDropdown, setShowReminderDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowReminderDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim() !== '') {
      addTask(newTaskTitle, reminderDate);
      setNewTaskTitle('');
      setReminderDate(undefined);
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
              onClick={() => setShowReminderDropdown(!showReminderDropdown)}
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
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setReminderOption("none")}
                >
                  No reminder
                </div>
              </div>
            )}
          </div>
          <FiArrowUp 
            className="text-gray-500 cursor-pointer border border-gray-300 rounded p-1 hover:bg-gray-100" 
            onClick={handleAddTask}
            title="Add task"
          />
          <div 
            className="border border-gray-300 rounded p-1 cursor-pointer hover:bg-gray-100"
            onClick={() => alert('Categories feature coming soon')}
            title="Add to category"
          >
            <FiList className="text-gray-500" />
          </div>
        </div>
      </div>
      {reminderDate && (
        <div className="text-sm text-gray-300 mt-1 pl-2">
          Reminder: {formatReminderText(reminderDate)}
        </div>
      )}
    </div>
  );
}