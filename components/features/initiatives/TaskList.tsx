'use client';

import { Task } from '@/lib/types/dashboard';
import { ProgressBar } from './ProgressBar';

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="mt-2 pl-4 space-y-3">
      {tasks.map((task) => (
        <div key={task.id} className="p-3 bg-white rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{task.name}</span>
            <span className="text-xs text-gray-500">{task.progress}%</span>
          </div>
          <ProgressBar progress={task.progress} size="sm" />
        </div>
      ))}
    </div>
  );
}