// Sidebar.tsx

"use client"
import React, { useState } from 'react';
import { FiHome, FiStar, FiCalendar, FiList, FiChevronDown, FiChevronRight, FiPlus } from 'react-icons/fi';
import { Task, Category} from '@/types/task';

interface SidebarProps {
  tasks: Task[];
  categories: Category[];
  onCategoryClick: (categoryId: string | null) => void;
  selectedCategoryId: string | null;
  onCreateCategory: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  tasks, 
  categories, 
  onCategoryClick, 
  selectedCategoryId,
  onCreateCategory 
}) => {
  const [myTasksExpanded, setMyTasksExpanded] = useState(true);
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);

  // Count tasks by category
  const getCategoryTaskCount = (categoryId: string) => {
    return tasks.filter(task => task.categoryId === categoryId).length;
  };

  // Count uncategorized tasks
  const getUncategorizedTaskCount = () => {
    return tasks.filter(task => !task.categoryId).length;
  };

  // Count all tasks
  const getAllTasksCount = () => {
    return tasks.length;
  };

  return (
    <div className="w-64 h-full bg-gray-100 p-4">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-blue-500 rounded-full mr-2"></div>
        <h1 className="text-xl font-bold">TaskApp</h1>
      </div>

      <nav>
        <ul className="space-y-1">
          <li>
            <a 
              href="#" 
              className="flex items-center px-4 py-2 text-gray-700 rounded hover:bg-gray-200"
            >
              <FiHome className="mr-3" />
              Dashboard
            </a>
          </li>
          
          <li className="mt-4">
            <div 
              className="flex items-center justify-between px-4 py-2 text-gray-700 cursor-pointer"
              onClick={() => setMyTasksExpanded(!myTasksExpanded)}
            >
              <div className="flex items-center">
                {myTasksExpanded ? <FiChevronDown className="mr-1" /> : <FiChevronRight className="mr-1" />}
                <span>My Tasks</span>
              </div>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                {getAllTasksCount()}
              </span>
            </div>
            
            {myTasksExpanded && (
              <ul className="ml-5 space-y-1 mt-1">
                <li>
                  <a 
                    href="#" 
                    className={`flex items-center px-4 py-2 rounded hover:bg-gray-200 ${selectedCategoryId === null ? 'bg-gray-200 text-blue-500 font-medium' : 'text-gray-700'}`}
                    onClick={() => onCategoryClick(null)}
                  >
                    <FiList className="mr-3" />
                    All Tasks
                    <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded">
                      {getAllTasksCount()}
                    </span>
                  </a>
                </li>
                
                <li>
                  <a 
                    href="#" 
                    className={`flex items-center px-4 py-2 rounded hover:bg-gray-200 ${selectedCategoryId === 'uncategorized' ? 'bg-gray-200 text-blue-500 font-medium' : 'text-gray-700'}`}
                    onClick={() => onCategoryClick('uncategorized')}
                  >
                    <div className="w-3 h-3 rounded-full bg-gray-400 mr-3"></div>
                    Uncategorized
                    <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded">
                      {getUncategorizedTaskCount()}
                    </span>
                  </a>
                </li>
                
                {categories.map(category => (
                  <li key={category.id}>
                    <a 
                      href="#" 
                      className={`flex items-center px-4 py-2 rounded hover:bg-gray-200 ${selectedCategoryId === category.id ? 'bg-gray-200 text-blue-500 font-medium' : 'text-gray-700'}`}
                      onClick={() => onCategoryClick(category.id)}
                    >
                      <div 
                        className="w-3 h-3 rounded-full mr-3" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      {category.name}
                      <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded">
                        {getCategoryTaskCount(category.id)}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
          
          <li className="mt-4">
            <div 
              className="flex items-center justify-between px-4 py-2 text-gray-700 cursor-pointer"
              onClick={() => setCategoriesExpanded(!categoriesExpanded)}
            >
              <div className="flex items-center">
                {categoriesExpanded ? <FiChevronDown className="mr-1" /> : <FiChevronRight className="mr-1" />}
                <span>Categories</span>
              </div>
              <button 
                className="text-gray-500 hover:text-blue-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateCategory();
                }}
              >
                <FiPlus />
              </button>
            </div>
            
            {categoriesExpanded && (
              <ul className="ml-5 space-y-1 mt-1">
                {categories.length > 0 ? (
                  categories.map(category => (
                    <li key={category.id}>
                      <a 
                        href="#" 
                        className={`flex items-center px-4 py-2 rounded hover:bg-gray-200 ${selectedCategoryId === category.id ? 'bg-gray-200 text-blue-500 font-medium' : 'text-gray-700'}`}
                        onClick={() => onCategoryClick(category.id)}
                      >
                        <div 
                          className="w-3 h-3 rounded-full mr-3" 
                          style={{ backgroundColor: category.color }}
                        ></div>
                        {category.name}
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500 text-sm italic">
                    No categories yet
                  </li>
                )}
              </ul>
            )}
          </li>
          
          <li>
            <a 
              href="#" 
              className="flex items-center px-4 py-2 text-gray-700 rounded hover:bg-gray-200 mt-4"
            >
              <FiStar className="mr-3" />
              Important
            </a>
          </li>
          
          <li>
            <a 
              href="#" 
              className="flex items-center px-4 py-2 text-gray-700 rounded hover:bg-gray-200"
            >
              <FiCalendar className="mr-3" />
              Planned
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;