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
    Adjust,
    PlayArrow,
    Pause
} from "@mui/icons-material";
import { Task } from "../store/useTaskStore";

interface TaskCardProps {
    task: Task;
    onToggle: (id: string) => void;
    onToggleTimer: (id: string) => void;
    onDelete: (id: string) => void;
    onClick?: (task: Task) => void;
}

export default function TaskCard({ task, onToggle, onToggleTimer, onDelete, onClick }: TaskCardProps) {
    const isRunning = !!task.lastStartTime;

    // Helper to format duration in HH:MM:ss
    const formatDuration = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Live duration calculation
    const currentDuration = isRunning
        ? task.accumulatedDuration + (Date.now() - (task.lastStartTime || Date.now()))
        : task.accumulatedDuration;

    // Force re-render every second if running (hacky but simple for now, ideally use a separate Timer component)
    // Actually, let's use a separate component for the timer text to avoid re-rendering the whole card? 
    // Or just use a text that updates itself.

    // Let's implement a simple TimerDisplay component inline or simply hook for now.
    // If I put `useNow` hook here it will re-render the card.


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

    return (
        <Card
            variant="outlined"
            sx={{
                width: '100%',
                // maxWidth: 300, // Let Grid handle width
                minHeight: 200,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                bgcolor: '#F5F5F5', // bg-grey-lighten-4 (approx)
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
                    opacity: 1 // Controlling opacity or color directly
                }}
            >
                {task.completed ? (
                    <CheckCircleOutline sx={{ fontSize: 200, color: '#C8E6C9' }} /> // text-green-lighten-4 (approx)
                ) : (
                    <Adjust sx={{ fontSize: 200, color: '#FFE0B2' }} /> // text-orange-lighten-4 (approx)
                )}
            </Box>

            <CardActionArea
                onClick={() => onClick && onClick(task)}
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    p: 2,
                    zIndex: 1,
                    height: '100%' // Ensure it takes available space
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
                    {task.title}
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
                    {task.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto', pt: 1, width: '100%', zIndex: 1 }}>
                    <Update sx={{ fontSize: 16, mr: 0.5, color: 'text.disabled' }} />
                    <Typography variant="caption" color="text.disabled">
                        {formatDuration(currentDuration)} • {formatDate(task.updatedAt)}
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
                        onToggle(task.id);
                    }}
                    sx={{ color: 'rgba(0, 0, 0, 0.6)' }} // medium-emphasis
                >
                    {task.completed ? <Adjust /> : <CheckCircleOutline />}
                </IconButton>

                {/* Timer Toggle */}
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleTimer(task.id);
                    }}
                    sx={{ color: isRunning ? 'primary.main' : 'rgba(0, 0, 0, 0.6)' }}
                >
                    {isRunning ? <Pause /> : <PlayArrow />}
                </IconButton>

                {/* Delete Button */}
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(task.id);
                    }}
                    sx={{ color: 'rgba(0, 0, 0, 0.6)' }} // medium-emphasis
                >
                    <Delete />
                </IconButton>
            </CardActions>
        </Card>
    );
}
