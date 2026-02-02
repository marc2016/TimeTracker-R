import { useState } from "react";
import {
    Typography,
    Box,
    TextField,
    Button,
    Grid,
    Paper,
    Divider
} from "@mui/material";
import { useTaskStore } from "../store/useTaskStore";
import TaskCard from "../components/TaskCard";

export default function Tasks() {
    const { tasks, addTask, toggleTask, deleteTask } = useTaskStore();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            addTask(title, description);
            setTitle("");
            setDescription("");
        }
    };

    const openTasks = tasks.filter(task => !task.completed).sort((a, b) => b.createdAt - a.createdAt);
    const completedTasks = tasks.filter(task => task.completed).sort((a, b) => b.updatedAt - a.updatedAt);

    return (
        <Box sx={{ pb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                Aufgaben
            </Typography>

            {/* Input Section - Kept in a small paper for readability of inputs */}
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    mb: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 2
                }}
                component="form"
                onSubmit={handleAddTask}
            >
                <Grid container spacing={2} alignItems="flex-start">
                    <Grid size={{ xs: 12, sm: 5 }}>
                        <TextField
                            fullWidth
                            label="Name der Aufgabe"
                            variant="outlined"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            size="small"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 5 }}>
                        <TextField
                            fullWidth
                            label="Beschreibung"
                            variant="outlined"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            size="small"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 2 }}>
                        <Button type="submit" variant="contained" fullWidth disabled={!title.trim()} sx={{ height: 40 }}>
                            Add
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Open Tasks */}
            <Box sx={{ mb: 6 }}>
                <Typography variant="h5" sx={{ mb: 2, color: 'white', textShadow: '0 1px 3px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: 1 }}>
                    Offene Aufgaben ({openTasks.length})
                </Typography>
                {openTasks.length === 0 && (
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>
                        Keine offenen Aufgaben.
                    </Typography>
                )}
                <Grid container spacing={2}>
                    {openTasks.map((task) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={task.id}>
                            <TaskCard
                                task={task}
                                onToggle={toggleTask}
                                onDelete={deleteTask}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
                <Box>
                    <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.3)', borderBottomWidth: 2 }} />
                    <Typography variant="h5" sx={{ mb: 2, color: 'white', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                        Erledigt ({completedTasks.length})
                    </Typography>
                    <Grid container spacing={2}>
                        {completedTasks.map((task) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={task.id}>
                                <TaskCard
                                    task={task}
                                    onToggle={toggleTask}
                                    onDelete={deleteTask}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Box>
    );
}
