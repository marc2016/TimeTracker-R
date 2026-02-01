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
import {
    AccessTime as AccessTimeIcon,
    Settings as SettingsIcon
} from "@mui/icons-material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useSettingsStore } from "../store/useSettingsStore";

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
        { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
    ];

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <MuiDrawer variant="permanent" open={open}>
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
            </MuiDrawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    minHeight: '100vh',
                    backgroundImage: appBackground ? `url(${appBackground})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                <DrawerHeader />
                <Container maxWidth="md">
                    {/* Add a subtle paper background or transparency if background image is active, 
                so text remains readable. For now just rendering outlet. */}
                    <Outlet />
                </Container>
            </Box>
        </Box>
    );
}
