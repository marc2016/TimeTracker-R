import { useState } from "react";
import {
    Typography,
    Box,
    Divider,
    Fab,
    Chip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useTaskStore, Task } from "../store/useTaskStore";
import TaskCard from "../components/TaskCard";
import TaskDrawer from "../components/TaskDrawer";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

export default function Tasks() {
    const { tasks, addTask, updateTask, toggleTask, toggleTaskTimer, deleteTask } = useTaskStore();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const handleOpenDrawer = (task?: Task) => {
        setEditingTask(task || null);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    const handleSaveTask = (title: string, description: string, completed: boolean, projectId: string | null) => {
        if (editingTask) {
            updateTask(editingTask.id, title, description, completed, projectId);
        } else {
            addTask(title, description, projectId);
        }
    };

    const openTasks = tasks.filter(task => !task.completed).sort((a, b) => b.createdAt - a.createdAt);
    const completedTasks = tasks.filter(task => task.completed).sort((a, b) => b.updatedAt - a.updatedAt);

    return (
        <Box sx={{ pb: 10 }}> {/* Added padding for FAB */}

            <LayoutGroup>
                {/* Open Tasks */}
                <Box sx={{ mb: 6 }}>
                    {openTasks.length === 0 && (
                        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontStyle: 'italic' }}>
                            Keine offenen Aufgaben.
                        </Typography>
                    )}
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 2
                    }}>
                        <AnimatePresence mode="popLayout">
                            {openTasks.map((task) => (
                                <Box
                                    key={task.id}
                                    component={motion.div}
                                    layoutId={task.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    sx={{ maxWidth: 280, width: '100%', mx: 'auto' }}
                                >
                                    <TaskCard
                                        task={task}
                                        onToggle={toggleTask}
                                        onToggleTimer={toggleTaskTimer}
                                        onDelete={deleteTask}
                                        onClick={() => handleOpenDrawer(task)}
                                    />
                                </Box>
                            ))}
                        </AnimatePresence>
                    </Box>
                </Box>

                {/* Completed Tasks */}
                {completedTasks.length > 0 && (
                    <Box>
                        <Divider textAlign="left" sx={{
                            my: 4,
                            "&::before, &::after": {
                                borderColor: 'rgba(73, 181, 23, 0.5)',
                                borderTopWidth: 2
                            }
                        }} >
                            <Chip icon={<TaskAltIcon />} label="Abgeschlossene Aufgaben" color="success" />
                        </Divider>
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: 2
                        }}>
                            <AnimatePresence mode="popLayout">
                                {completedTasks.map((task) => (
                                    <Box
                                        key={task.id}
                                        component={motion.div}
                                        layoutId={task.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.3 }}
                                        sx={{ maxWidth: 280, width: '100%', mx: 'auto' }}
                                    >
                                        <TaskCard
                                            task={task}
                                            onToggle={toggleTask}
                                            onToggleTimer={toggleTaskTimer}
                                            onDelete={deleteTask}
                                            onClick={() => handleOpenDrawer(task)}
                                        />
                                    </Box>
                                ))}
                            </AnimatePresence>
                        </Box>
                    </Box>
                )}
            </LayoutGroup>

            {/* FAB */}
            <Fab
                sx={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                    zIndex: 1000,
                    bgcolor: 'white',
                    color: 'black',
                    '&:hover': {
                        bgcolor: '#f5f5f5' // slightly grey on hover
                    }
                }}
                onClick={() => handleOpenDrawer()}
            >
                <AddIcon />
            </Fab>

            {/* Action Drawer */}
            <TaskDrawer
                open={isDrawerOpen}
                onClose={handleCloseDrawer}
                task={editingTask}
                onSave={handleSaveTask}
            />
        </Box>
    );
}
