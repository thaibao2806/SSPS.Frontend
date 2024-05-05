import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FormatListNumberedRtlIcon from "@mui/icons-material/FormatListNumberedRtl";
import Header from "../../components/admin/Header";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GeographyChart from "../../components/admin/GeographyChart";
import BarChart from "../../components/admin/BarChart";
import StatBox from "../../components/admin/StatBox";
import ProgressCircle from "../../components/admin/ProgressCircle";
import { useEffect, useState } from "react";
import { dashBoard, getUserByAdmin } from "../../data/authApi";
import jwt_decode from "jwt-decode"; 
import { useDispatch, useSelector } from "react-redux";
import { mockBarData as data } from "../../data/mockData";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { format } from "date-fns";
import { createAxios } from "../../createInstance";
import { updateToken } from "../../redux/authSlice";


const Dashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.login?.currentUser);
  let axoisJWT = createAxios(user, dispatch, updateToken)
  const [userData, setUserData] = useState(null)
  const [totalUser, setTotalUser] = useState(0)
  const [totalNewUsers, setTotalNewUsers] = useState([])
  const [totalNotes, setTotalNotes] = useState([])
  const [totalMoneyPlans, setTotalMoneyPlans] = useState([])
  const [resultArray, setResultArray] = useState([]);
  const [year, setYear] = useState(new Date())
  const colors = tokens(theme.palette.mode);
  useEffect(() => {
    getUser()
    dataDashBoard()
  }, [year])
  useEffect(() => {
    barData();
  }, [totalMoneyPlans, totalNewUsers, totalNotes])

  const getUser = async() => {
    let res = await getUserByAdmin(1, 20, user.data?.accessToken, axoisJWT);
    if (res && res.data.msgCode === "SUCCESS") {
      setUserData(res.data.data);
    }
  }

  const dataDashBoard = async() => {
    console.log("year", year)
    const yearFilter = format(year, "yyyy");
    let res = await dashBoard(yearFilter, user.data?.accessToken, axoisJWT);
    if(res && res.data.msgCode === "SUCCESS") {
      setTotalUser(res.data.data?.amountOfUser);
      setTotalNewUsers(res.data.data?.amountOfNewUser);
      setTotalNotes(res.data.data?.amountOfNote);
      setTotalMoneyPlans(res.data.data?.amountOfMoneyPlan);
    }
  }

  const totalNewUser = () => {
    let sum = 0
    for (let i = 0; i < totalNewUsers?.length; i++) {
      sum += totalNewUsers[i];
    }
    return sum
  }

  const totalNote = () => {
    let sum = 0;
    for (let i = 0; i < totalNotes?.length; i++) {
      sum += totalNotes[i];
    }
    return sum;
  };

  const totalMoneyPlan = () => {
    let sum = 0;
    for (let i = 0; i < totalMoneyPlans?.length; i++) {
      sum += totalMoneyPlans[i];
    }
    return sum;
  };

  const barData = () => {
     const months = [
       "Jan",
       "Feb",
       "Mar",
       "Apr",
       "May",
       "Jun",
       "Jul",
       "Aug",
       "Sep",
       "Oct",
       "Nov",
       "Dec",
     ];
     const newArray = months.map((month, index) => ({
       country: month,
       "New users": totalNewUsers[index],
       "New usersColor": `hsl(${index * 30 + 229}, 70%, 50%)`,
       "New notes": totalNotes[index],
       "New notesColor": `hsl(${index * 30 + 296}, 70%, 50%)`,
       "New moneyPlans": totalMoneyPlans[index],
       "New moneyPlansColor": `hsl(${index * 30 + 97}, 70%, 50%)`,
     }));
     setResultArray(newArray)
  }

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={["year"]}
              label="Year"
              value={dayjs(year)}
              onChange={(newValue) => setYear(new Date(newValue))}
            />
          </LocalizationProvider>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalUser}
            subtitle="Total users"
            progress="1"
            increase="+100%"
            icon={
              <PersonIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalNewUser()}
            subtitle="New users"
            progress="1"
            increase="+100%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalNote()}
            subtitle="Total notes"
            progress="1"
            increase="+100%"
            icon={
              <FormatListNumberedRtlIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalMoneyPlan()}
            subtitle="Total moneyplans"
            progress="1"
            increase="+100%"
            icon={
              <CalendarMonthIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          height="370px"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Total number of users
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                {totalUser} user
              </Typography>
            </Box>
            <Box>
              <IconButton>
                {/* <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                /> */}
              </IconButton>
            </Box>
          </Box>
          <Box height="320px" m="-20px 0 0 0">
            <BarChart isDashboard={true} data={resultArray} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
          height="370px"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent users
            </Typography>
          </Box>
          {userData?.map((item, index) => (
            <Box
              key={`${index}-${item.id}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {item.firstName} {item.lastName}
                </Typography>
                <Typography color={colors.grey[100]}>{item.code}</Typography>
              </Box>
              <Box color={colors.grey[100]}>{item.phone}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                {item.status}
              </Box>
            </Box>
          ))}
        </Box>

        {/* ROW 3 */}
        {/* <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box> */}
      </Box>
    </Box>
  );
};

export default Dashboard;
