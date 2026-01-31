import { useState } from "react";
import "./App.css";
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
  MoveToInbox as InboxIcon,
  Mail as MailIcon,
  AccessTime as AccessTimeIcon
} from "@mui/icons-material";

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
  justifyContent: "center", // Centered by default for closed state
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

function App() {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
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
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={text}
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
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Container maxWidth="md">
          {/* Main content will go here */}
        </Container>
      </Box>
    </Box>
  );
}

export default App;
