import {
    Card,
    CardActions,
    Typography,
    IconButton,
    Box,
    Divider,
    CardActionArea
} from "@mui/material";
import {
    CheckCircleOutline,
    Delete,
    Update,
    Folder,
    TaskAlt,
    AccessTime
} from "@mui/icons-material";
import { Project } from "../store/useProjectStore";
import { useTaskStore } from "../store/useTaskStore";

interface ProjectCardProps {
    project: Project;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onClick?: (project: Project) => void;
}

export default function ProjectCard({ project, onToggle, onDelete, onClick }: ProjectCardProps) {

    const { tasks } = useTaskStore();
    const projectTasks = tasks.filter(task => task.projectId === project.id);

    // Format dates to YYYY-MM-DD HH:mm:ss
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const formatDuration = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <Card
            variant="outlined"
            sx={{
                width: '100%',
                minHeight: 200,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                bgcolor: '#F5F5F5',
                transition: '0.3s',
                '&:hover': {
                    boxShadow: 6,
                    cursor: 'pointer'
                }
            }}
        >
            {/* Background Icon */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '85%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 0,
                    pointerEvents: 'none',
                }}
            >
                {project.completed ? (
                    <CheckCircleOutline sx={{ fontSize: 200, color: '#C8E6C9' }} />
                ) : (
                    // Use project color/opacity for the folder icon
                    <Folder sx={{ fontSize: 200, color: project.color ? project.color : '#FFE0B2', opacity: 0.2 }} />
                )}
            </Box>

            <CardActionArea
                onClick={() => onClick && onClick(project)}
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    p: 2,
                    zIndex: 1,
                    height: '100%'
                }}
            >
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        width: '100%',
                        fontWeight: 500,
                        lineHeight: 1.2,
                        mb: 1,
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        zIndex: 1
                    }}
                >
                    {project.title}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        width: '100%',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        flexGrow: 1,
                        zIndex: 1
                    }}
                >
                    {project.description || "No description"}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto', pt: 1, width: '100%', zIndex: 1 }}>
                    <TaskAlt sx={{ fontSize: 16, mr: 0.5, color: 'text.disabled' }} />
                    <Typography variant="caption" color="text.disabled">
                        {projectTasks.length}
                    </Typography>
                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                    <AccessTime sx={{ fontSize: 16, mr: 0.5, color: 'text.disabled' }} />
                    <Typography variant="caption" color="text.disabled">
                        {formatDuration(projectTasks.reduce((total, task) => total + task.accumulatedDuration, 0))}
                    </Typography>
                </Box>
            </CardActionArea>

            <Divider />

            <CardActions sx={{ bgcolor: 'white', justifyContent: 'flex-end', zIndex: 2, p: 1 }} onClick={(e) => e.stopPropagation()}>
                {/* Toggle Button */}
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle(project.id);
                    }}
                    sx={{ color: 'rgba(0, 0, 0, 0.6)' }}
                >
                    {project.completed ? <Folder /> : <CheckCircleOutline />}
                </IconButton>

                {/* Delete Button */}
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(project.id);
                    }}
                    sx={{ color: 'rgba(0, 0, 0, 0.6)' }}
                >
                    <Delete />
                </IconButton>
            </CardActions>
        </Card>
    );
}
