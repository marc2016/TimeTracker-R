import { useState } from "react";
import {
    Typography,
    Box,
    TextField,
    Button,
    Grid,
    Divider,
    Fab,
    Drawer,
    Chip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useTaskStore, Task } from "../store/useTaskStore";
import TaskCard from "../components/TaskCard";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

export default function Tasks() {
    const { tasks, addTask, updateTask, toggleTask, deleteTask } = useTaskStore();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleOpenDrawer = (task?: Task) => {
        if (task) {
            setEditingTask(task);
            setTitle(task.title);
            setDescription(task.description);
        } else {
            setEditingTask(null);
            setTitle("");
            setDescription("");
        }
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = (_event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        if (reason === "backdropClick") {
            return;
        }
        setIsDrawerOpen(false);
    };

    const handleCancel = () => {
        setIsDrawerOpen(false);
    };

    const handleSave = () => {
        if (!title.trim()) return;

        if (editingTask) {
            updateTask(editingTask.id, title, description);
        } else {
            addTask(title, description);
        }
        setIsDrawerOpen(false);
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
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={handleCloseDrawer}
                PaperProps={{
                    sx: { width: { xs: '100%', sm: 400 }, p: 3, pt: 5 }
                }}
            >
                <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
                    {editingTask ? 'Aufgabe bearbeiten' : 'Neue Aufgabe'}
                </Typography>

                <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        fullWidth
                        label="Titel"
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Beschreibung"
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={4}
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 'auto', pt: 4 }}>
                    <Button variant="outlined" onClick={handleCancel} color="inherit">
                        Abbrechen
                    </Button>
                    <Button variant="contained" onClick={handleSave} disabled={!title.trim()}>
                        Speichern
                    </Button>
                </Box>
            </Drawer>
        </Box>
    );
}
