// File: components/Sidebar.tsx
import { FiEye, FiList, FiCalendar, FiSettings, FiLogOut } from 'react-icons/fi';

interface SidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ searchQuery, setSearchQuery, activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="w-64 bg-teal-200 p-4 flex flex-col">
      <div className="mb-6">
        <div className="bg-white rounded-full p-2 mb-4">
          <input
            type="text"
            placeholder="Search your task here"
            className="w-full outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="space-y-3">
          <div 
            className={`flex items-center space-x-3 cursor-pointer ${activeTab === 'all' ? 'font-bold' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <FiEye className="text-gray-700" />
            <span className="font-medium">Upcoming</span>
          </div>
          <div 
            className={`flex items-center space-x-3 cursor-pointer ${activeTab === 'today' ? 'font-bold' : ''}`}
            onClick={() => setActiveTab('today')}
          >
            <FiList className="text-gray-700" />
            <span className="font-medium">Today</span>
          </div>
          <div 
            className={`flex items-center space-x-3 cursor-pointer ${activeTab === 'calendar' ? 'font-bold' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <FiCalendar className="text-gray-700" />
            <span className="font-medium">Calendar</span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="font-medium mb-2">My Tasks (all tasks are here)</h2>
        <div className="pl-4 space-y-2">
          <div className="cursor-pointer">Custom Task set 1</div>
          <div className="cursor-pointer">Custom Task set 2</div>
        </div>
      </div>

      <div className="mt-auto pt-8 space-y-3">
        <div className="flex items-center space-x-3 cursor-pointer">
          <FiSettings className="text-gray-700" />
          <span>Settings</span>
        </div>
        <div className="flex items-center space-x-3 cursor-pointer">
          <FiLogOut className="text-gray-700" />
          <span>Log Out</span>
        </div>
      </div>
    </div>
  );
}