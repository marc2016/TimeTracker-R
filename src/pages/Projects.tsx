import { Box, Typography, Grid, Fab, Paper } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { useProjectStore, Project } from "../store/useProjectStore";
import ProjectCard from "../components/ProjectCard";
import ProjectDrawer from "../components/ProjectDrawer";

export default function Projects() {
    const { projects, init, deleteProject, toggleProjectCompletion } = useProjectStore();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useEffect(() => {
        init();
    }, [init]);

    const handleAddClick = () => {
        setSelectedProject(null);
        setDrawerOpen(true);
    };

    const handleCardClick = (project: Project) => {
        setSelectedProject(project);
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setSelectedProject(null);
    };

    return (
        <Box>
            <Paper
                elevation={0}
                sx={{
                    mb: 4,
                    p: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.30)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: 4
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 100, color: 'text.secondary' }}>
                        Projects
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300 }}>
                            Total: <Box component="span" sx={{ fontWeight: 500, color: 'text.primary' }}>{projects.length}</Box>
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300 }}>
                            Active: <Box component="span" sx={{ fontWeight: 500, color: 'primary.main' }}>{projects.filter(p => !p.completed).length}</Box>
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300 }}>
                            Completed: <Box component="span" sx={{ fontWeight: 500, color: 'success.main' }}>{projects.filter(p => p.completed).length}</Box>
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            <Grid container spacing={3}>
                {projects.map((project) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={project.id}>
                        <ProjectCard
                            project={project}
                            onClick={handleCardClick}
                            onDelete={deleteProject}
                            onToggle={toggleProjectCompletion}
                        />
                    </Grid>
                ))}
            </Grid>

            <Fab
                aria-label="add"
                sx={{
                    position: 'fixed', bottom: 32, right: 32, bgcolor: 'white',
                    color: 'black',
                    '&:hover': {
                        bgcolor: '#f5f5f5' // slightly grey on hover
                    }
                }}
                onClick={handleAddClick}
            >
                <AddIcon />
            </Fab>

            <ProjectDrawer
                open={drawerOpen}
                onClose={handleDrawerClose}
                project={selectedProject}
            />
        </Box>
    );
}
