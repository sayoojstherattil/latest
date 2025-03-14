// File: components/TaskList.tsx
import { BsCheck2 } from 'react-icons/bs';
import TaskItem from './TaskItem';
import { Task } from '@/types/task';

interface TaskListProps {
  tasks: Task[];
  toggleComplete: (id: number) => void;
  toggleStar: (id: number) => void;
}

export default function TaskList({ tasks, toggleComplete, toggleStar }: TaskListProps) {
  const uncompletedTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="flex-1 overflow-y-auto space-y-4">
      {/* Uncompleted Tasks */}
      <div className="space-y-2">
        {uncompletedTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            toggleComplete={toggleComplete}
            toggleStar={toggleStar}
          />
        ))}
      </div>
      
      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center text-green-500 mb-2">
            <BsCheck2 />
            <span className="ml-2">Completed</span>
          </div>
          <div className="space-y-2 opacity-70">
            {completedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                toggleComplete={toggleComplete}
                toggleStar={toggleStar}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}