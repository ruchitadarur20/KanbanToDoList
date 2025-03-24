import { Board } from '../types';

const STORAGE_KEY = 'kanban-board';

interface SerializedTask {
    id: string;
    title: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low';
    startDate: string;
    endDate: string;
    status: 'To-Do' | 'In Progress' | 'Done';
    createdAt: string;
}

interface SerializedColumn {
    id: string;
    title: string;
    tasks: SerializedTask[];
}

interface SerializedBoard {
    columns: SerializedColumn[];
}

export const saveBoard = (board: Board): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
    }
};

export const loadBoard = (): Board | null => {
    if (typeof window !== 'undefined') {
        const savedBoard = localStorage.getItem(STORAGE_KEY);
        if (savedBoard) {
            const parsedBoard = JSON.parse(savedBoard) as SerializedBoard;
            // Convert date strings back to Date objects
            const board: Board = {
                columns: parsedBoard.columns.map(column => ({
                    ...column,
                    tasks: column.tasks.map(task => ({
                        ...task,
                        startDate: new Date(task.startDate),
                        endDate: new Date(task.endDate),
                        createdAt: new Date(task.createdAt)
                    }))
                }))
            };
            return board;
        }
    }
    return null;
};

export const getInitialBoard = (): Board => ({
    columns: [
        {
            id: 'to-do',
            title: 'To-Do',
            tasks: [],
        },
        {
            id: 'in-progress',
            title: 'In Progress',
            tasks: [],
        },
        {
            id: 'done',
            title: 'Done',
            tasks: [],
        },
    ],
}); 