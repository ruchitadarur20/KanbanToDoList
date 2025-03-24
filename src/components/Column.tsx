import { motion, AnimatePresence } from 'framer-motion';
import { Column as ColumnType, Task } from '../types';
import TaskCard from './TaskCard';

interface ColumnProps {
    column: ColumnType;
    onDeleteTask: (taskId: string) => void;
    onMoveTask: (taskId: string, newStatus: Task['status']) => void;
}

const columnColors: Record<string, string> = {
    'to-do': 'from-pink-50 to-red-50 border-red-200',
    'in-progress': 'from-yellow-50 to-orange-50 border-orange-200',
    'done': 'from-green-50 to-emerald-50 border-emerald-200'
};

export default function Column({ column, onDeleteTask, onMoveTask }: ColumnProps) {
    const getColumnColor = (columnId: string) => {
        return columnColors[columnId.toLowerCase()] || columnColors['to-do'];
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full"
        >
            <div className={`bg-gradient-to-br ${getColumnColor(column.id)} rounded-xl p-4 border-2 shadow-lg h-full min-h-[500px]`}>
                <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center justify-between">
                    {column.title}
                    <span className="text-sm font-normal px-3 py-1 bg-white rounded-full shadow-sm">
                        {column.tasks.length} {column.tasks.length === 1 ? 'task' : 'tasks'}
                    </span>
                </h2>

                <div className="space-y-3">
                    <AnimatePresence>
                        {column.tasks.map((task) => (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <TaskCard
                                    task={task}
                                    onDelete={onDeleteTask}
                                    onMove={onMoveTask}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {column.tasks.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-8"
                        >
                            <p className="text-gray-500 text-sm">No tasks yet</p>
                            <p className="text-gray-400 text-xs mt-1">
                                {column.id.toLowerCase() === 'to-do'
                                    ? 'Add a new task to get started'
                                    : column.id.toLowerCase() === 'in-progress'
                                        ? 'Move tasks here when you start working on them'
                                        : 'Tasks you complete will appear here'
                                }
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
} 