import React, { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { ColorModeContext, tokens } from "../../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PasswordIcon from "@mui/icons-material/Password";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logOutUser } from "../../../redux/apiRequest";
import { Badge, Button, MenuItem, Popover } from "@mui/material";
import jwt_decode from "jwt-decode";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AddCardIcon from '@mui/icons-material/AddCard';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import DrawerComp from "./Drawer";
import AppBar from "@mui/material/AppBar";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import { useMediaQuery } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import DateRangeIcon from "@mui/icons-material/DateRange";
import NotificationsOutlined from "@mui/icons-material/NotificationsOutlined";

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

export default function Topbar({
  toggleSidebar,
  notification,
  listNotification,
  setNotificationCount,
  setNotifications,
}) {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [open, setOpen] = React.useState(false);
  const colors = tokens(theme.palette.mode);
  const colorMode = React.useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl1, setAnchorEl1] = React.useState(null);
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
    console.log("check noti", notification);
    console.log(colors);
  }, []);

  useEffect(() => {
    const pathname = location.pathname;
    let tabIndex = 0;

    // Logic to map pathnames to tab indices
    if (pathname === "/") {
      tabIndex = 0;
    } else if (pathname === "/calendar-money-plan") {
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

  const handleClickNoti = (event) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorEl1(null);
  };

  const updateAccount = () => {
    navigate("/update-account");
  };

  const resetPassword = () => {
    navigate("/reset-password");
  };

  const donate = () => {
    navigate("https://www.paypal.com/vn/home?locale.x=vi_VN");
  };

  const opens = Boolean(anchorEl);
  const opensNoti = Boolean(anchorEl1);
  const id = opens ? "simple-popover" : undefined;
  const idNoti = opensNoti ? "simple-popover-1" : undefined;

  const handleLogOut = () => {
    logOutUser(dispatch, navigate);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNotificationClick = (index) => {
    const newList = [...listNotification];
    if (!newList[index].viewed) {
      newList[index].viewed = true; // Mark notification as viewed
      setNotificationCount((prevCount) => prevCount - 1);
    }
    console.log("test", newList[index]);

    setNotifications(newList);
    const notification = newList[index];
    navigate(
      `/calendar-money-plan?title=${newList[index].title}&date=${newList[index].date}`,
      { state: { notification } }
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
    setNotificationCount(0);
    localStorage.removeItem("notifications");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar sx={{ background: colors.boxDashboard[100], height: "55px" }}>
        <Toolbar>
          {/* <img src={Logo} alt="" srcset="" width="35px" height="35px" style={{transform: "scale(1)"}}/> */}
          <Typography
            sx={{
              fontSize: "2rem",
              color: "black",
              fontWeight: "550",
              background: "linear-gradient(90deg, #00ffff, #ff00c3)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            SSPS
          </Typography>
          {/* <AddBusinessRoundedIcon sx={{ transform: "scale(2)" }} /> */}
          {isMatch ? (
            <>
              {/* <Typography
                sx={{
                  fontSize: "2rem",
                  paddingLeft: "2%",
                  background: "linear-gradient(90deg, #00ffff, #ff00c3)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                SSPS
              </Typography> */}
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
                TabIndicatorProps={{ style: { height: "4px" } }}
              >
                <Tab
                  component={Link}
                  to="/"
                  label={
                    <Tooltip title="Home" placement="bottom">
                      <HomeOutlinedIcon
                        sx={{
                          transform: "scale(1.5)",
                          color: colors.iconTopbar[100],
                        }}
                      />
                    </Tooltip>
                  }
                />
                <Tab
                  component={Link}
                  to="/calendar-money-plan"
                  label={
                    <Tooltip title="Expense management" placement="bottom">
                      <DateRangeIcon
                        sx={{
                          transform: "scale(1.5)",
                          color: colors.iconTopbar[100],
                        }}
                      />
                    </Tooltip>
                  }
                />
                <Tab
                  component={Link}
                  to="/todo"
                  label={
                    <Tooltip
                      title="Todolist"
                      placement="bottom"
                      sx={{
                        "& .MuiTooltip-tooltip": {
                          fontSize: "1.5rem",
                        },
                      }}
                    >
                      <FormatListBulletedIcon
                        sx={{
                          transform: "scale(1.5)",
                          color: colors.iconTopbar[100],
                        }}
                      />
                    </Tooltip>
                  }
                />
                <Tab
                  component={Link}
                  to="/pomodoro"
                  label={
                    <Tooltip title="Pomodoro " placement="bottom">
                      <AccessAlarmsIcon
                        sx={{
                          transform: "scale(1.5)",
                          color: colors.iconTopbar[100],
                        }}
                      />
                    </Tooltip>
                  }
                />
                {/* <Tab
                  component={Link}
                  to="/faq"
                  label={
                    <Tooltip title="FAQ " placement="bottom">
                      <HelpOutlineOutlinedIcon
                        sx={{
                          transform: "scale(1.5)",
                          color: colors.iconTopbar[100],
                        }}
                      />
                    </Tooltip>
                  }
                /> */}
              </Tabs>
              <IconButton
                sx={{ marginLeft: "auto" }}
                onClick={colorMode.toggleColorMode}
              >
                {theme.palette.mode === "dark" ? (
                  <DarkModeOutlinedIcon
                    style={{ color: colors.iconTopbar[100] }}
                  />
                ) : (
                  <LightModeOutlinedIcon
                    style={{ color: colors.iconTopbar[100] }}
                  />
                )}
              </IconButton>
              <IconButton aria-describedby={idNoti} onClick={handleClickNoti}>
                <Badge color="secondary" badgeContent={notification} max={99}>
                  <NotificationsOutlined
                    style={{ color: colors.iconTopbar[100] }}
                  />
                </Badge>
              </IconButton>
              <Popover
                id={idNoti}
                open={opensNoti}
                anchorEl={anchorEl1}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                PaperProps={{
                  style: {
                    padding:"5px",
                    maxHeight: "400px",
                    overflowY: "auto",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ p: 2, textAlign: "center", fontWeight: "bold" }}
                >
                  Notifications ({notification})
                </Typography>
                <Divider />
                <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
                  <List sx={{ minWidth: "300px" }}>
                    {listNotification.length === 0 ? (
                      <ListItem>
                        <ListItemText primary="No notifications" />
                      </ListItem>
                    ) : (
                      listNotification.map((notification, index) => (
                        <>
                        <ListItemButton
                          key={index}
                          onClick={() => handleNotificationClick(index)}
                          sx={{
                            background: notification.viewed
                              ? theme.palette.theme === "dark" ? colors.grey[900] : "#dffff"
                              : "lightgrey"
                          }}
                        >
                          {/* Ensure notification is an object with title and body */}
                          <ListItemText
                            primary={`${notification.title} `}
                            secondary={`${notification.body} :  ${notification.date}`}
                          />
                        </ListItemButton>
                        <Divider/>

                        </>
                      ))
                    )}
                  </List>
                </Box>
                <Divider />
                <Box textAlign="center">
                  <Button
                    onClick={handleClearAll}
                    disabled={listNotification.length === 0}
                  >
                    Clear all
                  </Button>
                </Box>
              </Popover>
              {user ? (
                <>
                  <>
                    <IconButton
                      aria-describedby={id}
                      variant="contained"
                      onClick={handleClick}
                    >
                      <Stack direction="row" spacing={2}>
                        <Avatar
                          style={{
                            width: "30px",
                            height: "30px",
                            color: "white",
                            fontSize: "15px",
                          }}
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
                        {/* <Divider />
                        <ListItem button>
                          <AddCardIcon
                            style={{
                              marginRight: "5px",
                            }}
                          />
                          <ListItemText
                            onClick={donate}
                            primary="Donate"
                          />
                        </ListItem> */}
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
                  <Button
                    sx={{ marginLeft: "10px" }}
                    variant="outlined"
                    color="info"
                  >
                    <Link
                      to={"login"}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      Log in
                    </Link>
                  </Button>
                  <Button
                    sx={{ marginLeft: "10px" }}
                    variant="contained"
                    color="info"
                  >
                    <Link
                      to={"register"}
                      style={{ textDecoration: "none", color: "white" }}
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
