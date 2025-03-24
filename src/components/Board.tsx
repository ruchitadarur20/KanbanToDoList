import { useState, useEffect } from 'react';
import { Board as BoardType, Task } from '../types';
import { loadBoard, saveBoard, getInitialBoard } from '../utils/storage';
import Column from './Column';
import TaskForm from './TaskForm';
import { motion } from 'framer-motion';

export default function Board() {
    const [board, setBoard] = useState<BoardType>(getInitialBoard());
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const savedBoard = loadBoard();
        if (savedBoard) {
            setBoard(savedBoard);
        }
    }, []);

    useEffect(() => {
        saveBoard(board);
    }, [board]);

    const handleAddTask = (task: Task) => {
        setBoard((prevBoard) => ({
            ...prevBoard,
            columns: prevBoard.columns.map((column) =>
                column.id === 'todo'
                    ? { ...column, tasks: [...column.tasks, task] }
                    : column
            ),
        }));
        setShowForm(false);
    };

    const handleDeleteTask = (taskId: string) => {
        setBoard((prevBoard) => ({
            ...prevBoard,
            columns: prevBoard.columns.map((column) => ({
                ...column,
                tasks: column.tasks.filter((task) => task.id !== taskId),
            })),
        }));
    };

    const handleMoveTask = (taskId: string, newStatus: Task['status']) => {
        setBoard((prevBoard) => {
            // Find the task and its source column
            let taskToMove: Task | undefined;
            let sourceColumnId: string | undefined;

            // Find the task to move
            for (const column of prevBoard.columns) {
                const task = column.tasks.find((t) => t.id === taskId);
                if (task) {
                    taskToMove = { ...task, status: newStatus };
                    sourceColumnId = column.id;
                    break;
                }
            }

            if (!taskToMove || !sourceColumnId) return prevBoard;

            // Create new board state with the task moved
            const newBoard: BoardType = {
                ...prevBoard,
                columns: prevBoard.columns.map((column) => {
                    // Remove from source column
                    if (column.id === sourceColumnId) {
                        return {
                            ...column,
                            tasks: column.tasks.filter((t) => t.id !== taskId),
                        };
                    }
                    // Add to target column
                    const targetColumnId = newStatus.toLowerCase().replace(' ', '-');
                    if (column.id === targetColumnId) {
                        return {
                            ...column,
                            tasks: [...column.tasks, taskToMove],
                        };
                    }
                    return column;
                }),
            };

            return newBoard;
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-gray-800 tracking-tight"
                    >
                        Kanban Board
                    </motion.h1>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowForm(!showForm)}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                    >
                        <span className="text-xl mr-1">{showForm ? '−' : '+'}</span>
                        {showForm ? 'Close Form' : 'Add Task'}
                    </motion.button>
                </div>

                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                        opacity: showForm ? 1 : 0,
                        height: showForm ? 'auto' : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mb-8"
                >
                    {showForm && <TaskForm onSubmit={handleAddTask} />}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {board.columns.map((column) => (
                        <Column
                            key={column.id}
                            column={column}
                            onDeleteTask={handleDeleteTask}
                            onMoveTask={handleMoveTask}
                        />
                    ))}
                </motion.div>
            </div>
        </div>
    );
} 