import * as React from "react";
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

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

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
  const [open, setOpen] = React.useState(false);
  const colors = tokens(theme.palette.mode);
  const colorMode = React.useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [selected, setSelected] = React.useState("Dashboard");
  const user = useSelector((state) => state.auth.login?.currentUser);
  React.useEffect(() => {
    if (user) {
      const decode = jwt_decode(user.data.accessToken);
      console.log(decode?.firstName);
      setFirstName(decode?.firstName);
      setLastName(decode?.lastName);
    }
  }, []);

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
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{ background: `${colors.primary[400]} !important` }}
      >
        <Toolbar
          sx={{
            margin: "0 10px 0 10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between ",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              // onClick={toggleSidebar}
              edge="start"
              sx={{ mr: 1, ...(open && { display: "none" }) }}
            >
              <MenuIcon
                style={{
                  color: colors.grey[100],
                }}
              />
            </IconButton>
            <Typography
              variant="h3"
              style={{ fontWeight: "500" }}
              noWrap
              component="div"
              color={colors.grey[100]}
            >
              SSPS
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" p={0}>
            {/* SEARCH BAR */}
            <Box
              display="flex"
              backgroundColor={colors.primary[400]}
              borderRadius="3px"
            >
              {/* <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton> */}
            </Box>

            {/* ICONS */}
            <Box display="flex">
              <IconButton onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === "dark" ? (
                  <DarkModeOutlinedIcon />
                ) : (
                  <LightModeOutlinedIcon />
                )}
              </IconButton>
              {user ? (
                <>
                  {/* <IconButton>
                    <NotificationsOutlinedIcon />
                  </IconButton> */}
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
                <></>
              )}

              {user ? (
                <></>
              ) : (
                <>
                  <Button>
                    <Link
                      color={colors.grey[500]}
                      className={`${
                        theme.palette.mode === "dark"
                          ? "text-light btn btn-sm"
                          : "btn-sm btn"
                      }`}
                      to={"login"}
                    >
                      Log in
                    </Link>
                  </Button>
                  <Button>
                    <Link
                      color={colors.grey[100]}
                      className={`${
                        theme.palette.mode === "dark"
                          ? "text-light btn btn-sm"
                          : "btn-sm btn"
                      }`}
                      to={"register"}
                    >
                      Register
                    </Link>
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",

            background: `${colors.primary[400]} !important`,
          },
        }}
        // variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader sx={{ background: `${colors.primary[400]} !important` }}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List
          sx={{
            background: `${colors.primary[400]} !important`,
            fontSize: "15px",
          }}
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <HomeOutlinedIcon />
              </ListItemIcon>
              <Link
                style={{
                  textDecoration: "none",
                  color: `${colors.primary[600]}`,
                }}
                to="/dashboard"
              >
                Dashboard
              </Link>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <CalendarTodayOutlinedIcon />
              </ListItemIcon>
              <Link
                style={{
                  textDecoration: "none",
                  color: `${colors.primary[600]}`,
                }}
                to="/"
              >
                Calendar
              </Link>
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List
          sx={{
            background: `${colors.primary[400]} !important`,
            fontSize: "15px",
          }}
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <HomeOutlinedIcon />
              </ListItemIcon>
              <Link
                style={{
                  textDecoration: "none",
                  color: `${colors.primary[600]}`,
                }}
                to="/bar"
              >
                Bar Chart
              </Link>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <CalendarTodayOutlinedIcon />
              </ListItemIcon>
              <Link
                style={{
                  textDecoration: "none",
                  color: `${colors.primary[600]}`,
                }}
                to="/pie"
              >
                Pie Chart
              </Link>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box sx={{ marginTop: "80px" }}></Box>
    </Box>
  );
}
