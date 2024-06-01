import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  styled,
  Typography,
  useTheme,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { tokens } from "../../../theme";
import { mockTransactions } from "../../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../../components/admin/Header";
import LineChart from "../../../components/admin/LineChart";
import PaymentIcon from "@mui/icons-material/Payment";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import GeographyChart from "../../../components/admin/GeographyChart";
import BarChart from "../../../components/user/BarChart";
import StatBox from "../../../components/user/StatBox";
import ProgressCircle from "../../../components/admin/ProgressCircle";
import { useEffect, useState } from "react";
import { reportMoneyPlan } from "../../../data/reportApi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import { format, isAfter } from "date-fns";
import Actual from "../../../assets/actual-web.png";
import Expect from "../../../assets/expectual-web.png";
import { Table } from "react-bootstrap";
import { getMoneyPlanRangeType } from "../../../data/calendarApi";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createAxios } from "../../../createInstance";
import { updateToken } from "../../../redux/authSlice";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { getAllTodoNote } from "../../../data/todo";
import Stack from "@mui/material/Stack";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function Arrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "red" }}
      onClick={onClick}
    />
  );
}

var settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 2,
  initialSlide: 0,
  // nextArrow: <Arrow />,
  // prevArrow: <Arrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: false,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const DemoPaper = styled(Paper)(({ theme }) => ({
  minWidth: 230,
  height: 150,
  padding: theme.spacing(2),
  ...theme.typography.body2,
  textAlign: "center",
}));

const Dashboard = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery('(max-width: 1000px)');
  const isLargeScreen = useMediaQuery('(max-width: 1280px)');
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login?.currentUser);
  let axoiJWT = createAxios(user, dispatch, updateToken);
  const [expectual, setExpectual] = useState("");
  const [actual, setActual] = useState("");
  const [type, setType] = useState("YEAR");
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  const [isOpen, setIsOpen] = useState(false);
  const [selectFromDate, setSelectFromDate] = useState(firstDayOfMonth);
  const [selectToDate, setSelectToDate] = useState(lastDayOfMonth);
  const [selectYear, setSelectYear] = useState(new Date());
  const [listDiagram, setListDiagram] = useState([]);
  const [listMoneyPlan, setListMoneyPlan] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const cardsPerPage = isSmallScreen ? 1 : 4; // Số lượng card trên mỗi trang
  const [display, setDisplay] = useState(true);
  const [width, setWidth] = useState(400);
  const [todo, setTodo] = useState([]);

  useEffect(() => {
    if (type === "MONTH") {
      let fromDate = format(selectFromDate, "yyyy-MM-dd");
      let toDate = format(selectToDate, "yyyy-MM-dd");
      getData(type, fromDate, toDate);
      getListRange("MONTH", fromDate, toDate);
    } else {
      let fromDate = format(selectYear, "yyyy-MM-dd");
      let toDate = format(selectYear, "yyyy-MM-dd");
      let fromDatePlan = format(selectYear, "yyyy-01-01");
      let toDatePlan = format(selectYear, "yyyy-12-31");
      getData(type, fromDate, toDate);
      getListRange("MONTH", fromDatePlan, toDatePlan);
    }
  }, [type]);

  useEffect(() => {
    getTodo();
  }, []);

  const getTodo = async () => {
    let res = await getAllTodoNote(user.data?.accessToken, axoiJWT);
    if (res && res.data.result === true) {
      setTodo(res.data?.data);
      console.log(res.data?.data);
    }
  };

  const getData = async (type, fromDate, toDate) => {
    // console.log("đang voa day");
    let res = await reportMoneyPlan(
      type,
      fromDate,
      toDate,
      user.data?.accessToken,
      axoiJWT
    );
    if (res.data?.result) {
      setExpectual(res.data?.data?.totalExpectMoney.toFixed(2));
      setActual(res.data?.data?.totalActualMoney.toFixed(2));
      setListDiagram(
        res.data?.data?.listDiagramData.sort((a, b) => a.doM - b.doM)
      );
    }
  };

  const getListRange = async (type, fromDate, toDate) => {
    let res = await getMoneyPlanRangeType(
      type,
      fromDate,
      toDate,
      user.data?.accessToken,
      axoiJWT
    );
    console.log(res.data?.data);
    if (res.data?.result) {
      setListMoneyPlan(
        res.data?.data.sort((a, b) => new Date(a.date) - new Date(b.date))
      );
    }
  };

  const handleChange = (value) => {
    console.log(value.target.value);
    setType(value.target.value);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSave = () => {
    if (type === "MONTH") {
      let fromDate = format(selectFromDate, "yyyy-MM-dd");
      let toDate = format(selectToDate, "yyyy-MM-dd");
      getData(type, fromDate, toDate);
      getListRange("MONTH", fromDate, toDate);
    } else {
      let fromDate = format(selectYear, "yyyy-MM-dd");
      let toDate = format(selectYear, "yyyy-MM-dd");
      getData(type, fromDate, toDate);
      let fromDatePlan = format(selectYear, "yyyy-01-01");
      let toDatePlan = format(selectYear, "yyyy-12-31");
      getListRange("MONTH", fromDatePlan, toDatePlan);
    }

    setIsOpen(false);
  };

  const exportData = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");
    let totalExpect = 0;
    let totalActual = 0;

    listMoneyPlan.map((row) => {
      totalExpect += row.expectAmount;
      totalActual += row.actualAmount;
    });
    // Tạo tiêu đề cho báo cáo
    worksheet.addRow([
      `Expenditure management report ${
        type === "MONTH"
          ? format(selectFromDate, "MMM, yyyy")
          : format(selectYear, "yyyy")
      }`,
    ]);

    // Tạo dòng tiền dự kiến
    worksheet.addRow(["Total Expected money", totalExpect]);

    // Tạo dòng tiền thực tế
    worksheet.addRow(["Total Actual money", totalActual]);

    // Tạo header cho dữ liệu
    const headers = [
      "ID",
      "Name",
      "Expect",
      "Actual",
      "Date",
      "Category",
      "Priority",
    ];
    worksheet.addRow(headers);

    // Làm cho tiêu đề cột chữ đậm
    worksheet.getRow(4).font = { bold: true };
    worksheet.getRow(3).font = { bold: true };
    worksheet.getRow(2).font = { bold: true };
    worksheet.getRow(1).font = { bold: true };

    // Tạo dữ liệu cho bảng
    listMoneyPlan.forEach((row, index) => {
      row?.usageMoneys.forEach((item) => {
        worksheet.addRow([
          index + 1,
          item.name,
          item.expectAmount,
          item.actualAmount,
          format(new Date(row.date), "dd-MM-yyyy"),
          item.categoryName,
          item.priority === 1
            ? "Highly"
            : item.priority === 2
            ? "Medium"
            : "Normal",
        ]);
      });
    });

    // Xuất ra file Excel
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer]),
      `ssps_report_${
        type === "MONTH"
          ? format(selectFromDate, "MMM_yyyy")
          : format(selectYear, "yyyy")
      }.xlsx`
    );
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function calculateProgress(fromDateStr, toDateStr) {
    let fromDate = new Date(fromDateStr);
    let toDate = new Date(toDateStr);

    let now = new Date();
    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let fromDateWithoutTime = new Date(
      fromDate.getFullYear(),
      fromDate.getMonth(),
      fromDate.getDate()
    );
    let toDateWithoutTime = new Date(
      toDate.getFullYear(),
      toDate.getMonth(),
      toDate.getDate()
    );

    let totalDuration = Math.floor(
      (toDateWithoutTime - fromDateWithoutTime) / (1000 * 60 * 60 * 24)
    );
    let passedDuration = Math.floor(
      (today - fromDateWithoutTime) / (1000 * 60 * 60 * 24)
    );

    if (passedDuration >= totalDuration) {
      return 1;
    } else {
      return passedDuration / totalDuration;
    }
  }

  return (
    <Box m="20px">
      <Box
        display="grid"
        gridTemplateColumns={
          isSmallScreen ? "repeat(1, 1fr)" : isMediumScreen ? 'repeat(6, 1fr)' : "repeat(12, 1fr)"
        }
        gridAutoRows={isSmallScreen ? "auto" : "140px"}
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn={isSmallScreen ? "span 1" : isMediumScreen ? 'span 3'  : "span 4"}
          // backgroundColor="#ffff"
          boxShadow="0px 5px 15px rgba(0, 0, 0, 0.1)"
          borderRadius="10px"
          backgroundColor={colors.boxDashboard[100]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={numberWithCommas(expectual)}
            subtitle="Total Expect Amount"
            progress="0.75"
            increase="+14%"
            imageSrc={Expect}
            icon={
              <PaymentIcon
                sx={{ color: colors.greenAccent[600], fontSize: "30px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn={isSmallScreen ? "span 1" : isMediumScreen ? "span 3" : "span 4"}
          // backgroundColor="#ffff"
          backgroundColor={colors.boxDashboard[100]}
          boxShadow="0px 5px 15px rgba(0, 0, 0, 0.1)"
          borderRadius="10px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={numberWithCommas(actual)}
            subtitle="Total Actual Amount"
            progress="0.50"
            increase="+21%"
            imageSrc={Actual}
            icon={
              <CurrencyExchangeIcon
                sx={{ color: colors.greenAccent[600], fontSize: "30px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn={isSmallScreen ? "span 1" : isMediumScreen ? "span 6" : "span 4"}
          gridRow={isSmallScreen ? "auto": "span 2"}
          height={isSmallScreen ? "auto" : "410px"}
          mb={isSmallScreen ? "auto" : isMediumScreen ? "100px" : "0"}

          // backgroundColor="#ffff"
          boxShadow="0px 5px 15px rgba(0, 0, 0, 0.1)"
          borderRadius="10px"
          backgroundColor={colors.boxDashboard[100]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`2px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Report Transactions
            </Typography>
            <IconButton onClick={() => exportData()}>
              <DownloadOutlinedIcon
                sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
              />
            </IconButton>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: isSmallScreen ? "100%" : isMediumScreen ? "100" : "650px" }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: "bold" }}
                    style={{
                      color: colors.grey[100],
                      backgroundColor: colors.boxDashboard[100],
                      background: colors.boxDashboard[100],
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold" }}
                    style={{
                      color: colors.grey[100],
                      backgroundColor: colors.boxDashboard[100],
                    }}
                  >
                    Expect
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold" }}
                    style={{
                      color: colors.grey[100],
                      backgroundColor: colors.boxDashboard[100],
                    }}
                  >
                    Actual
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold" }}
                    style={{
                      color: colors.grey[100],
                      backgroundColor: colors.boxDashboard[100],
                    }}
                  >
                    Day
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold" }}
                    style={{
                      color: colors.grey[100],
                      backgroundColor: colors.boxDashboard[100],
                    }}
                  >
                    Category
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold" }}
                    style={{
                      color: colors.grey[100],
                      backgroundColor: colors.boxDashboard[100],
                    }}
                  >
                    Priority
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* ))} */}
                {listMoneyPlan.map((row, index) =>
                  row?.usageMoneys.map((item) => (
                    <TableRow
                      key={row.id + item.name + index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        style={{
                          color: colors.grey[100],
                          backgroundColor: colors.boxDashboard[100],
                        }}
                      >
                        {item.name}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          color: colors.grey[100],
                          backgroundColor: colors.boxDashboard[100],
                        }}
                      >
                        {numberWithCommas(item.expectAmount.toFixed(2))}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          color: colors.grey[100],
                          backgroundColor: colors.boxDashboard[100],
                        }}
                      >
                        {numberWithCommas(item.actualAmount.toFixed(2))}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          color: colors.grey[100],
                          backgroundColor: colors.boxDashboard[100],
                          cursor:"pointer",
                          textDecoration:"underline"
                        }}
                        onClick={() => {
                          navigate(
                            `/calendar-money-plan?dayDetail=${row.date}`
                          );
                        }}
                      >
                        {format(new Date(row.date), "dd-MM-yyyy")}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          color: colors.grey[100],
                          backgroundColor: colors.boxDashboard[100],
                        }}
                      >
                        {item.categoryName}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          color: colors.grey[100],
                          backgroundColor: colors.boxDashboard[100],
                        }}
                      >
                        {item.priority === 1
                          ? "Highly"
                          : item.priority === 2
                          ? "Medium"
                          : "Normal"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn={isSmallScreen ? "span 1" : isMediumScreen ? "span 6" : "span 8"}
          gridRow={isSmallScreen ? "auto" : "span 2"}
          height={isSmallScreen ? "auto" : "480px"}
          // backgroundColor="#ffff"
          mt={ isSmallScreen ? "auto" : isMediumScreen ? "110px" : "auto"}
          boxShadow="0px 5px 15px rgba(0, 0, 0, 0.1)"
          borderRadius="10px"
          backgroundColor={colors.boxDashboard[100]}
        >
          <Box
            mt="20px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Box display="flex">
                <FormControl sx={{ m: 0, minWidth: 120 }} size="small">
                  <InputLabel id="demo-select-small-label">Type</InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    // variant="filled"
                    autoFocus
                    value={type}
                    label="Type"
                    onChange={handleChange}
                  >
                    <MenuItem value={"MONTH"}>Month</MenuItem>
                    <MenuItem value={"YEAR"}>Year</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center">
              {type === "MONTH" ? (
                <Typography
                  variant="h5"
                  // fontWeight="600"
                  color={colors.grey[100]}
                  paddingRight="5px"
                >
                  <b>From:</b> {format(selectFromDate, "yyyy-MM-dd")} -{" "}
                  <b>To:</b> {format(selectToDate, "yyyy-MM-dd")}
                </Typography>
              ) : (
                <Typography
                  variant="h5"
                  // fontWeight="600"
                  color={colors.grey[100]}
                  paddingRight="5px"
                >
                  <b>Year:</b> {format(selectYear, "yyyy")}
                </Typography>
              )}
              <IconButton aria-label="edit" onClick={() => setIsOpen(true)}>
                <EditIcon />
              </IconButton>
            </Box>

            {/* <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                $59,342.32
              </Typography> */}
          </Box>

          <Box height="438px" m="-15px 0 0 8px">
            <BarChart isDashboard={true} data={listDiagram} />
          </Box>
        </Box>

        <Box
          gridColumn={isSmallScreen ? "span 1" : isMediumScreen ? "span 6" : "span 4"}
          gridRow={isSmallScreen ? "auto" : "span 1"}
          height={isSmallScreen ? "220px" : "220px"}
          width={isSmallScreen ? "auto" : isMediumScreen ? "auto" : "550px"}
          // backgroundColor="#ffff"
          boxShadow="0px 5px 15px rgba(0, 0, 0, 0.1)"
          borderRadius="10px"
          backgroundColor={colors.boxDashboard[100]}
          mt={isSmallScreen ? "auto" : isMediumScreen ? "290px" : "100px"}
        >
          <Box mt="15px">
            <Typography
              color={colors.grey[100]}
              variant="h5"
              fontWeight="600"
              pl="15px"
            >
              TodoList
            </Typography>
            <Box
              display="flex "
              // mt="10px"
              alignItems="center"
              justifyContent="center"
              sx={{
                ".slick-prev:before, .slick-next:before": {
                  color: colors.greenAccent[500],
                },
              }}
            >
              <div className="slider-container">
                <div
                  style={{
                    width: 480 + "px",
                    display: display ? "block" : "none",
                  }}
                >
                  <Slider {...settings}>
                    {todo.map((card, index) => (
                      <div key={index}>
                        <Card
                          sx={{
                            minWidth: "50px",
                            marginRight: "20px",
                            height: "150px",
                            margin: "10px 10px 0px 10px",
                            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                            borderRadius: "10px",
                            backgroundColor: `${colors.boxDashboard[100]}`,
                          }}
                        >
                          <CardContent>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Link
                                to="/todo"
                                style={{ color: `${colors.grey[100]}` }}
                              >
                                <Typography sx={{ mb: 0.5, fontSize: "18px" }}>
                                  {card.title}
                                </Typography>
                              </Link>
                              <Stack spacing={2}>
                                <Box sx={{ position: "relative" }}>
                                  <CircularProgress
                                    color="success"
                                    variant="determinate"
                                    value={
                                      calculateProgress(
                                        card.fromDate,
                                        card.toDate
                                      ) * 100
                                    }
                                    size={30}
                                  />
                                  <Typography
                                    variant="b"
                                    color="success"
                                    sx={{
                                      position: "absolute",
                                      top: 9,
                                      left: 4,
                                      fontSize: "9px",
                                    }}
                                  >
                                    {(
                                      calculateProgress(
                                        card.fromDate,
                                        card.toDate
                                      ) * 100
                                    ).toFixed(0)}
                                    %
                                  </Typography>
                                </Box>
                              </Stack>
                            </Box>
                            <Typography
                              sx={{
                                color: isAfter(
                                  new Date(),
                                  new Date(card.toDate)
                                )
                                  ? "error.main"
                                  : "text.secondary",
                                fontSize: "12px",
                              }}
                              color="text.secondary"
                            >
                              {format(new Date(card.fromDate), "dd/MM/yyyy")} -{" "}
                              {format(new Date(card.toDate), "dd/MM/yyyy")}
                            </Typography>
                            <div
                              style={{
                                overflowY: "auto",
                                maxHeight: "67px",
                                listStyle: "none",
                              }}
                            >
                              {card?.cards.map((task, taskIndex) => (
                                <Typography
                                  key={taskIndex}
                                  component="div"
                                  style={{
                                    overflowWrap: "anywhere",
                                    background: `#${card.color}`,
                                    padding: "5px 5px 5px 10px",
                                    borderRadius: "10px",
                                    color: "#ffff",
                                    marginTop: "5px",
                                  }}
                                >
                                  {task.title}
                                </Typography>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            </Box>
          </Box>
        </Box>
        {/* ROW 3 */}
      </Box>

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Select time
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          {type === "MONTH" ? (
            <Box style={{ display: "flex", marginBottom: "0px" }}>
              <div style={{ marginRight: "10px" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="From"
                    value={dayjs(selectFromDate)}
                    onChange={(date) => setSelectFromDate(new Date(date))}
                  />
                </LocalizationProvider>
              </div>
              <div style={{ marginRight: "10px" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="To"
                    value={dayjs(selectToDate)}
                    onChange={(date) => setSelectToDate(new Date(date))}
                  />
                </LocalizationProvider>
              </div>
            </Box>
          ) : (
            <div style={{ marginRight: "10px" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={["year"]}
                  label="Year"
                  value={dayjs(selectYear)}
                  onChange={(date) => setSelectYear(new Date(date))}
                />
              </LocalizationProvider>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSave}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </Box>
  );
};

export default Dashboard;
