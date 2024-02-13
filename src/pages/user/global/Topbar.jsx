import React, { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { ColorModeContext, tokens } from "../../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PasswordIcon from "@mui/icons-material/Password";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logOutUser } from "../../../redux/apiRequest";
import { Button, MenuItem, Popover } from "@mui/material";
import jwt_decode from "jwt-decode";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import Logo from "../../../assets/logo.png"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DrawerComp from "./Drawer";
import AppBar from '@mui/material/AppBar';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import {
  useMediaQuery,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme, open }) => ({
//   transition: theme.transitions.create(["margin", "width"], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   ...(open && {
//     width: `calc(100% - ${drawerWidth}px)`,
//     marginLeft: `${drawerWidth}px`,
//     transition: theme.transitions.create(["margin", "width"], {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   }),
// }));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Topbar({ toggleSidebar }) {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [open, setOpen] = React.useState(false);
  const colors = tokens(theme.palette.mode);
  const colorMode = React.useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [selected, setSelected] = React.useState("Dashboard");
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  const user = useSelector((state) => state.auth.login?.currentUser);
  React.useEffect(() => {
    if (user) {
      const decode = jwt_decode(user.data.accessToken);
      console.log(decode?.firstName);
      setFirstName(decode?.firstName);
      setLastName(decode?.lastName);
    }
  }, []);

  useEffect(() => {
    const pathname = location.pathname;
    let tabIndex = 0;

    // Logic to map pathnames to tab indices
    if (pathname === "/") {
      tabIndex = 0;
    } else if (pathname === "/dashboard") {
      tabIndex = 1;
    } else if (pathname === "/todo") {
      tabIndex = 2;
    } else if (pathname === "/pomodoro") {
      tabIndex = 3;
    } else if (pathname === "/faq") {
      tabIndex = 4;
    }

    setValue(tabIndex);
  }, [location.pathname]);

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(firstName, lastName) {
    return {
      sx: {
        bgcolor: stringToColor(firstName),
      },
      children: `${firstName.split(" ")[0][0]}${lastName.split(" ")[0][0]}`,
    };
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const updateAccount = () => {
    navigate("/update-account");
  };

  const resetPassword = () => {
    navigate("/reset-password");
  };

  const opens = Boolean(anchorEl);
  const id = opens ? "simple-popover" : undefined;

  const handleLogOut = () => {
    logOutUser(dispatch, navigate);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar sx={{ background:"#29303b" }}>
        <Toolbar>
          <img src={Logo} alt="" srcset="" width="45px" height="45px" style={{transform: "scale(1)"}}/>
          {/* <AddBusinessRoundedIcon sx={{ transform: "scale(2)" }} /> */}
          {isMatch ? (
            <>
              <Typography sx={{ fontSize: "2rem", paddingLeft: "2%" }}>
                SSPS
              </Typography>
              <DrawerComp />
            </>
          ) : (
            <>
              <Tabs
                sx={{ marginLeft: "auto" }}
                indicatorColor="secondary"
                textColor="inherit"
                value={value}
                onChange={(e, value) => setValue(value)}
              >
                <Tab
                  component={Link}
                  to="/"
                  label={
                  <Tooltip title="Home" placement="bottom">
                    <HomeOutlinedIcon sx={{ transform: "scale(1.5)" }} />
                  </Tooltip>
                }
                />
                <Tab
                  component={Link}
                  to="/dashboard"
                  label={
                  <Tooltip title="Report" placement="bottom">
                    <InsertChartOutlinedIcon sx={{ transform: "scale(1.5)" }} />
                  </Tooltip>
                  }
                />
                <Tab
                  component={Link}
                  to="/todo"
                  label={
                  <Tooltip title="Todolist" placement="bottom" sx={{
                    "& .MuiTooltip-tooltip": {
                      fontSize: "1.5rem",
                    },
                  }}>
                    <FormatListBulletedIcon sx={{ transform: "scale(1.5)" }} />
                  </Tooltip>
                  }
                />
                <Tab
                  component={Link}
                  to="/pomodoro"
                  label={
                  <Tooltip title="Pomodoro " placement="bottom">
                    <AccessAlarmsIcon sx={{ transform: "scale(1.5)" }} />
                  </Tooltip>
                  }
                />
                <Tab
                  component={Link}
                  to="/faq"
                  label={
                  <Tooltip title="FAQ " placement="bottom">
                    <HelpOutlineOutlinedIcon sx={{ transform: "scale(1.5)" }} />
                  </Tooltip>
                  }
                />
              </Tabs>
              <Button sx={{ marginLeft: "auto" }} onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === "dark" ? (
                  <DarkModeOutlinedIcon  style={{ color: "white" }}/>
                ) : (
                  <LightModeOutlinedIcon style={{ color: "white" }}/>
                )}
              </Button>
              {user ? (
                <>
                  <>
                    <IconButton aria-describedby={id} variant="contained">
                      <Stack direction="row" spacing={2}>
                        <Avatar
                          onClick={handleClick}
                          style={{ width: "30px", height: "30px", color: "white", fontSize: "15px" }}
                          {...stringAvatar(firstName, lastName)}
                        />
                      </Stack>
                    </IconButton>

                    <Popover
                      id={id}
                      open={opens}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                      <List component="nav" aria-label="mailbox folders">
                        <ListItem button>
                          <Typography
                            variant="h5"
                            color={colors.grey[100]}
                            fontWeight="bold"
                            sx={{ m: "10px 0 0 0" }}
                          >
                            {firstName} {lastName}
                          </Typography>
                        </ListItem>
                        <Divider />
                        <ListItem button>
                          <PersonOutlinedIcon
                            style={{
                              marginRight: "5px",
                            }}
                          />
                          <ListItemText
                            onClick={updateAccount}
                            primary="Account"
                          />
                        </ListItem>
                        <Divider />
                        <ListItem button>
                          <PasswordIcon
                            style={{
                              marginRight: "5px",
                            }}
                          />
                          <ListItemText
                            onClick={resetPassword}
                            primary="Reset password"
                          />
                        </ListItem>
                        <Divider />
                        <ListItem button>
                          <LogoutIcon
                            style={{
                              marginRight: "5px",
                            }}
                          />
                          <ListItemText
                            onClick={handleLogOut}
                            primary="Log out"
                          />
                        </ListItem>
                      </List>
                    </Popover>
                  </>
                </>
              ) : (
                <>
                  <Button sx={{ marginLeft: "10px" }} variant="text">
                <Link
                  to={"login"}
                  style={{textDecoration:"none", color: "white"}}
                >
                  Log in
                </Link>
              </Button>
              <Button  sx={{ marginLeft: "10px" }} variant="contained" color="info">
                <Link
                  to={"register"}
                  style={{textDecoration:"none", color: "white"}}
                >
                  Register
                </Link>
              </Button>
                </>
              )}
              
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
