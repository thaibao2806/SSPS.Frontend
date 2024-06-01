import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOutUser } from "../../../redux/apiRequest";
const pages = [
  { name: "Home", path: "/" }, // Define path for each page
  { name: "Money PLan", path: "/calendar-money-plan" },
  { name: "TodoList", path: "/todo" },
  { name: "Pomodoro", path: "/pomodoro" },
  { name: "Account", path: "/update-account" },
  { name: "Reset password", path: "/reset-password" },
];
const DrawerComp = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogOut = () => {
    logOutUser(dispatch, navigate);
  };

  return (
    <React.Fragment>
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <List>
          {pages.map((page, index) => (
            <ListItemButton key={index} component={Link} to={page.path}>
              {/* Use Link from React Router */}
              <ListItemIcon>
                <ListItemText>{page.name}</ListItemText>
              </ListItemIcon>
            </ListItemButton>
          ))}
          <ListItemButton  component={Link} to={""}>
            {/* Use Link from React Router */}
            <ListItemIcon>
              <ListItemText>Donate</ListItemText>
            </ListItemIcon>
          </ListItemButton>
          <ListItemButton onClick={handleLogOut}>
            {/* Use Link from React Router */}
            <ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </ListItemIcon>
          </ListItemButton>
        </List>
      </Drawer>
      <IconButton
        sx={{
          marginLeft: "auto",
          background: "linear-gradient(90deg, #00ffff, #ff00c3)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        onClick={() => setOpenDrawer(!openDrawer)}
      >
        <MenuIcon style={{ fontSize: "30px" }} />
      </IconButton>
    </React.Fragment>
  );
};

export default DrawerComp;
