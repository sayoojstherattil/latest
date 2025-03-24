// File: types/task.ts

// export interface Task {
//     id: number;
//     title: string;
//     completed: boolean;
//     isStarred: boolean;
//     // Optional fields that might be useful for future development
//     dueDate?: Date;
//     description?: string;
//     category?: string;
//   }


  // types.ts
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  isStarred: boolean;
  categoryId?: string;
  reminderDate?: Date;
  createdAt: Date;
  dueDate?: Date;
  description?: string;
  category?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}