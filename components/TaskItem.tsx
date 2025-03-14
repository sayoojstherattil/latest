// File: components/TaskItem.tsx
import { FiStar } from 'react-icons/fi';
import { BsCheck2 } from 'react-icons/bs';
import { Task } from '@/types/task';

interface TaskItemProps {
  task: Task;
  toggleComplete: (id: number) => void;
  toggleStar: (id: number) => void;
}

export default function TaskItem({ task, toggleComplete, toggleStar }: TaskItemProps) {
  return (
    <div className="bg-white rounded-lg p-3 flex justify-between items-center mb-2">
      <div className="flex items-center gap-3">
        <div 
          className={`h-6 w-6 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer ${
            task.completed ? 'bg-green-100' : ''
          }`}
          onClick={() => toggleComplete(task.id)}
        >
          {task.completed && <BsCheck2 className="text-green-500" />}
        </div>
        <span className={task.completed ? 'line-through' : ''}>{task.title}</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="text-sm px-2 py-1 text-gray-500">reply</button>
        <button className="text-sm px-2 py-1 text-gray-500">collaborate</button>
        <FiStar 
          className={`cursor-pointer ${task.isStarred ? 'text-yellow-400' : 'text-gray-400'}`}
          onClick={() => toggleStar(task.id)}
        />
      </div>
    </div>
  );
}