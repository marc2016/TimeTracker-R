import { useState } from "react";
import {
    Typography,
    Box,
    Paper,
    TextField,
    Button,
    Grid,
    Card,
    Checkbox,
    IconButton
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useTaskStore } from "../store/useTaskStore";

export default function Tasks() {
    const { tasks, addTask, toggleTask, deleteTask } = useTaskStore();
    const [newTaskText, setNewTaskText] = useState("");

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskText.trim()) {
            addTask(newTaskText);
            setNewTaskText("");
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

                <Box component="form" onSubmit={handleAddTask} sx={{ display: 'flex', gap: 2, mb: 4 }}>
                    <TextField
                        fullWidth
                        label="Neue Aufgabe"
                        variant="outlined"
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        size="small"
                        sx={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
                    />
                    <Button type="submit" variant="contained" disabled={!newTaskText.trim()}>
                        Add
                    </Button>
                </Box>

                <Box sx={{ mt: 4 }}>
                    {tasks.length === 0 && (
                        <Typography variant="body1" color="text.secondary" align="center">
                            No tasks yet. Add one above!
                        </Typography>
                    )}
                    <Grid container spacing={2}>
                        {tasks.map((task) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={task.id}>
                                <Card
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.6)',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Box sx={{ p: 2, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                        <Checkbox
                                            checked={task.completed}
                                            onChange={() => toggleTask(task.id)}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                textDecoration: task.completed ? 'line-through' : 'none',
                                                color: task.completed ? 'text.secondary' : 'text.primary',
                                                mt: 1,
                                                wordBreak: 'break-word'
                                            }}
                                        >
                                            {task.text}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                                        <IconButton aria-label="delete" onClick={() => deleteTask(task.id)} size="small">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
}
