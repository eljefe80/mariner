import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ThemeProvider, useTheme, styled } from "@mui/material/styles";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from '@mui/material/useMediaQuery';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import FolderIcon from "@mui/icons-material/Folder";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import theme from "../theme";
import FileList from "./FileList";
import PrintStatus from "./PrintStatus";
const drawerWidth = 240;

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);


function Main(): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const isSmallScreen = theme.breakpoints.up('sm'); 
  const drawerVariant = isSmallScreen ? "temporary" : "permanent";
  const handleDrawerItemClick = () => {
    if (isSmallScreen) {
      setOpen(false);
    }
  };

  return (
    <div
      sx={{
        display: "flex",
      }}
    >
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <AppBar
          position="absolute"
          sx={{
            ...(true && {
              zIndex: theme.zIndex.drawer + 1,
              transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            }),
            ...(open && {
              marginLeft: 4,
              width: `calc(100% - ${drawerWidth}px)`,
              transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            }),
          }}
        >
          <Toolbar
            sx={{
              paddingRight: 24,
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              style={{
                marginRight: '36px',
              }}
              sx={{
                ...(open && {
                  display: "none",
                }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{
                flexGrow: 1,
              }}
            >
              mariner3d
            </Typography>
          </Toolbar>
        </AppBar>
        <SwipeableDrawer
          variant={drawerVariant}
          PaperProps={{
            sx: {
              width: drawerWidth,
            }
          }}
          sx={{
            ...(true && {
              position: "relative",
              whiteSpace: "nowrap",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
               }),
            }),
            ...(!open && {
              overflowX: "hidden",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              width: theme.spacing(7),
              [theme.breakpoints.up("sm")]: {
                width: theme.spacing(9),
              },
            }),
          }}
          open={open}
          onOpen={handleDrawerOpen}
          onClose={handleDrawerClose}
        >

          <Offset
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: "0 8px",
            }}
          >
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon button="true" />
            </IconButton>
          </Offset>
          <Divider />
          <List>
            <ListItem
              button="true"
              key="home"
              component={Link}
              to="/"
              onClick={handleDrawerItemClick}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem
              button="true"
              key="files"
              component={Link}
              to="/files"
              onClick={handleDrawerItemClick}
            >
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary="Files" />
            </ListItem>
          </List>
        </SwipeableDrawer>
        <main
          sx={{
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Offset />
          <Container
            maxWidth="sm"
            sx={{
              paddingTop: theme.spacing(2),
              paddingBottom: theme.spacing(2),
            }}
          >
            <Routes>
              <Route path="/" element={<PrintStatus />} />
              <Route path="/files" element={<FileList />} />
            </Routes>
          </Container>
        </main>
      </ThemeProvider>
    </div>
  );
}
export default Main
