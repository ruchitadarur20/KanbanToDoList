import { Task, Status } from '../types/task';

const STORAGE_KEY = 'kanban-tasks';

export const getTasks = (): Task[] => {
    if (typeof window === 'undefined') return [];
    const tasks = localStorage.getItem(STORAGE_KEY);
    return tasks ? JSON.parse(tasks) : [];
};

export const saveTasks = (tasks: Task[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const addTask = (task: Task): void => {
    const tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);
};

export const updateTask = (updatedTask: Task): void => {
    const tasks = getTasks();
    const index = tasks.findIndex((task) => task.id === updatedTask.id);
    if (index !== -1) {
        tasks[index] = updatedTask;
        saveTasks(tasks);
    }
};

export const deleteTask = (taskId: string): void => {
    const tasks = getTasks();
    const filteredTasks = tasks.filter((task) => task.id !== taskId);
    saveTasks(filteredTasks);
};

export const getTasksByStatus = (status: Status): Task[] => {
    const tasks = getTasks();
    return tasks.filter((task) => task.status === status);
}; 