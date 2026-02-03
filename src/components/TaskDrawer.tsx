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
    onSave: (title: string, description: string, completed: boolean, projectId: string | null) => void;
}

export default function TaskDrawer({ open, onClose, task, onSave }: TaskDrawerProps) {
    const { projects } = useProjectStore();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [completed, setCompleted] = useState(false);
    const [projectId, setProjectId] = useState<string>(""); // Select expects string (empty for none)

    useEffect(() => {
        if (open) {
            if (task) {
                setTitle(task.title);
                setDescription(task.description);
                setCompleted(task.completed);
                setProjectId(task.projectId || "");
            } else {
                setTitle("");
                setDescription("");
                setCompleted(false);
                setProjectId("");
            }
        }
    }, [open, task]);

    const handleSave = () => {
        if (!title.trim()) return;
        onSave(title, description, completed, projectId || null);
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
