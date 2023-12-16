import { Box, IconButton, Popover, Typography, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logOutAdmin } from "../../redux/apiRequest";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const user = useSelector(state => state.auth.login?.currentUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const updateAccount = () => {
    navigate("/system/admin/update-account");
  }

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleLogOut = () => {
    logOutAdmin(dispatch, navigate)
  }

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
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
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <>
          <IconButton
            aria-describedby={id}
            variant="contained"
            onClick={handleClick}
          >
            <SettingsOutlinedIcon />
          </IconButton>
          {user ? (
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <List component="nav" aria-label="mailbox folders">
                <ListItem button>
                  <PersonOutlinedIcon
                    style={{
                      marginRight: "5px",
                    }}
                  />
                  <ListItemText onClick={updateAccount} primary="Account" />
                </ListItem>
                <Divider />
                <ListItem button>
                  <LogoutIcon
                    style={{
                      marginRight: "5px",
                    }}
                  />
                  <ListItemText onClick={handleLogOut} primary="Log out" />
                </ListItem>
              </List>
            </Popover>
          ) : (
            <></>
          )}
        </>

        {user ? (
          <></>
        ) : (
          <IconButton>
            <Link className="btn text-light" to={"login"}>
              Log in
            </Link>
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default Topbar;
