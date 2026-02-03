import { useState, useEffect } from "react";
import {
    Typography,
    Box,
    Divider,
    Fab,
    Paper,
    Select,
    MenuItem,
    FormControl
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
// import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useTaskStore, Task } from "../store/useTaskStore";
import { useProjectStore } from "../store/useProjectStore";
import TaskCard from "../components/TaskCard";
import TaskDrawer from "../components/TaskDrawer";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

import { spring } from "../constants/animations";

export default function Tasks() {
    const { tasks, addTask, updateTask, updateTaskDuration, toggleTask, toggleTaskTimer, deleteTask } = useTaskStore();
    const { projects, init: initProjects } = useProjectStore();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

    useEffect(() => {
        initProjects();
    }, [initProjects]);

    const handleOpenDrawer = (task?: Task) => {
        setEditingTask(task || null);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    const handleSaveTask = async (title: string, description: string, completed: boolean, projectId: string | null, duration?: number) => {
        if (editingTask) {
            await updateTask(editingTask.id, title, description, completed, projectId);
            if (duration !== undefined && duration !== editingTask.accumulatedDuration) {
                await updateTaskDuration(editingTask.id, duration);
            }
        } else {
            await addTask(title, description, projectId);
            // Note: New tasks are created with 0 duration by default. 
            // If we want to support setting duration on creation, we need to update addTask signature or call updateTaskDuration after creation.
            // For now, let's assume new tasks start at 0.
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (selectedProjectId === 'all') return true;
        if (selectedProjectId === 'unassigned') return task.projectId === null;
        return task.projectId === selectedProjectId;
    });

    const openTasks = filteredTasks.filter(task => !task.completed).sort((a, b) => b.createdAt - a.createdAt);
    const completedTasks = filteredTasks.filter(task => task.completed).sort((a, b) => b.updatedAt - a.updatedAt);

    return (
        <Box sx={{ pb: 10 }}> {/* Added padding for FAB */}

            <Paper
                elevation={0}
                sx={{
                    mb: 4,
                    p: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.30)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: 4
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Typography variant="h4" sx={{ fontWeight: 100, color: 'text.secondary' }}>
                            Aufgaben
                        </Typography>
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <Select
                                value={selectedProjectId}
                                onChange={(e) => setSelectedProjectId(e.target.value)}
                                displayEmpty
                                variant="outlined"
                                sx={{
                                    backgroundColor: 'rgba(255,255,255,0.5)',
                                    borderRadius: 2,
                                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                }}
                            >
                                <MenuItem value="all">Alle Aufgaben</MenuItem>
                                <MenuItem value="unassigned">Kein Projekt</MenuItem>
                                <Divider />
                                {projects.map((project) => (
                                    <MenuItem key={project.id} value={project.id}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: project.color }} />
                                            {project.title}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300 }}>
                            Total: <Box component="span" sx={{ fontWeight: 500, color: 'text.primary' }}>{filteredTasks.length}</Box>
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300 }}>
                            Active: <Box component="span" sx={{ fontWeight: 500, color: 'primary.main' }}>{openTasks.length}</Box>
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300 }}>
                            Completed: <Box component="span" sx={{ fontWeight: 500, color: 'success.main' }}>{completedTasks.length}</Box>
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            <LayoutGroup>
                {/* Open Tasks */}
                <Box sx={{ mb: 6 }}>
                    {openTasks.length === 0 && (
                        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontStyle: 'italic' }}>
                            Keine offenen Aufgaben in dieser Ansicht.
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
                                    transition={spring}
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
                        <Paper
                            component={motion.div}
                            layout
                            transition={spring}
                            elevation={0}
                            sx={{
                                my: 4,
                                p: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.30)',
                                backdropFilter: 'blur(4px)',
                                borderRadius: 4
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h4" sx={{ fontWeight: 100, color: 'text.secondary' }}>
                                    Abgeschlossene Aufgaben
                                </Typography>
                            </Box>
                        </Paper>
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
                                        transition={spring}
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
