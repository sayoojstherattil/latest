// File: types/task.ts

export interface Task {
    id: number;
    title: string;
    completed: boolean;
    isStarred: boolean;
    // Optional fields that might be useful for future development
    dueDate?: Date;
    description?: string;
    category?: string;
  }