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
    RadioButtonUnchecked,
    Delete,
    Update,
    Adjust
} from "@mui/icons-material";
import { Task } from "../store/useTaskStore";

interface TaskCardProps {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onClick?: (task: Task) => void;
}

export default function TaskCard({ task, onToggle, onDelete, onClick }: TaskCardProps) {

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
                width: 300,
                height: 200,
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
            onClick={() => onClick && onClick(task)}
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
                        {formatDate(task.updatedAt)}
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
