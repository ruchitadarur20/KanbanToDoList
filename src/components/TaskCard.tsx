import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Task } from '../types';

interface TaskCardProps {
    task: Task;
    onDelete: (taskId: string) => void;
    onMove: (taskId: string, newStatus: Task['status']) => void;
}

const priorityColors = {
    High: 'bg-red-100 text-red-800 border-red-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Low: 'bg-green-100 text-green-800 border-green-200',
};

const priorityIcons = {
    High: '🔴',
    Medium: '🟡',
    Low: '🟢',
};

export default function TaskCard({ task, onDelete, onMove }: TaskCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-lg p-4 border border-gray-100 hover:shadow-xl transition-shadow"
        >
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-800 flex-grow">{task.title}</h3>
                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium border ${priorityColors[task.priority]}`}>
                    {priorityIcons[task.priority]} {task.priority}
                </span>
            </div>

            {task.description && (
                <p className="text-gray-600 text-sm mb-4">{task.description}</p>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                <div className="flex flex-col">
                    <span className="font-medium text-gray-600">Start Date</span>
                    <span>{format(task.startDate, 'MMM d, yyyy')}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-medium text-gray-600">Due Date</span>
                    <span>{format(task.endDate, 'MMM d, yyyy')}</span>
                </div>
            </div>

            <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                    {task.status !== 'To-Do' && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onMove(task.id, 'To-Do')}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            ← Move to To-Do
                        </motion.button>
                    )}
                    {task.status !== 'In Progress' && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onMove(task.id, 'In Progress')}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            {task.status === 'To-Do' ? 'Start Working →' : '← Move to In Progress'}
                        </motion.button>
                    )}
                    {task.status !== 'Done' && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onMove(task.id, 'Done')}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            Complete →
                        </motion.button>
                    )}
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onDelete(task.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium text-center mt-2"
                >
                    Delete Task
                </motion.button>
            </div>
        </motion.div>
    );
} 