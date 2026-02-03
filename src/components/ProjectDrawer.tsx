import {
    Drawer,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Checkbox
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Project, useProjectStore } from "../store/useProjectStore";
import { useTaskStore } from "../store/useTaskStore";

const COLORS = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'];

interface ProjectDrawerProps {
    open: boolean;
    onClose: () => void;
    project?: Project | null; // If null, creating new
}

export default function ProjectDrawer({ open, onClose, project }: ProjectDrawerProps) {
    const { addProject, updateProject, deleteProject } = useProjectStore();
    const { tasks } = useTaskStore();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState(COLORS[5]);

    useEffect(() => {
        if (project) {
            setTitle(project.title);
            setDescription(project.description);
            setColor(project.color);
        } else {
            setTitle("");
            setDescription("");
            setColor(COLORS[5]); // Default blue
        }
    }, [project, open]);

    const handleSave = async () => {
        if (!title.trim()) return;

        if (project) {
            await updateProject(project.id, { title, description, color });
        } else {
            await addProject(title, description, color);
        }
        onClose();
    };

    const handleDelete = async () => {
        if (project && confirm("Are you sure you want to delete this project?")) {
            await deleteProject(project.id);
            onClose();
        }
    };

    const projectTasks = project ? tasks.filter(t => t.projectId === project.id) : [];
    const completedCount = projectTasks.filter(t => t.completed).length;
    const totalCount = projectTasks.length;

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { width: 400, p: 3 } }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                    {project ? "Edit Project" : "New Project"}
                </Typography>
                <IconButton onClick={onClose}>
                    <Close />
                </IconButton>
            </Box>

            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Project Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    required
                />

                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    minRows={3}
                />

                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Color</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {COLORS.map((c) => (
                            <Box
                                key={c}
                                onClick={() => setColor(c)}
                                sx={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    bgcolor: c,
                                    cursor: 'pointer',
                                    border: color === c ? '2px solid black' : '1px solid transparent',
                                    transition: 'transform 0.1s',
                                    '&:hover': { transform: 'scale(1.1)' }
                                }}
                            />
                        ))}
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                    {project && (
                        <Button color="error" onClick={handleDelete}>
                            Delete
                        </Button>
                    )}
                    <Button variant="contained" onClick={handleSave} disabled={!title.trim()}>
                        Save
                    </Button>
                </Box>
            </Box>

            {project && (
                <>
                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" gutterBottom>Statistics</Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ flex: 1, bgcolor: 'primary.light', p: 1, borderRadius: 1, color: 'white', textAlign: 'center' }}>
                                <Typography variant="h4">{totalCount}</Typography>
                                <Typography variant="caption">Total Tasks</Typography>
                            </Box>
                            <Box sx={{ flex: 1, bgcolor: 'success.light', p: 1, borderRadius: 1, color: 'white', textAlign: 'center' }}>
                                <Typography variant="h4">{completedCount}</Typography>
                                <Typography variant="caption">Completed</Typography>
                            </Box>
                            <Box sx={{ flex: 1, bgcolor: 'warning.light', p: 1, borderRadius: 1, color: 'white', textAlign: 'center' }}>
                                <Typography variant="h4">{totalCount - completedCount}</Typography>
                                <Typography variant="caption">Open</Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" gutterBottom>Tasks</Typography>
                    <List dense>
                        {projectTasks.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">No tasks assigned.</Typography>
                        ) : (
                            projectTasks.map(task => (
                                <ListItem key={task.id} disablePadding>
                                    <ListItemIcon sx={{ minWidth: 30 }}>
                                        <Checkbox
                                            edge="start"
                                            checked={task.completed}
                                            disabled
                                            size="small"
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={task.title}
                                        secondary={task.completed ? "Completed" : "Open"}
                                        sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                                    />
                                </ListItem>
                            ))
                        )}
                    </List>
                </>
            )}
        </Drawer>
    );
}
