  import { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import jwt_decode from "jwt-decode"; 
import { useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import BarChartIcon from '@mui/icons-material/BarChart';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';

// // eslint-disable-next-line react/prop-types
// const Item = ({ title, to, icon, selected, setSelected }) => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
  
//   return (
//     <MenuItem
//       active={selected === title}
//       style={{
//         color: colors.grey[100],
//       }}
//       onClick={() => setSelected(title)}
//       icon={icon}
//     >
//       <Typography>{title}</Typography>
//       <Link to={to} />
//     </MenuItem>
//   );
// };

// const Sidebars = ({ isCollapsed, toggleSidebar }) => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   // const [isCollapsed, setIsCollapsed] = useState(true);
//   const [selected, setSelected] = useState("Dashboard");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const user = useSelector((state) => state.auth.login?.currentUser);
//   useEffect(() => {
//     if (user) {
//       const decode = jwt_decode(user.data.accessToken);
//       console.log(decode?.firstName);
//       setFirstName(decode?.firstName);
//       setLastName(decode?.lastName);
//     }
//   }, []);

//   function stringToColor(string) {
//     let hash = 0;
//     let i;

//     /* eslint-disable no-bitwise */
//     for (i = 0; i < string.length; i += 1) {
//       hash = string.charCodeAt(i) + ((hash << 5) - hash);
//     }

//     let color = "#";

//     for (i = 0; i < 3; i += 1) {
//       const value = (hash >> (i * 8)) & 0xff;
//       color += `00${value.toString(16)}`.slice(-2);
//     }
//     /* eslint-enable no-bitwise */
     

//     return color;
//   }

//   function stringAvatar(firstName, lastName) {
//     return {
//       style: {
//         backgroundColor: stringToColor(firstName),
//         fontSize: "50px",
//         fontWeight: 600,
//         width: 100,
//         height: 100,
//       },
//       children: `${firstName.split(" ")[0][0]}${lastName.split(" ")[0][0]}`,
//     };
//   }

//   return (
//     <Box
//       sx={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         height: "100vh", 
//         zIndex: 1000,
//         "& .pro-sidebar-inner": {
//           background: `${colors.primary[400]} !important`,
//           height: "100%",
//         },
//         "& .pro-icon-wrapper": {
//           backgroundColor: "transparent !important",
//         },
//         "& .pro-inner-item": {
//           padding: "5px 20px 5px 20px !important",
//         },
//         "& .pro-inner-item:hover": {
//           color: "#868dfb !important",
//         },
//         "& .pro-menu-item.active": {
//           color: "#6870fa !important",
//         },
//         "& .pro-sidebar .pro-sidebar-inner": {},
//       }}
//     >
//       <ProSidebar collapsed={isCollapsed}>
//         <Menu iconShape="square">
//           <MenuItem
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
//             style={{
//               margin: "10px 0 20px 0",
//               color: colors.grey[100],
//             }}
//           >
//             {!isCollapsed && (
//               <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 ml="15px"
//               >
//                 <Typography variant="h3" color={colors.grey[100]}>
//                   SSPS
//                 </Typography>
//                 <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
//                   <MenuOutlinedIcon />
//                 </IconButton>
//               </Box>
//             )}
//           </MenuItem>

//           {!isCollapsed && (
//             <>
//               <Box mb="25px">
//                 <Box display="flex" justifyContent="center" alignItems="center">
//                   <Stack direction="row" spacing={2}>
//                     <Avatar {...stringAvatar(firstName, lastName)} />
//                   </Stack>
//                 </Box>
//                 <Box textAlign="center">
//                   <Typography
//                     variant="h2"
//                     color={colors.grey[100]}
//                     fontWeight="bold"
//                     sx={{ m: "10px 0 0 0" }}
//                   >
//                     {firstName} {lastName}
//                   </Typography>
//                   <Typography
//                     variant="h5"
//                     color={colors.greenAccent[500]}
//                   ></Typography>
//                 </Box>
//               </Box>
//             </>
//           )}

//           <Box paddingLeft={isCollapsed ? undefined : "10%"}>
//             <Item
//               title="Home"
//               to="/"
//               icon={<HomeOutlinedIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             {isCollapsed && (
//               <Typography
//                 variant="h6"
//                 color={colors.grey[300]}
//                 sx={{ m: "0px 0 5px 20px" }}
//               >
//                 Home
//               </Typography>
//             )}
//             <Item
//               title="Report"
//               to="/todo"
//               icon={<BarChartIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             {isCollapsed && (
//               <Typography
//                 variant="h6"
//                 color={colors.grey[300]}
//                 sx={{ m: "0px 0 5px 20px" }}
//               >
//                 Report
//               </Typography>
//             )}
//             <Item
//               title="Todo"
//               to="/todo"
//               icon={<FormatListBulletedIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             {isCollapsed && (
//               <Typography
//                 variant="h6"
//                 color={colors.grey[300]}
//                 sx={{ m: "0px 0 5px 20px" }}
//               >
//                 Todo
//               </Typography>
//             )}
//             <Item
//               title="Pomodoro"
//               to="/pomodoro"
//               icon={<AccessAlarmIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             {isCollapsed && (
//               <Typography
//                 variant="h6"
//                 color={colors.grey[300]}
//                 sx={{ m: "0px 0 0px 5px" }}
//               >
//                 Pomodoro
//               </Typography>
//             )}
//             <Item
//               title="FAQ"
//               to="/faq"
//               icon={<HelpOutlineOutlinedIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             {isCollapsed && (
//               <Typography
//                 variant="h6"
//                 color={colors.grey[300]}
//                 sx={{ m: "0px 0 5px 25px" }}
//               >
//                 FAQ
//               </Typography>
//             )}
//           </Box>
//         </Menu>
//       </ProSidebar>
//     </Box>
//   );
// };

// export default Sidebars;

// eslint-disable-next-line react/prop-types
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

const Sidebars = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const user = useSelector((state) => state.auth.login?.currentUser);
  useEffect(() => {
    if(user ) {
      const decode = jwt_decode(user?.data.accessToken);
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

 
  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
          // background: `#ffff !important`,
          // border: "1px soild #ccc",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 20px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              // color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                >
                  SSPS
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                {/* <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                /> */}
                {/* <Stack direction="row" spacing={2}>
                  <Avatar
                    style={{ fontSize: "50px", fontWeight: 600 }}
                    {...stringAvatar(firstName, lastName)}
                    sx={{ width: 100, height: 100 }}
                  />
                </Stack> */}
              </Box>
              {/* <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {firstName} {lastName}
                </Typography>
                <Typography
                  variant="h5"
                  color={colors.greenAccent[500]}
                ></Typography>
              </Box> */}
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/system/admin/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
             <Item
              title="Home"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Report"
              to="/todo"
              icon={<BarChartIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography> */}
            <Item
              title="Manage User"
              to="/system/admin/manage-user"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <Item
              title="History"
              to="/system/admin/team"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}

            {/* <Item
              title="Invoices Balances"
              to="/admin/invoices"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}

            {/* <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography> */}
            <Item
              title="Create User"
              to="/system/admin/form"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <Item
              title="Calendar"
              to="/admin/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ Page"
              to="/admin/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}

            {/* <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Charts
            </Typography>
            <Item
              title="Bar Chart"
              to="/system/admin/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pie Chart"
              to="/system/admin/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Line Chart"
              to="/system/admin/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            {/* <Item
              title="Geography Chart"
              to="/admin/geography"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebars;

