export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    startDate: Date;
    endDate: Date;
    status: 'To-Do' | 'In Progress' | 'Done';
    createdAt: Date;
}

export interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

export interface Board {
    columns: Column[];
} 