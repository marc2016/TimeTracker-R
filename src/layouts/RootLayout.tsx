import { useState } from "react";
import {
    CssBaseline,
    Container,
    Box,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    IconButton,
    CSSObject,
    Theme,
    styled
} from "@mui/material";
import { useEffect } from "react";
import {
    AccessTime as AccessTimeIcon,
    BugReport,
    Settings as SettingsIcon,
    TaskAlt,
    PlayArrow,
    Pause
} from "@mui/icons-material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useSettingsStore } from "../store/useSettingsStore";
import { useTaskStore } from "../store/useTaskStore";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const MuiDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        ...(open && {
            ...openedMixin(theme),
            "& .MuiDrawer-paper": openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            "& .MuiDrawer-paper": closedMixin(theme),
        }),
    })
);

import TitleBar from "../components/TitleBar";

// ... existing imports

import { AnimatePresence, motion } from "framer-motion";

const ActiveTaskFooter = ({ open }: { open: boolean }) => {
    const { tasks, toggleTaskTimer, lastActiveTaskId } = useTaskStore();

    // Prioritize currently running task, otherwise fallback to lastActiveTaskId
    const runningTask = tasks.find(t => !!t.lastStartTime);
    const activeTask = runningTask || tasks.find(t => t.id === lastActiveTaskId);

    const [duration, setDuration] = useState(0);
    const isRunning = !!activeTask?.lastStartTime;

    // Update duration every second or initially
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!activeTask) return;

        const updateDuration = () => {
            const now = Date.now();
            const current = activeTask.lastStartTime
                ? activeTask.accumulatedDuration + (now - activeTask.lastStartTime)
                : activeTask.accumulatedDuration;
            setDuration(current);
        };

        updateDuration(); // Initial update

        if (activeTask.lastStartTime) {
            const interval = setInterval(updateDuration, 1000);
            return () => clearInterval(interval);
        }
    }, [activeTask?.id, activeTask?.lastStartTime, activeTask?.accumulatedDuration]);

    if (!activeTask) return null;

    const formatDuration = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <Box
            sx={{
                mt: 'auto',
                p: open ? 2 : 1,
                borderTop: '1px solid rgba(0,0,0,0.12)',
                backgroundColor: 'background.paper',
                display: 'flex',
                flexDirection: open ? 'row' : 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}
        >
            {open ? (
                <>
                    <Box sx={{ flexGrow: 1, minWidth: 0, mr: 1 }}>
                        <Typography variant="subtitle2" noWrap title={activeTask.title}>
                            {activeTask.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {formatDuration(duration)}
                        </Typography>
                    </Box>
                    <IconButton
                        color="primary"
                        onClick={() => toggleTaskTimer(activeTask.id)}
                        size="small"
                    >
                        {isRunning ? <Pause /> : <PlayArrow />}
                    </IconButton>
                </>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 0.5 }}>
                    <IconButton
                        color="primary"
                        onClick={() => toggleTaskTimer(activeTask.id)}
                        title={activeTask.title}
                        size="small"
                        sx={{
                            p: 0,
                            width: 30,
                            height: 30,
                            position: 'relative' // For absolute positioning of children if needed, or we use a Box wrapper
                        }}
                    >
                        {/* Layered Icons */}
                        <Box sx={{ position: 'relative', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {/* Base Clock Icon - slightly faded or behind */}
                            <AccessTimeIcon
                                sx={{
                                    fontSize: 24,
                                    opacity: 0.3,
                                    position: 'absolute'
                                }}
                            />
                            {/* Overlay Action Icon */}
                            {isRunning ? (
                                <Pause
                                    sx={{
                                        fontSize: 16,
                                        zIndex: 1,
                                        color: 'primary.main'
                                    }}
                                />
                            ) : (
                                <PlayArrow
                                    sx={{
                                        fontSize: 16,
                                        zIndex: 1,
                                        color: 'primary.main'
                                    }}
                                />
                            )}
                        </Box>
                    </IconButton>
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize: '0.65rem',
                            lineHeight: 1,
                            mt: 0.5,
                            fontWeight: 'bold',
                            color: 'primary.main',
                            textAlign: 'center',
                            width: '100%',
                            display: 'block'
                        }}
                    >
                        {formatDuration(duration)}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default function RootLayout() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { appBackground } = useSettingsStore();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const menuItems = [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
        { text: "Tasks", icon: <TaskAlt />, path: "/tasks" },
        { text: "Test", icon: <BugReport />, path: "/test" },
        { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
    ];

    return (
        <Box sx={{ display: "flex", mt: "30px" }}> {/* Margin top for TitleBar */}
            <CssBaseline />

            {/* Animated Background Layer */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0, // Changed from -1 to 0 to be visible above body bg
                    bgcolor: '#f6f6f6', // Fallback color
                }}
            >
                <AnimatePresence mode="popLayout">
                    {appBackground && (
                        <motion.div
                            key={appBackground}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: `url(${appBackground})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />
                    )}
                </AnimatePresence>
            </Box>

            <TitleBar />
            <MuiDrawer variant="permanent" open={open} PaperProps={{ sx: { top: "30px", height: "calc(100% - 30px)" } }}>
                <DrawerHeader sx={{ justifyContent: open ? 'flex-start' : 'center', px: open ? 2 : 1 }}>
                    <IconButton onClick={open ? handleDrawerClose : handleDrawerOpen} sx={{ p: 1 }}>
                        <AccessTimeIcon color="primary" />
                    </IconButton>
                    {open && (
                        <Typography variant="h6" noWrap component="div" sx={{ ml: 1, fontWeight: 'bold' }}>
                            TimeTracker-R
                        </Typography>
                    )}
                </DrawerHeader>
                <Divider />
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
                            <ListItemButton
                                selected={location.pathname === item.path}
                                onClick={() => navigate(item.path)}
                                sx={[
                                    {
                                        minHeight: 48,
                                        px: 2.5,
                                    },
                                    open
                                        ? {
                                            justifyContent: "initial",
                                        }
                                        : {
                                            justifyContent: "center",
                                        },
                                ]}
                            >
                                <ListItemIcon
                                    sx={[
                                        {
                                            minWidth: 0,
                                            justifyContent: "center",
                                        },
                                        open
                                            ? {
                                                mr: 3,
                                            }
                                            : {
                                                mr: "auto",
                                            },
                                    ]}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    sx={[
                                        open
                                            ? {
                                                opacity: 1,
                                            }
                                            : {
                                                opacity: 0,
                                            },
                                    ]}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <ActiveTaskFooter open={open} />
            </MuiDrawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    height: 'calc(100vh - 30px)',
                    overflowY: 'auto',
                    position: 'relative', // Ensure stacking context
                    zIndex: 1, // Sit above background
                    // Background moved to separate layer
                }}
            >
                <DrawerHeader />
                <Container maxWidth="xl">
                    <Outlet />
                </Container>
            </Box>
        </Box>
    );
}
