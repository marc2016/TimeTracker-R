import { Typography, Box, Paper } from "@mui/material";

export default function Dashboard() {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Typography variant="body1">
                    Welcome to TimeTracker-R
                </Typography>
            </Paper>
        </Box>
    );
}
