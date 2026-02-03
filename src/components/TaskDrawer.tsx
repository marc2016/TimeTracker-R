import {
    Drawer,
    Typography,
    Box,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import { useEffect, useState } from "react";
import { Task } from "../store/useTaskStore";
import { useProjectStore } from "../store/useProjectStore";

interface TaskDrawerProps {
    open: boolean;
    onClose: () => void;
    task: Task | null;
    onSave: (title: string, description: string, completed: boolean, projectId: string | null, duration?: number) => void;
}

export default function TaskDrawer({ open, onClose, task, onSave }: TaskDrawerProps) {
    const { projects } = useProjectStore();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [completed, setCompleted] = useState(false);
    const [projectId, setProjectId] = useState<string>(""); // Select expects string (empty for none)
    const [duration, setDuration] = useState("00:00:00");

    useEffect(() => {
        if (open) {
            if (task) {
                setTitle(task.title);
                setDescription(task.description);
                setCompleted(task.completed);
                setProjectId(task.projectId || "");

                // Format duration
                const seconds = Math.floor(task.accumulatedDuration / 1000);
                const h = Math.floor(seconds / 3600);
                const m = Math.floor((seconds % 3600) / 60);
                const s = seconds % 60;
                setDuration(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
            } else {
                setTitle("");
                setDescription("");
                setCompleted(false);
                setProjectId("");
                setDuration("00:00:00");
            }
        }
    }, [open, task]);

    const handleSave = () => {
        if (!title.trim()) return;

        // Parse duration
        let durationMs = 0;
        const parts = duration.split(':').map(p => parseInt(p, 10));
        if (parts.length === 3) {
            durationMs = (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
        } else if (parts.length === 2) {
            durationMs = (parts[0] * 3600 + parts[1] * 60) * 1000;
        }

        onSave(title, description, completed, projectId || null, durationMs);
        onClose();
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: { xs: '100%', sm: 400 }, p: 3, pt: 5 }
            }}
        >
            <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
                {task ? 'Aufgabe bearbeiten' : 'Neue Aufgabe'}
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

                <FormControl fullWidth>
                    <InputLabel>Projekt</InputLabel>
                    <Select
                        value={projectId}
                        label="Projekt"
                        onChange={(e) => setProjectId(e.target.value)}
                    >
                        <MenuItem value="">
                            <em>Kein Projekt</em>
                        </MenuItem>
                        {projects.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                                {p.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    label="Beschreibung"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={4}
                />

                {task && (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={completed}
                                onChange={(e) => setCompleted(e.target.checked)}
                            />
                        }
                        label={completed ? "Abgeschlossen" : "Offen"}
                    />
                )}

                <TextField
                    fullWidth
                    label="Dauer (HH:MM:SS)"
                    variant="outlined"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="00:00:00"
                />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 'auto', pt: 4 }}>
                <Button variant="outlined" onClick={onClose} color="inherit">
                    Abbrechen
                </Button>
                <Button variant="contained" onClick={handleSave} disabled={!title.trim()}>
                    Speichern
                </Button>
            </Box>
        </Drawer>
    );
}
