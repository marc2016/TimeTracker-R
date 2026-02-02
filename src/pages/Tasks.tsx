import { useState } from "react";
import {
    Typography,
    Box,
    Paper,
    TextField,
    Button,
    Grid
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

    return (
        <Box>
            {/* Translucent Paper for readability */}
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.75)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 2
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Aufgaben
                </Typography>

                <Box component="form" onSubmit={handleAddTask} sx={{ mb: 4 }}>
                    <Grid container spacing={2} alignItems="flex-start">
                        <Grid size={{ xs: 12, sm: 5 }}>
                            <TextField
                                fullWidth
                                label="Name der Aufgabe"
                                variant="outlined"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                size="small"
                                sx={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
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
                                sx={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 2 }}>
                            <Button type="submit" variant="contained" fullWidth disabled={!title.trim()} sx={{ height: 40 }}>
                                Add
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ mt: 4 }}>
                    {tasks.length === 0 && (
                        <Typography variant="body1" color="text.secondary" align="center">
                            Noch keine Aufgaben. Füge oben eine hinzu!
                        </Typography>
                    )}
                    <Grid container spacing={2}>
                        {tasks.map((task) => (
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
            </Paper>
        </Box>
    );
}
