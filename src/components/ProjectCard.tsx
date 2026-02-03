import { Card, CardActionArea, CardContent, Typography, Box, Chip } from "@mui/material";
import { Project } from "../store/useProjectStore";

interface ProjectCardProps {
    project: Project;
    onClick: (project: Project) => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderLeft: `6px solid ${project.color}`,
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                }
            }}
        >
            <CardActionArea onClick={() => onClick(project)} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                <CardContent sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="h6" component="div" gutterBottom noWrap>
                            {project.title}
                        </Typography>
                        {project.completed && (
                            <Chip label="Done" color="success" size="small" variant="outlined" />
                        )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mb: 2
                    }}>
                        {project.description || "No description"}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
