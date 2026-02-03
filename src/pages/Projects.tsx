import { Box, Typography, Grid, Fab } from "@mui/material";
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
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                Projects
            </Typography>

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
                color="primary"
                aria-label="add"
                sx={{ position: 'fixed', bottom: 32, right: 32 }}
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
