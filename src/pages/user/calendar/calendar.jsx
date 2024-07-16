import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  Typography,
  Dialog,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  useTheme,
  MenuItem,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Popover,
  Menu,
  useMediaQuery,
} from "@mui/material";
import { tokens } from "../../../theme";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { mockEventData } from "../../../data/mockData";
import { useDispatch, useSelector } from "react-redux";
import {
  createListMoneyPlan,
  createMoneyPlan,
  deleteCategories,
  deletePlan,
  getCategories,
  getMoneyPlanById,
  getMoneyPlanRangeType,
  updateCategories,
  updateMoneyPlan,
  updateUsage,
} from "../../../data/calendarApi";
import SmallCalendar from "./smallCalendar";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Checkbox from "@mui/material/Checkbox";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import {
  addMonths,
  endOfDay,
  format,
  isSameDay,
  isValid,
  parseISO,
  setMonth,
  startOfMonth,
  sub,
  toDate,
} from "date-fns";
import { Icons, ToastContainer, toast } from "react-toastify";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import { ColorPicker } from "material-ui-color";
import {
  createNote,
  deleteNote,
  getNote,
  updateNote,
} from "../../../data/noteApi";
import holidays from "date-holidays";
import { logOutUser } from "../../../redux/apiRequest";
import "./calendar.css";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Collapse from "@mui/material/Collapse";
import {
  ArrowBackIos,
  ArrowForwardIos,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Divider from "@mui/material/Divider";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import MenuList from "@mui/material/MenuList";
// import MenuItem from '@mui/material/MenuItem';
// import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from "@mui/material/ListItemIcon";
import { createAxios } from "../../../createInstance";
import { updateToken } from "../../../redux/authSlice";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Calendar = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const { notification } = location.state || { notification: {} };
  const query = useQuery();
  const param = query.get("dayDetail");
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login?.currentUser);
  let axoisJWT = createAxios(user, dispatch, updateToken);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpenCreate, setIsDialogOpenCreate] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [select, setSelect] = useState("");
  const [eventColor, setEventColor] = useState("3");
  const [category, setCategory] = useState("");
  const availableColors = [
    {
      title: "Highly",
      priority: "#5cc9ff",
      color: "1",
    },
    {
      title: "Medium",
      priority: "#41df95",
      color: "2",
    },

    {
      title: "Normal",
      priority: "#919191b2",
      color: "3",
    },
  ];
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [timeFrame, setTimeFrame] = useState("Chose");
  const [boxCount, setBoxCount] = useState(1);
  const [boxData, setBoxData] = useState([
    {
      eventTitle: "",
      eventColor: null,
    },
  ]);
  const [timeText, setTimeText] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [expectAmount, setExpectAmount] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedStartDay, setSelectedStartDay] = useState(new Date());
  const [selectedEndDay, setSelectedEndDay] = useState(new Date());
  const [totalAmountInBoxes, setTotalAmountInBoxes] = useState(0);
  const [currencyUnit, setCurrencyUnit] = useState("");
  const [actualAmount, setActualAmount] = useState("");
  const [moneyExpect, setMoneyExpect] = useState("");
  const [moneyActual, setMoneyActual] = useState("");
  const [unit, setUnit] = useState("");

  const currentDate = new Date();
  let month = currentDate.getMonth() + 1;
  const [startDate, setStartDate] = useState(
    currentDate.getFullYear() + "-" + month + "-" + currentDate.getDate()
  );
  const [endDate, setEndDate] = useState(
    currentDate.getFullYear() + "-" + month + "-" + currentDate.getDate()
  );
  const [allDay, setAllDay] = useState(false);
  const [dayStart, setDayStart] = useState(dayjs(currentDate));
  const [dayEnd, setDayEnd] = useState(dayjs(currentDate));
  const [timeStart, setTimeStart] = useState(dayjs(currentDate));
  const [timeEnd, setTimeEnd] = useState(dayjs(currentDate));
  const [type, setType] = useState("DAY");
  const [errorCreate, setErrorCreate] = useState("");
  const [dataUpdate, setDataUpdate] = useState("");
  const [checkUpdate, setCheckUpdate] = useState(false);
  const [idUpdate, setIdUpdate] = useState("");
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [idNote, setIdNote] = useState("");
  const [colorUpdate, setColorUpdate] = useState("");
  const [priority, setPriority] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [isOpenCreateNote, setIsOpenCreateNote] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [description, setDescription] = useState("");
  const [dataPlan, setDataPlan] = useState(null);
  const [errorUsage, setErrorUsage] = useState("");
  const [createCategory, setCreateCategory] = useState("");
  const [isOpenCreateCategory, setIsOpenCreateCategory] = useState(false);
  const [isUpdateCate, setIsUpdateCate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [validateMoneyPlan, setValidateMoneyPlan] = useState("");
  const [validateCategory, setValidateCategory] = useState("");
  const [validateNote, setValidateNote] = useState("");
  const [isPopoverNote, setIsPopoverNote] = useState(false);
  const [login, setLogin] = useState(false);
  const calendarRef = useRef(null);
  const mock = mockEventData;
  const [isDelete, setIsDelete] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [isDetailCalendar, setIsDetailCalendar] = useState(false);
  const [isDetailNote, setIsDetailNote] = useState(false);
  const [isListOpen, setIsListOpen] = useState(true);
  const [isBoxOpen, setIsBoxOpen] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isDeleteCategory, setIsDeleteCategory] = useState(false);
  const [totalActucalAmount, setTotalActualAmount] = useState("");
  const [isCategorySmall, setIsCategorySmall] = useState(false);

  const [anchorEl1, setAnchorEl1] = useState(null);

  const handleClickCategory = (event) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleCloseCategory = () => {
    setAnchorEl1(null);
  };

  const open = Boolean(anchorEl1);
  const id = open ? "simple-popover" : undefined;

  const toggleBox = () => {
    setIsBoxOpen((prevState) => !prevState);
  };

  const toggleList = () => {
    setIsListOpen((prevState) => !prevState); // Đảo ngược trạng thái danh sách
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // const hd = new holidays('VN')
  // const holiday = hd.getHolidays()
  useEffect(() => {
    if (notification?.date) {
      const date = format(new Date(notification.date), "yyyy-MM-dd");
      if (calendarRef.current) {
        calendarRef.current.getApi().gotoDate(date);
        setStartDate(date);
        setEndDate(date);
      }

      handleDayButtonClick("timeGridDAY");
    }
  }, [notification?.date]);

  useEffect(() => {
    if (param) {
      const date = format(new Date(param), "yyyy-MM-dd");
      if (calendarRef.current) {
        console.log("check param", param);

        calendarRef.current.getApi().gotoDate(date);
        setStartDate(date);
        setEndDate(date);
      }
      handleDayButtonClick("timeGridDAY");
    }
  }, [param]);

  useEffect(() => {
    getCategory();
    console.log("checkssss", param);
  }, []);

  const getCategory = async () => {
    try {
      let res = await getCategories(user.data?.accessToken, axoisJWT);
      if (res && res.data.msgCode === "SUCCESS") {
        setCategoriesList(res.data?.data);
      }
    } catch (error) {
      // if (error.response.status === 401) {
      //   console.log(401);
      //   const timeoutDelay = 5000;
      //   toast.warning("Session expired. Logging out in 5 seconds.");
      //   setTimeout(() => {
      //     logOutUser(dispatch, navigate);
      //   }, timeoutDelay);
      // }
    }
  };

  const handleAddBox = () => {
    setBoxCount(boxCount + 1);
    setBoxData((prevBoxData) => [
      ...prevBoxData,
      {
        eventTitle: "",
        eventColor: "",
      },
    ]);
  };

  const handleDeleteBox = (index) => {
    console.log(index);
    setBoxCount(boxCount - 1);
    const updatedBoxData = [...boxData];
    updatedBoxData.splice(index, 1);
    console.log(updatedBoxData);
    setBoxData(updatedBoxData);
  };

  const handleDateClick = (selected) => {
    // openDialog();
    setIsOpenCreateNote(true);
    setDayStart(selected.start);
    setDayEnd(selected.end);
    setTimeStart(selected.start);
    const date1 = selected.start;
    const date2 = selected.end;
    const result = isSameDay(date1, date2);
    if (result) {
      setTimeEnd(selected.end);
    } else {
      setTimeEnd(dayjs(selected.start).endOf("day").toDate());
    }
    setSelect(selected);
    setSelectedEvent(null);
    const calendarApi = selected.view.calendar;
    setEventDate(calendarApi);
    calendarApi.unselect();
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setIsUpdateCate(false);
    setCreateCategory("");
    setIsOpenCreateCategory(false);
    setIsOpenCreateNote(false);
    setEventDate("");
    setEventTitle("");
    setSelect("");
    setTimeEnd(dayjs(currentDate));
    setTimeStart(dayjs(currentDate));
    setDayEnd(dayjs(currentDate));
    setDayStart(dayjs(currentDate));
    setSelectedEvent(null);
    setEventColor("indigo");
    setMoneyActual("");
    setMoneyExpect("");
    setCategory("");
    setSelectedColor(null);
    setTimeEnd("");
    setTimeStart("");
    setDayStart("");
    setDescription("");
    setDayEnd("");
    setErrorUsage("");
    setValidateCategory("");
    setValidateNote("");
    setIsDetailNote(false);
  };

  const handleAddEvent = () => {
    if (eventTitle && eventDate) {
      eventDate.addEvent({
        id: `${eventDate}-${eventTitle}`,
        title: eventTitle,
        start: select.startStr,
        end: select.endStr,
        allDay: select.allDay,
        color: eventColor,
      });
      closeDialog();
    }
  };

  const handleEventClick = (selected) => {
    let checkId = currentEvents.filter((item) => item.id === selected.event.id);
    let ctg;
    checkId.map((item) => {
      if (item.expectAmount < item.actualAmount) {
        setErrorUsage("Warning: Actual money is higher than expected money");
      }
      setMoneyExpect(item.expectAmount);
      setMoneyActual(item.actualAmount);
      setCategoryName(item.priority);
      setDescription(item?.description);
      setSelectedColor(item?.color);
      setTimeEnd(item?.end);
      setTimeStart(item?.start);
      setColorUpdate(item?.color);
      ctg = categoriesList.filter((i) => i.id === item.categoryId);
      if (item.expectAmount || item.actualAmount) {
        // openDialog()()
        handleUpdatePlan(item.idMoney);
        // setStartDate(item.start);
        // setEndDate(item.end)
        console.log("aaa", item.idMoney);
        // setIsVisible(false);
        // handleEventMouseEnter(selected);
      } else {
        // setIsVisible(true);
        // handleEventMouseEnter(selected);
        setIdNote(item.id);
        setIsOpenCreateNote(true);
      }
    });
    ctg.map((item) => setCategory(item.id));
    const calendarApi = selected.view.calendar;
    setDayStart(selected.event.start);
    setDayEnd(selected.event.end || selected.event.start);
    setEventDate(calendarApi);
    setSelectedEvent(selected);
    setEventTitle(selected.event.title);
    setEventColor(selected.event.backgroundColor);
    // openDialog();
    // setIsOpenCreateNote(true)
  };

  const handleUpdateEvent = async () => {
    try {
      if (eventTitle && eventDate) {
        if (moneyActual > moneyExpect) {
          setErrorUsage("Actual money is higher than expected money");
        }
        const updatedEvent = {
          id: selectedEvent.event.id,
          title: eventTitle,
          start: selectedEvent.event.start,
          end: selectedEvent.event.end,
          allDay: selectedEvent.event.allDay,
          color: eventColor,
          priority:
            eventColor === "#94d4f490" ? 1 : eventColor === "#79ffc0" ? 2 : 3,
          categoryId: category,
          expectAmount: moneyExpect,
          actualAmount: moneyActual,
        };

        const moneyPlanId = idUpdate;
        let checkId = dataPlan.map((item) => {
          if (item.id === selectedEvent.event.id) {
            return { ...item, ...updatedEvent };
          }
          return item;
        });

        const data = checkId.map((item) => ({
          name: item.title,
          expectAmount: item.expectAmount,
          actualAmount: item.actualAmount,
          priority: item.priority,
          categoryId: item.categoryId,
        }));
        console.log(data);

        let res = await updateUsage(
          moneyPlanId,
          data,
          user.data?.accessToken,
          axoisJWT
        );
        if (res && res.data.msgCode === "SUCCESS") {
          toast.success("Update success!!!");
          if (type === "DAY") {
            handleDayButtonClick("timeGridDAY");
          } else if (type === "MONTH") {
            handleDayButtonClick("dayGridMonth");
          } else if (type === "YEAR") {
            handleDayButtonClick("multiMonthYear");
          }
        } else {
          toast.error("Update failed!!");
        }

        const updatedEvents = currentEvents.map((event) => {
          return event.id === selectedEvent.event.id ? updatedEvent : event;
        });

        setCurrentEvents(updatedEvents);

        const calendarApi = selectedEvent.view.calendar;
        const existingEvent = calendarApi.getEventById(selectedEvent.event.id);

        if (existingEvent) {
          existingEvent.setProp("title", eventTitle);
          existingEvent.setProp("start", selectedEvent.start);
          existingEvent.setProp("end", selectedEvent.end);
          existingEvent.setProp("backgroundColor", eventColor);
        }

        closeDialog();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(401);
        const timeoutDelay = 5000;

        toast.warning("Session expired. Logging out in 5 seconds.");

        setTimeout(() => {
          logOutUser(dispatch, navigate);
        }, timeoutDelay);
      }
    }
  };

  const openCreateDialog = () => {
    setIsDialogOpenCreate(true);
  };

  const closeCreateDialog = () => {
    setIsDialogOpenCreate(false);
    setCurrencyUnit("");
    setTimeFrame("Chose");
    setBoxData([
      {
        eventTitle: "",
        eventColor: "",
        actualAmount: actualAmount,
      },
    ]);
    setErrorCreate("");
    setTotalAmount("");
    setBoxCount(1);
    setValidateMoneyPlan("");
    setCheckUpdate(false);
    setShowConfirmation(false);
    // setSelectedStartDay(new Date(startDate));
    // setSelectedMonth(new Date(startDate));
    // setSelectedYear(new Date(startDate));
  };

  const handleCreatePlan = () => {
    if (!user?.data) {
      setLogin(true);
      return;
    }
    openCreateDialog();
  };

  const handleBoxTitleChange = (e, index) => {
    const updatedBoxData = [...boxData];
    updatedBoxData[index].eventTitle = e.target.value;
    setBoxData(updatedBoxData);
  };

  const handleBoxAmountChange = (e, index) => {
    const updatedBoxData = [...boxData];
    updatedBoxData[index].amount = e.target.value;
    setBoxData(updatedBoxData);
  };
  const handleBoxActualAmountChange = (e, index) => {
    const updatedBoxData = [...boxData];
    updatedBoxData[index].actualAmount = e.target.value;
    setBoxData(updatedBoxData);
  };

  const handleBoxColorChange = (e, index) => {
    const updatedBoxData = [...boxData];
    updatedBoxData[index].eventColor = e.target.value;
    setBoxData(updatedBoxData);
  };

  const handleBoxCategoryChange = (e, index) => {
    const updatedBoxData = [...boxData];
    updatedBoxData[index].category = e.target.value;
    setBoxData(updatedBoxData);
  };

  const handleSuggestion = () => {
    const amounts = totalAmount / 5;
    setBoxData([
      {
        eventTitle: "Home bill",
        eventColor: "1",
        amount: 1000000,
        category: categoriesList[9].id,
      },
      {
        eventTitle: "Electricity",
        eventColor: "1",
        amount: 70000,
        category: categoriesList[4].id,
      },
      {
        eventTitle: "Water bill",
        eventColor: "1",
        amount: 70000,
        category: categoriesList[8].id,
      },
      {
        eventTitle: "Internet bill",
        eventColor: "2",
        amount: 250000,
        category: categoriesList[6].id,
      },
      {
        eventTitle: "Food & Beverage",
        eventColor: "1",
        amount: 2500000,
        category: categoriesList[9].id,
      },
      {
        eventTitle: "Health & Fitness",
        eventColor: "1",
        amount: 250000,
        category: categoriesList[9].id,
      },
      {
        eventTitle: "Gasoline",
        eventColor: "2",
        amount: 500000,
        category: categoriesList[9].id,
      },
      {
        eventTitle: "Entertainment",
        eventColor: "2",
        amount: 500000,
        category: categoriesList[9].id,
      },
      {
        eventTitle: "Incurred",
        eventColor: "2",
        amount: 500000,
        category: categoriesList[9].id,
      },
    ]);
  };

  useEffect(() => {
    setBoxCount(boxData.length);
    updateTotalAmountInBoxes();
  }, [boxData]);

  const updateTotalAmountInBoxes = () => {
    const total = boxData.reduce((sum, box) => sum + parseFloat(box.amount), 0);
    if (isDelete) {
      setActualAmount(0);
    } else {
      const totalActual = boxData.reduce(
        (sum, box) => sum + parseFloat(box?.actualAmount),
        0
      );
      setActualAmount(totalActual);
    }
    if (totalAmountInBoxes > totalAmount) {
      setShowConfirmation(true);
    }
    setTotalAmountInBoxes(total);
    setTotalAmount(total);
  };

  useEffect(() => {
    totalAmountText();
  }, [selectedStartDay, selectedEndDay, selectedYear, selectedMonth]);

  // const errorText =
  //   totalAmountInBoxes > totalAmount
  //     ? setTotalSuggest(true)
  //     : setTotalSuggest(false);

  const totalAmountText = () => {
    if (timeFrame === "YEAR") {
      setTimeText(`Year: ${selectedYear?.$y}`);
    } else if (timeFrame === "MONTH") {
      setTimeText(`Month: ${selectedMonth?.$M + 1}/${selectedMonth?.$y}`);
    } else if (timeFrame === "DAY") {
      setTimeText(
        `Day: ${selectedStartDay?.$D}/${selectedStartDay?.$M + 1} - ${
          selectedEndDay?.$D
        }/${selectedEndDay?.$M + 1}/${selectedEndDay?.$y}`
      );
    }
  };

  const handleCreateMoneyPlan = async () => {
    try {
      if (!user?.data) {
        navigate("/login");
        return;
      }
      const expectAmount = totalAmount;
      let fromDate;
      let endDate;
      fromDate = selectedStartDay;
      endDate = selectedEndDay;
      // if (timeFrame === "YEAR") {
      //   dateTime = selectedYear;
      // } else if (timeFrame === "MONTH") {
      //   dateTime = selectedMonth;
      // } else if (timeFrame === "DAY") {
      //   const time = new Date(selectedStartDay);
      //   time.setDate(time.getDate());
      //   // dateTime = time.toISOString();
      //   dateTime = selectedStartDay;
      // }

      const convertedData = boxData.map((item) => ({
        categoryId: item?.category,
        name: item?.eventTitle,
        expectAmount: item?.amount,
        priority: item?.eventColor,
      }));
      const usageMoneys = convertedData;
      if (!totalAmount || !currencyUnit) {
        setValidateMoneyPlan("Need to fill in all information!");
        return;
      }
      if (
        convertedData.some(
          (item) =>
            !item.categoryId ||
            !item.name ||
            !item.expectAmount ||
            !item.priority
        )
      ) {
        setValidateMoneyPlan("Need to fill in all information!");
        return;
      }
      const res = await createListMoneyPlan(
        expectAmount,
        currencyUnit,
        fromDate,
        endDate,
        usageMoneys,
        user.data?.accessToken,
        axoisJWT
      );
      if (res && res.status === 200 && res.data.msgCode === "SUCCESS") {
        toast.success("Create success!!");
        if (type === "DAY") {
          handleDayButtonClick("timeGridDAY");
        } else if (type === "MONTH") {
          handleDayButtonClick("dayGridMonth");
        } else if (type === "YEAR") {
          handleDayButtonClick("multiMonthYear");
        }
        setIsDelete(false);
        closeCreateDialog();
      }
      if (res && res.data.msgCode === "EXIST_MONEY_PLAN") {
        setErrorCreate("Money plan was exist!!");
        setValidateMoneyPlan("");
      }
      if (res && res.data.msgCode === "TOTAL_USAGE_MONEY_IS_TOO_LARGE") {
        setErrorCreate("Plan details is too large !!");
        setValidateMoneyPlan("");
      }
      if (res && res.data.msgCode === "EXPECT_AMOUNT_IS_NOT_ENOUGH") {
        setErrorCreate("Expect amount is not enough !!");
        setValidateMoneyPlan("");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(401);
        const timeoutDelay = 5000;

        toast.warning("Session expired. Logging out in 5 seconds.");

        setTimeout(() => {
          logOutUser(dispatch, navigate);
        }, timeoutDelay);
      }
    }
  };

  const handleAllDayChange = (e) => {
    setAllDay(e.target.checked);
  };

  // const test = async() => {
  //   let convertedData = [];
  //      let start = new Date(startDate);
  //          let day = start.getDate() - 1;
  //          let month = (start.getMonth() + 1).toString().padStart(2, "0");
  //          let year = start.getFullYear();
  //          if (day === 0) {
  //            const lastDayOfPreviousMonth = new Date(year, month - 1, 0);
  //            day = lastDayOfPreviousMonth.getDate();
  //            month = lastDayOfPreviousMonth.getMonth() + 1;
  //          }
  //          let dateStart = `${year}-${month}-${day
  //            .toString()
  //            .padStart(2, "0")}`;
  //         //  const inputDate = parseISO(dateStart);
  //         const inputDate = new Date(dateStart);
  //          let ends = new Date(endDate);
  //          let enddDay = ends.getDate();
  //          let endmMonth = (ends.getMonth() + 1).toString().padStart(2, "0");
  //          let endYear = ends.getFullYear();
  //          let dateEnd = `${endYear}-${endmMonth}-${enddDay
  //            .toString()
  //            .padStart(2, "0")}`;
  //          const inputDateEnd = new Date(dateEnd);
  //          let FromDate = encodeURIComponent(
  //            format(inputDate, "yyyy-MM-dd'T'23:59:00.000XXX", {
  //              timeZone: "+00:00",
  //            })
  //          );
  //          let ToDate = encodeURIComponent(
  //            format(inputDateEnd, "yyyy-MM-dd'T'23:59:00.000XXX", {
  //              timeZone: "+00:00",
  //            })
  //          );
  //          console.log(FromDate)
  //          let res = await getNote(FromDate, ToDate, user.data?.accessToken);
  //          if (res && res.data.msgCode === "SUCCESS") {
  //            res.data?.data.forEach((item) =>
  //              convertedData.push({
  //                id: item.id,
  //                title: item.title,
  //                start: item.fromDate,
  //                end: item.toDate,
  //                description: item.description,
  //                color: `#${item.color}`,
  //              })
  //            );
  //          }
  //          console.log(res)
  //          if (calendarRef.current) {
  //           const calendarApi = calendarRef.current.getApi();
  //           calendarApi.removeAllEvents();
  //           convertedData.map((item) => calendarApi.addEvent(item));
  //         }
  //         setCurrentEvents(convertedData);
  //        }

  const handleDayButtonClick = async (item) => {
    try {
      let convertedData = [];

      setExpectAmount("");
      if (item === "timeGridDay") {
        setType("DAY");
        calendarRef.current.getApi().changeView(item);
        setExpectAmount(0);
        setActualAmount(0);
        setUnit("");
        setIdUpdate(false);
      }

      if (item === "timeGridWeek") {
        setType("WEEK");
        setExpectAmount("");
        setTotalAmount("");
        calendarRef.current.getApi().changeView(item);
        setIdUpdate(false);
      }
      if (item === "dayGridMonth") {
        setType("MONTH");
        calendarRef.current.getApi().changeView(item);
        setExpectAmount(0);
        setActualAmount(0);
        setTotalAmount(0);
        setUnit("");
        setIdUpdate(false);
        if (calendarRef.current) {
          const calendarApi = calendarRef.current.getApi();
          calendarApi.removeAllEvents();
          convertedData = [];
          convertedData.map((item) => calendarApi.addEvent(item));
        }
      }

      if (item === "multiMonthYear") {
        setType("YEAR");
        calendarRef.current.getApi().changeView(item);
        setIdUpdate(false);
        setExpectAmount(0);
        setActualAmount(0);
        setTotalAmount(0);
        setUnit("");
      }

      if (item === "listYear") {
        calendarRef.current.getApi().changeView(item);
        setType("List");
      }

      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.removeAllEvents();
        setExpectAmount("");
        setActualAmount(0);
        setUnit("");
      }

      if (type === "DAY" || type === "MONTH" || type === "WEEK") {
        let start = new Date(startDate);
        let days = start.getDate() - 1;
        let months = (start.getMonth() + 1).toString().padStart(2, "0");
        let years = start.getFullYear();
        if (days === 0) {
          const lastDayOfPreviousMonth = new Date(years, months - 1, 0);
          days = lastDayOfPreviousMonth.getDate();
          months = lastDayOfPreviousMonth.getMonth() + 1;
        }
        let dateStart = `${years}-${months}-${days
          .toString()
          .padStart(2, "0")}`;
        const inputDate = new Date(dateStart);
        let ends = new Date(endDate);
        let enddDay = ends.getDate();
        let endmMonth = (ends.getMonth() + 1).toString().padStart(2, "0");
        let endYear = ends.getFullYear();
        let dateEnd = `${endYear}-${endmMonth}-${enddDay
          .toString()
          .padStart(2, "0")}`;
        const inputDateEnd = new Date(dateEnd);
        let FromDate = encodeURIComponent(
          format(inputDate, "yyyy-MM-dd'T'23:59:00.000XXX", {
            timeZone: "+00:00",
          })
        );
        let ToDate = encodeURIComponent(
          format(inputDateEnd, "yyyy-MM-dd'T'23:59:00.000XXX", {
            timeZone: "+00:00",
          })
        );
        let res = await getNote(
          FromDate,
          ToDate,
          user.data?.accessToken,
          axoisJWT
        );
        if (res && res.data.msgCode === "SUCCESS") {
          res.data?.data.forEach((item) =>
            convertedData.push({
              id: item.id,
              title: item.title,
              start: item.fromDate,
              end: item.toDate,
              description: item.description,
              color: `#${item.color}`,
            })
          );
        }
      }

      let res = await getMoneyPlanRangeType(
        type,
        startDate,
        endDate,
        user.data?.accessToken,
        axoisJWT
      );
      if (res && res.data?.msgCode === "SUCCESS") {
        setDataUpdate(res.data?.data);
        let end = new Date(endDate);
        const year = end.getFullYear();
        const month = String(end.getMonth() + 1).padStart(2, "0");
        const day = String(end.getDate() + 1).padStart(2, "0");
        let data = [];
        const nextDayString = `${year}-${month}-${day}`;
        let ctg, categoryId;
        setExpectAmount("");
        setActualAmount(0);
        setUnit("");
        const eventStartDate = new Date(startDate);
        const eventEndDate = new Date(endDate);
        const numberOfDays =
          (eventEndDate - eventStartDate) / (1000 * 3600 * 24);
        let sum = 0;
        console.log(res.data?.data);
        let totalExpectAmount = 0;
        let totalActualAmount = 0;

        res.data?.data.forEach((item) => {
          setUnit(item.currencyUnit);
          setIdUpdate(item.id);
          totalExpectAmount += item.expectAmount;
          totalActualAmount += item.actualAmount;
          item?.usageMoneys.forEach((i) => {
            ctg = categoriesList?.filter((j) => j?.name === i?.categoryName);

            ctg.forEach((item) => {
              categoryId = item.id;
            });
            data.push({
              id: `box-${i.name}-${item.date}}`,
              idMoney: item.id,
              title: i.name,
              start: item.date.split("T")[0],
              end: item.date.split("T")[0],
              color:
                i.expectAmount < i.actualAmount
                  ? "red"
                  : i.priority === 1
                  ? "#5cc9ff"
                  : i.priority === 2
                  ? "#41df95"
                  : "#919191b2",
              actualAmount: i.actualAmount,
              expectAmount: i.expectAmount,
              categoryId: categoryId,
              priority: i.priority === 1 ? 1 : i.priority === 2 ? 2 : 3,
            });
          });
        });

        setExpectAmount(totalExpectAmount);
        setTotalActualAmount(totalActualAmount);
        console.log(data);

        // res.data?.data.forEach((item) => {
        //   sum += item.expectAmount
        //   item?.usageMoneys.forEach((i, index) => {
        //     ctg = categoriesList?.filter((j) => j?.name === i?.categoryName);

        //     ctg.forEach((item) => {
        //       categoryId = item.id;
        //     });
        //     // item.forEach(i => {
        //     //   console.log(i)
        //     // })
        //        data.push({
        //         id: `box-${index}-${i.name}-${dateString}`,
        //         title: i.name,
        //         start: item.date,
        //         end: item.date,
        //         color:
        //           i.expectAmount < i.actualAmount
        //             ? "red"
        //             : i.priority === 1
        //             ? "#039BE5"
        //             : i.priority === 2
        //             ? "#33B679"
        //             : "#919191b2",
        //         actualAmount: i.actualAmount,
        //         expectAmount: i.expectAmount,
        //         categoryId: categoryId,
        //         priority: i.priority === 1 ? 1 : i.priority === 2 ? 2 : 3,
        //       });

        // for (
        //   let date = new Date(eventStartDate);
        //   date <= eventEndDate;
        //   date.setDate(date.getDate() + 1)
        // ) {
        //   const year = date.getFullYear();
        //   const month = String(date.getMonth() + 1).padStart(2, "0");
        //   const day = String(date.getDate()).padStart(2, "0");
        //   const dateString = `${year}-${month}-${day}`;
        //   const numberOfDays =
        //     (eventEndDate - eventStartDate) / (1000 * 3600 * 24) + 1;

        //   // Tính toán actualAmount và expectAmount cho mỗi ngày
        //   const dailyActualAmount = i.actualAmount / numberOfDays;
        //   const dailyExpectAmount = i.expectAmount / numberOfDays;
        //   data.push({
        //     id: `box-${index}-${i.name}-${dateString}`,
        //     title: i.name,
        //     start: item.date,
        //     end: item.date,
        //     color:
        //       i.expectAmount < i.actualAmount
        //         ? "red"
        //         : i.priority === 1
        //         ? "#039BE5"
        //         : i.priority === 2
        //         ? "#33B679"
        //         : "#919191b2",
        //     actualAmount: dailyActualAmount,
        //     expectAmount: dailyExpectAmount,
        //     categoryId: categoryId,
        //     priority: i.priority === 1 ? 1 : i.priority === 2 ? 2 : 3,
        //   });
        // }
        //   });

        //     totalExpectAmount += item.expectAmount
        //   console.log(item.expectAmount)

        //   setUnit(item.currencyUnit);
        //   setIdUpdate(item.id);
        // });
        let totalActual = 0;
        console.log(sum);
        data?.forEach((item) => {
          convertedData.push(item);
          // totalActual = totalActual + item.actualAmount;
          // console.log("check", totalActual);
        });
        // setActualAmount(parseFloat(totalActual.toFixed(2)));
        setDataPlan(data);

        if (calendarRef.current) {
          const calendarApi = calendarRef.current.getApi();
          calendarApi.removeAllEvents();
          convertedData.map((item) => calendarApi.addEvent(item));
        }
        setCurrentEvents(convertedData);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(401);
        // const timeoutDelay = 5000;

        // toast.warning("Session expired. Logging out in 5 seconds.");

        // setTimeout(() => {
        //   logOutUser(dispatch, navigate);
        // }, timeoutDelay);
      }
    }
  };

  useEffect(() => {
    const calendarApi = calendarRef.current.getApi();
    const handleDateSet = (info) => {
      const view = info.view;
      const startDate = info.start;
      const endDate = info.end;

      if (view.type === "dayGridMonth") {
        setType("MONTH");
        if (startDate.getDate() !== 1) {
          // Đặt startDate thành ngày đầu tiên của tháng tiếp theo
          let end = new Date(endDate);
          const date = addMonths(startOfMonth(startDate), 1);
          const formattedStartDate = format(date, "yyyy-MM-dd");
          const formattedEndDate = format(end.setDate(0), "yyyy-MM-dd");
          setStartDate(formattedStartDate);
          setEndDate(formattedEndDate);
          setSelectedStartDay(formattedStartDate);
          setSelectedEndDay(formattedEndDate);
          return;
        } else {
          let end = new Date(endDate);
          const formattedStartDate = format(startDate, "yyyy-MM-dd");
          const formattedEndDate = format(end.setDate(0), "yyyy-MM-dd");
          setStartDate(formattedStartDate);
          setEndDate(formattedEndDate);
          setSelectedStartDay(formattedStartDate);
          setSelectedEndDay(formattedEndDate);
        }
      } else if (view.type === "timeGridDay") {
        const formattedStartDate = format(startDate, "yyyy-MM-dd");
        const formattedEndDate = format(startDate, "yyyy-MM-dd");
        setStartDate(formattedStartDate);
        setEndDate(formattedEndDate);
        setSelectedStartDay(formattedStartDate);
        setSelectedEndDay(formattedEndDate);
      } else if (view.type === "listYear") {
        console.log(startDate, endDate);
        const formattedStartDate = format(startDate, "yyyy-MM-dd");
        const formattedEndDate = format(endDate, "yyyy-MM-dd");
        setStartDate(formattedStartDate);
        setEndDate(formattedEndDate);
        setSelectedStartDay(formattedStartDate);
        setSelectedEndDay(formattedEndDate);
      } else {
        const formattedStartDate = format(startDate, "yyyy-MM-dd");
        const formattedEndDate = format(endDate, "yyyy-MM-dd");
        setStartDate(formattedStartDate);
        setEndDate(formattedEndDate);
        setSelectedStartDay(formattedStartDate);
        setSelectedEndDay(formattedEndDate);
      }
    };

    console.log(type);

    if (type === "DAY") {
      handleDayButtonClick("timeGridDay");
    }
    if (type === "MONTH") {
      handleDayButtonClick("dayGridMonth");
      // test()
    }
    if (type === "YEAR") {
      handleDayButtonClick("multiMonthYear");
    }
    if (type === "WEEK") {
      handleDayButtonClick("timeGridWeek");
    }

    calendarApi.on("datesSet", handleDateSet);

    return () => {
      calendarApi.off("datesSet", handleDateSet);
    };
  }, [startDate, endDate, type]);

  const handleUpdatePlan = async (id) => {
    setCheckUpdate(true);
    setSelectedStartDay(new Date(startDate));
    setSelectedMonth(new Date(startDate));
    setSelectedYear(new Date(startDate));
    if (!isDialogOpenCreate) {
      openCreateDialog();
    }
    console.log("id", id);
    let checkctg, ctgId;
    let res = await getMoneyPlanById(id, user.data?.accessToken, axoisJWT);

    if (res && res.data.result) {
      console.log("test", res.data.data);
      setIdUpdate(res.data.data.id);
      setTotalAmount(res.data.data.expectAmount);
      setCurrencyUnit(res.data.data.currencyUnit);
      // setSelectedStartDay(new Date());
      // setSelectedMonth(res.data.data.date);
      // setSelectedYear(res.data.data.date);
      // setSelectedEndDay(res.data.data.date)
      const updatedBoxData = res.data.data.usageMoneys.map(
        (usageMoney) => (
          (checkctg = categoriesList.filter(
            (item) => item.name === usageMoney.categoryName
          )),
          checkctg.map((item) => (ctgId = item.id)),
          {
            eventTitle: usageMoney.name,
            amount: usageMoney.expectAmount,
            eventColor: usageMoney.priority,
            category: ctgId,
            actualAmount: usageMoney.actualAmount,
          }
        )
      );
      setBoxData(updatedBoxData);
    }
  };

  const handleDeletePlan = async () => {
    setPopupOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const moneyPlanId = idUpdate;
      let res = await deletePlan(moneyPlanId, user.data?.accessToken, axoisJWT);
      if (res && res.data.msgCode === "SUCCESS") {
        toast.success("Delete success!!");
        setActualAmount(0);
        if (type === "DAY") {
          handleDayButtonClick("timeGridDAY");
        } else if (type === "MONTH") {
          handleDayButtonClick("dayGridMonth");
        } else if (type === "WEEK") {
          handleDayButtonClick("timeGridWeek");
        }
        setIsDelete(true);
        setPopupOpen(false);
        closeCreateDialog();
      } else {
        toast.error("Delete failed!!");
        setIsDelete(false);
        setPopupOpen(false);
      }
    } catch (error) {
      // if (error.response.status === 401) {
      //   console.log(401);
      //   const timeoutDelay = 5000;
      //   toast.warning("Session expired. Logging out in 5 seconds.");
      //   setTimeout(() => {
      //     logOutUser(dispatch, navigate);
      //   }, timeoutDelay);
      // }
    }
  };

  const handleDeleteCancel = () => {
    setPopupOpen(false);
  };

  const handleUpdateMoneyPlan = async () => {
    try {
      const type = timeFrame;
      const expectAmount = totalAmount;
      let date, month, year;
      if (timeFrame === "YEAR") {
        const time = new Date(selectedYear);
        date = time.getDate();
        month = time.getMonth() + 1;
        year = time.getFullYear();
      } else if (timeFrame === "MONTH") {
        const time = new Date(selectedMonth);
        date = time.getDate();
        month = time.getMonth() + 1;
        year = time.getFullYear();
      } else if (timeFrame === "DAY") {
        const time = new Date(selectedStartDay);
        date = time.getDate();
        month = time.getMonth() + 1;
        year = time.getFullYear();
      }

      if (expectAmount < actualAmount) {
        toast.warning("Actual money is higher than expected money");
      }
      const id = idUpdate;

      const usage = boxData.map((item, index) => ({
        categoryId: item.category,
        name: item.eventTitle,
        expectAmount: item.amount,
        actualAmount: item.actualAmount,
        priority: item.eventColor,
      }));
      let res = await updateMoneyPlan(
        id,
        type,
        "null",
        date,
        month,
        year,
        expectAmount,
        actualAmount,
        currencyUnit,
        usage,
        user.data?.accessToken,
        axoisJWT
      );
      if (res && res.data.msgCode === "SUCCESS") {
        toast.success("Update success!!");
        setCheckUpdate(false);
        handleDayButtonClick();
        // if (type === "DAY") {
        //   handleDayButtonClick("timeGridDAY");
        // } else if (type === "MONTH") {
        //   handleDayButtonClick("dayGridMonth");
        // } else if (type === "YEAR") {
        //   handleDayButtonClick("multiMonthYear");
        // }
        // if (type === "DAY") {
        //   handleDayButtonClick("timeGridDAY");
        // } else if (type === "MONTH") {
        //   handleDayButtonClick("dayGridMonth");
        // } else if (type === "YEAR") {
        //   handleDayButtonClick("multiMonthYear");
        // }
        setIsDelete(false);
        closeCreateDialog();
      } else {
        toast.error("Update failed!!!");
      }
      if (res && res.data.msgCode === "TOTAL_USAGE_MONEY_IS_TOO_LARGE") {
        setErrorCreate("Plan details is too large !!");
        setValidateMoneyPlan("");
      }
      if (res && res.data.msgCode === "EXPECT_AMOUNT_IS_NOT_ENOUGH") {
        setErrorCreate("Expect amount is not enough !!");
        setValidateMoneyPlan("");
      }
    } catch (error) {
      // if (error.response.status === 401) {
      //   console.log(401);
      //   const timeoutDelay = 5000;
      //   toast.warning("Session expired. Logging out in 5 seconds.");
      //   setTimeout(() => {
      //     logOutUser(dispatch, navigate);
      //   }, timeoutDelay);
      // }
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleAddNote = async () => {
    try {
      if (!user?.data) {
        setLogin(true);
        return;
      }
      let title = eventTitle;
      let color = selectedColor?.hex;
      let fromDate = format(dayStart, "yyyy-MM-dd");
      let toDate = format(dayEnd, "yyyy-MM-dd");
      if (!allDay) {
        fromDate = format(timeStart, "yyyy-MM-dd'T'HH:mm:ss");
        toDate = format(timeEnd, "yyyy-MM-dd'T'HH:mm:ss");
      }

      if (!eventTitle || !selectedColor) {
        setValidateNote("Need to fill in title and color!");
        return;
      }

      if (fromDate > toDate) {
        setValidateNote("Start time is less than end time");
        return;
      }
      let res = await createNote(
        title,
        description,
        color,
        fromDate,
        toDate,
        user.data?.accessToken,
        axoisJWT
      );
      if (res && res.data.msgCode === "SUCCESS") {
        toast.success("Create Success!!");
        if (type === "DAY") {
          handleDayButtonClick("timeGridDAY");
        } else if (type === "MONTH") {
          handleDayButtonClick("dayGridMonth");
        } else if (type === "WEEK") {
          handleDayButtonClick("multiMonthYear");
        }
        closeDialog();
      } else {
        toast.error("failed!!!");
      }
    } catch (error) {
      // if (error.response.status === 401) {
      //   console.log(401);
      //   const timeoutDelay = 5000;
      //   toast.warning("Session expired. Logging out in 5 seconds.");
      //   setTimeout(() => {
      //     logOutUser(dispatch, navigate);
      //   }, timeoutDelay);
      // }
    }
  };

  const handleUpdateNote = async () => {
    try {
      let id = idNote;
      let title = eventTitle;
      let color;
      if (selectedColor.hex) {
        color = selectedColor.hex;
      } else {
        color = colorUpdate.slice(1);
      }

      let fromDate = dayStart;
      let toDate = dayEnd;
      if (!allDay) {
        fromDate = dayjs(timeStart).format("YYYY-MM-DDTHH:mm:ss");

        toDate = dayjs(timeEnd).format("YYYY-MM-DDTHH:mm:ss");
      }

      if (fromDate > toDate) {
        setValidateNote("Start time is less than end time");
        return;
      }

      let res = await updateNote(
        id,
        title,
        description,
        color,
        fromDate,
        toDate,
        user.data?.accessToken,
        axoisJWT
      );
      if (res && res.data.msgCode === "SUCCESS") {
        toast.success("Update success!!");
        if (type === "DAY") {
          handleDayButtonClick("timeGridDAY");
        } else if (type === "MONTH") {
          handleDayButtonClick("dayGridMonth");
        } else if (type === "WEEK") {
          handleDayButtonClick("timeGridWeek");
        }
        closeDialog();
      } else {
        toast.error("Update failed!!");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(401);
        const timeoutDelay = 5000;

        toast.warning("Session expired. Logging out in 5 seconds.");

        setTimeout(() => {
          logOutUser(dispatch, navigate);
        }, timeoutDelay);
      }
    }
  };

  const handleUpdateNoteDrop = async (
    id,
    title,
    color,
    description,
    fromDate,
    toDate
  ) => {
    try {
      let res = await updateNote(
        id,
        title,
        description,
        color,
        fromDate,
        toDate,
        user.data?.accessToken,
        axoisJWT
      );
      if (res && res.data.msgCode === "SUCCESS") {
        toast.success("Update success!!");
        if (type === "DAY") {
          handleDayButtonClick("timeGridDAY");
        } else if (type === "MONTH") {
          handleDayButtonClick("dayGridMonth");
        } else if (type === "WEEK") {
          handleDayButtonClick("timeGridWeek");
        }
        closeDialog();
      } else {
        toast.error("Update failed!!");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(401);
        const timeoutDelay = 5000;

        toast.warning("Session expired. Logging out in 5 seconds.");

        setTimeout(() => {
          logOutUser(dispatch, navigate);
        }, timeoutDelay);
      }
    }
  };

  const handleDeleteNote = async () => {
    try {
      let id = idNote;
      let res = await deleteNote(id, user.data?.accessToken, axoisJWT);
      if (res && res.data.msgCode === "SUCCESS") {
        toast.success("Delete success!!");
        if (type === "DAY") {
          handleDayButtonClick("timeGridDAY");
        } else if (type === "MONTH") {
          handleDayButtonClick("dayGridMonth");
        } else if (type === "WEEK") {
          handleDayButtonClick("timeGridWeek");
        }
        setIsPopoverNote(false);
        closeDialog();
      } else {
        toast.error("Delete Failed!!");
      }
    } catch (error) {
      // if (error.response.status === 401) {
      //   console.log(401);
      //   const timeoutDelay = 5000;
      //   toast.warning("Session expired. Logging out in 5 seconds.");
      //   setTimeout(() => {
      //     logOutUser(dispatch, navigate);
      //   }, timeoutDelay);
      // }
    }
  };

  const handleEventDrop = async (eventDropInfo) => {
    const { event } = eventDropInfo;
    let id = event.id;
    let title = event.title;
    let color = event.backgroundColor.slice(1);
    let description = event.extendedProps.description;
    let fromDate = format(event.start, "yyyy-MM-dd'T'HH:mm:ss");
    let toDate = format(event?.end, "yyyy-MM-dd'T'HH:mm:ss");
    console.log("toddate", event);
    handleUpdateNoteDrop(id, title, color, description, fromDate, toDate);
  };

  const handleEventResize = async (eventResizeInfo) => {
    const { event } = eventResizeInfo;
    let id = event.id;
    let title = event.title;
    let color = event.backgroundColor.slice(1);
    let description = event.extendedProps.description;
    let fromDate = format(event.start, "yyyy-MM-dd'T'HH:mm:ss");
    let toDate = format(event.end, "yyyy-MM-dd'T'HH:mm:ss");
    handleUpdateNoteDrop(id, title, color, description, fromDate, toDate);
  };

  const updateCategory = (e) => {
    setIsUpdateCate(true);
    setIsOpenCreateCategory(true);
    setCreateCategory(e.name);
    setSelectedCategory(e);
  };

  const handleUpdateCategory = async () => {
    try {
      if (selectedCategory) {
        let updatedCategoriesList = {
          id: selectedCategory.id,
          name: createCategory,
          isDefault: true,
        };

        const categories = categoriesList.map((event) =>
          event.id === selectedCategory.id ? updatedCategoriesList : event
        );
        let res = await updateCategories(
          categories,
          user.data?.accessToken,
          axoisJWT
        );
        if (res && res.data.msgCode === "SUCCESS") {
          toast.success("Update success!!");
          getCategory();
          setSelectedCategory(null);
          setIsUpdateCate(false);
          closeDialog();
        } else {
          toast.error("Update failed!!");
        }
      }
    } catch (error) {
      // if (error.response.status === 401) {
      //   console.log(401);
      //   const timeoutDelay = 5000;
      //   toast.warning("Session expired. Logging out in 5 seconds.");
      //   setTimeout(() => {
      //     logOutUser(dispatch, navigate);
      //   }, timeoutDelay);
      // }
    }
  };

  const handleAddCategory = async () => {
    try {
      let categories = [
        {
          name: createCategory,
          isDefault: false,
        },
      ];
      if (!createCategory) {
        setValidateCategory("Need to fill in all information");
        return;
      }
      categoriesList.forEach((item) => {
        categories.push(item);
      });
      let res = await updateCategories(
        categories,
        user.data?.accessToken,
        axoisJWT
      );
      if (res && res.data.msgCode === "SUCCESS") {
        toast.success("Update success!!");
        getCategory();
        closeDialog();
      } else {
        toast.error("Update failed!!");
      }
    } catch (error) {
      // if (error.response.status === 401) {
      //   console.log(401);
      //   const timeoutDelay = 5000;
      //   toast.warning("Session expired. Logging out in 5 seconds.");
      //   setTimeout(() => {
      //     logOutUser(dispatch, navigate);
      //   }, timeoutDelay);
      // }
    }
  };

  const handleDeleteNoteCancel = () => {
    setIsPopoverNote(false);
    setLogin(false);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const [isHovering, setIsHovering] = useState(false);
  const [hoveredEvent, setHoveredEvent] = useState(null);

  const EventDetail = ({ event }) => {
    console.log(event.title);
    return (
      <div
        style={{
          position: "absolute",
          top: event.clientY,
          left: event.clientX,
          background: "#cccc",
          padding: "10px",
          width: "1000px",
          height: "1000px",
        }}
      >
        {/* Hiển thị thông tin chi tiết của sự kiện */}
        {/* Ví dụ: */}
        <div>{event.title}</div>
        {/* <div>{event.start}</div>  */}
      </div>
    );
  };

  // const handleEventMouseEnter = (arg) => {
  //   setIsHovering(true);
  //   setHoveredEvent(arg.event);
  // };

  // const handleEventMouseLeave = () => {
  //   setIsHovering(false);
  //   setHoveredEvent(null);
  // };

  let popupTimeout;
  let currentPopup = null;

  const handleEventMouseEnter = (event) => {
    // Hiển thị popup khi hover vào sự kiện
    if (currentPopup) {
      currentPopup.remove();
      currentPopup = null;
    }

    console.log(event.event);

    // Tạo phần tử cho tiêu đề sự kiện
    const colors = document.createElement("div");
    colors.classList.add("color-title");
    colors.style.backgroundColor =
      event.event?.extendedProps?.priority === 1
        ? "#94d4f490"
        : event.event?.extendedProps?.priority === 2
        ? "#41df95"
        : "#919191b2";

    const titleText = document.createElement("div");
    titleText.classList.add("title-text");
    titleText.innerText = event.event.title;

    const title = document.createElement("div");
    title.classList.add("popup-title");

    const titleChild = document.createElement("div");
    titleChild.classList.add("title-child");

    title.appendChild(colors);
    title.appendChild(titleChild);

    const eventDate = new Date(event.event.start);

    // Định dạng ngày trong tuần
    const options = { weekday: "long" };
    const weekday = eventDate.toLocaleDateString("en-US", options);

    // Định dạng tháng
    const month = eventDate.toLocaleDateString("en-US", { month: "long" });

    // Lấy ngày trong tháng
    const day = eventDate.getDate();

    // Kết hợp thành chuỗi định dạng mong muốn
    const formattedDate = `${weekday}, ${month} ${day}`;

    const time = document.createElement("div");
    time.classList.add("popup-time");
    time.innerText = formattedDate;

    titleChild.appendChild(titleText);
    titleChild.appendChild(time);

    const actual = document.createElement("div");
    actual.classList.add("popup-money");
    actual.innerText = "Actual: " + event.event?.extendedProps?.actualAmount;

    const expect = document.createElement("div");
    expect.classList.add("popup-money");
    expect.innerText = "Expect: " + event.event?.extendedProps?.expectAmount;

    const priority = document.createElement("div");
    priority.classList.add("popup-priority");
    priority.innerText =
      "Priority: " +
      (event.event?.extendedProps?.priority === 1
        ? "Highly"
        : event.event?.extendedProps?.priority === 2
        ? "Medium"
        : "Normal");

    const popup = document.createElement("div");
    popup.classList.add("event-popup");

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    // Tạo phần tử cho nút chỉnh sửa
    const editButton = document.createElement("div");
    const editIcon = <EditIcon />;
    ReactDOM.render(editIcon, editButton);
    editButton.classList.add("action-button");
    editButton.addEventListener("click", () => {
      if (
        !event.event?.extendedProps?.actualAmount &&
        !event.event?.extendedProps?.expectAmount
      ) {
        setIsOpenCreateNote(true);
        popup.remove();
      } else {
        openDialog();
        popup.remove();
      }
    });

    // Tạo phần tử cho nút đóng popup
    const closeButton = document.createElement("div");
    const closeIcon = <CloseIcon />;
    ReactDOM.render(closeIcon, closeButton);
    closeButton.classList.add("action-button");
    closeButton.addEventListener("click", () => {
      // Đóng popup khi nút được click
      setIsVisible(false);
      popup.remove();
    });

    const notifys = document.createElement("div");
    notifys.classList.add("notifys-container");

    const notifyIcon = document.createElement("div");
    notifyIcon.classList.add("notify-icon");
    const iconNotify = <NotificationsNoneIcon />;

    ReactDOM.render(iconNotify, notifyIcon);

    const notifyText = document.createElement("div");
    notifyText.classList.add("notify-text");
    notifyText.innerText = "30 minutes";

    notifys.appendChild(notifyIcon);
    notifys.appendChild(notifyText);

    // Thêm các phần tử vào popup
    buttonContainer.appendChild(editButton);
    if (
      !event.event?.extendedProps?.actualAmount &&
      !event.event?.extendedProps?.expectAmount
    ) {
      const deleteButton = document.createElement("div");
      const deleteIcon = <DeleteIcon />;
      ReactDOM.render(deleteIcon, deleteButton);
      deleteButton.classList.add("action-button");
      deleteButton.addEventListener("click", () => {
        setIsPopoverNote(true);
      });
      buttonContainer.appendChild(deleteButton);
    }
    buttonContainer.appendChild(closeButton);
    popup.appendChild(buttonContainer);
    popup.appendChild(title);
    // popup.appendChild(time);
    if (
      event.event?.extendedProps?.actualAmount &&
      event.event?.extendedProps?.expectAmount
    ) {
      popup.appendChild(actual);
      popup.appendChild(expect);
      popup.appendChild(priority);
    } else {
      popup.appendChild(notifys);
    }

    // Đặt vị trí top và left của popup
    popup.style.top = `${event.el.getBoundingClientRect().top}px`;
    popup.style.left = `${event.el.getBoundingClientRect().left - 260}px`;

    document.body.appendChild(popup); // Thêm popup vào body để đảm bảo nó hiển thị trên các phần khác
    currentPopup = popup;
    document.addEventListener("click", (e) => {
      if (!popup.contains(e.target) && !event.el.contains(e.target)) {
        setIsVisible(false);
        popup.remove();
      }
    });
  };

  const handleEventMouseLeave = (event) => {
    // Ẩn popup khi rời chuột khỏi sự kiện
    // const popup = document.querySelector('.event-popup');
    // if (popup) {
    //   popup.remove();
    // }
    clearTimeout(popupTimeout);
  };

  const handleDeleteCategory = async () => {
    if (selectedCategory) {
      let res = await deleteCategories(
        selectedCategory.id,
        user.data?.accessToken,
        axoisJWT
      );
      if (res && res.data.result) {
        getCategory();
        setIsDeleteCategory(false);
        setIsOpenCreateCategory(false);
      }
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeView = (view) => {
    calendarRef.current.getApi().changeView(view);
    handleDayButtonClick(view);
    handleClose();
  };

  return (
    <Box m="10px 20px 0 20px">
      <Box
        display={isSmallScreen ? "block" : "flex"}
        justifyContent="space-between"
      >
        {/* CALENDAR SIDEBAR */}

        <Box
          flex="1 1 20%"
          // backgroundColor={colors.boxList[100]}
          // p="10px"
          marginRight={isSmallScreen ? "0px" : "15px"}
          marginBottom={isSmallScreen ? "10px" : "0px"}
          borderRadius="10px"
          width={isSmallScreen ? "100%" : "250px"}
          height="100%"
        >
          <Box
            boxShadow="0px 5px 15px rgba(0, 0, 0, 0.1)"
            // backgroundColor={colors.boxList[100]}
            backgroundColor={colors.boxDashboard[100]}
            borderRadius="10px"
            padding="15px"
          >
            <Box
              display={isSmallScreen ? "flex" : ""}
              justifyContent="space-between"
            >
              <Button
                variant="contained"
                // color="success"
                onClick={handleCreatePlan}
                style={{
                  marginBottom: "20px",
                  fontSize: "14px",
                  fontWeight: "500",
                  borderRadius: "10px",
                  boxShadow: "2px 2px 1px soild #ccc",
                  backgroundColor: `${colors.greenAccent[500]}`,
                }}
              >
                <AddIcon />
                Create
              </Button>
              {isSmallScreen ? (
                <>
                  <Button
                    variant="contained"
                    // color="success"
                    onClick={() => {
                      setTimeStart();
                      setTimeEnd();
                      setIsOpenCreateNote(true);
                    }}
                    style={{
                      marginBottom: "20px",
                      fontSize: "14px",
                      fontWeight: "500",
                      borderRadius: "10px",
                      boxShadow: "2px 2px 1px soild #ccc",
                      backgroundColor: "#1dd2ff",
                      marginLeft: "10px",
                    }}
                  >
                    {/* <AddIcon /> */}
                    Note
                  </Button>
                  <Button
                    variant="contained"
                    // color="success"
                    onClick={() => setIsCategorySmall(true)}
                    style={{
                      marginBottom: "20px",
                      fontSize: "14px",
                      fontWeight: "500",
                      borderRadius: "10px",
                      boxShadow: "2px 2px 1px soild #ccc",
                      backgroundColor: "#ff8ce4",
                      marginLeft: "10px",
                    }}
                  >
                    {/* <AddIcon /> */}
                    Category
                  </Button>
                </>
              ) : (
                <></>
              )}
            </Box>
            <Typography variant="h5" sx={{ fontWeight: "550" }}>
              <span>Expect: </span>{" "}
              <span style={{ color: "#38c171" }}>
                {" "}
                {expectAmount
                  ? numberWithCommas(parseFloat(expectAmount).toFixed(2))
                  : 0}{" "}
                {unit}
              </span>
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: "550", marginTop: "15px" }}
            >
              Actual:{" "}
              <span
                style={{
                  color:
                    parseFloat(parseFloat(expectAmount).toFixed(2)) <
                    parseFloat(parseFloat(totalActucalAmount).toFixed(2))
                      ? "red"
                      : "#38c171",
                }}
              >
                {totalActucalAmount
                  ? numberWithCommas(parseFloat(totalActucalAmount).toFixed(2))
                  : 0}{" "}
                {unit}{" "}
              </span>
            </Typography>
          </Box>
          <Box
            boxShadow="0px 5px 15px rgba(0, 0, 0, 0.1)"
            // backgroundColor={colors.boxList[100]}
            backgroundColor={colors.boxDashboard[100]}
            borderRadius="10px"
            padding="5px 15px 5px 15px"
            marginTop="10px"
            display={isSmallScreen ? "none" : "block"}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                // marginTop: "5px",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "550" }}>
                Categories:
              </Typography>
              <Box>
                <Tooltip title="Add Category" placement="top-end">
                  <IconButton>
                    <AddIcon
                      onClick={() => setIsOpenCreateCategory(true)}
                      sx={{ fontSize: 25 }}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Toggle Category" placement="top-end">
                  <IconButton onClick={toggleList}>
                    {isListOpen ? (
                      <KeyboardArrowUpIcon sx={{ fontSize: 25 }} />
                    ) : (
                      <KeyboardArrowDownIcon sx={{ fontSize: 25 }} />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Collapse in={isListOpen} timeout="auto">
              <List
                sx={{
                  height: "63vh",
                  overflow: "auto",
                }}
              >
                {categoriesList?.map((event) => (
                  <ListItem
                    key={event.id}
                    sx={{
                      // backgroundColor: `${colors.listCategory[100]}`,
                      margin: "0px 0px 0px 0px",
                      borderRadius: "5px",
                      // color: "#790e61",
                      color: colors.iconTopbar[100],
                    }}
                  >
                    <FiberManualRecordIcon
                      fontSize="sm"
                      sx={{ paddingRight: "5px" }}
                    />
                    <ListItemText
                      primaryTypographyProps={{ variant: "h6" }}
                      primary={event.name}
                    />
                    <IconButton
                      aria-describedby={id}
                      onClick={() => updateCategory(event)}
                      // onClick={handleClickCategory}
                    >
                      <MoreVertIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Box>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl1}
            onClose={handleCloseCategory}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuList>
              <MenuItem onClick={() => updateCategory(event)}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit category</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => setIsDeleteCategory(true)}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
            </MenuList>
          </Popover>
        </Box>

        {/* CALENDAR */}
        <Box
          flex={isSmallScreen ? "100%" : "1 1 100%"}
          ml="0px"
          boxShadow="0px 5px 15px rgba(0, 0, 0, 0.1)"
          backgroundColor={colors.boxDashboard[100]}
          borderRadius="10px"
          padding="8px 10px 0px 10px"
          sx={{
            ".fc .fc-daygrid-day-number": {
              padding: "1px",
              color: colors.iconTopbar[100],
            },
            ".fc .fc-col-header-cell-cushion": {
              color: colors.iconTopbar[100],
            },
            ".fc-theme-standard .fc-scrollgrid": {
              border: `1px solid ${colors.tableCalendar[100]}`,
            },
            ".fc-theme-standard td, .fc-theme-standard th": {
              border: `1px solid ${colors.tableCalendar[100]}`,
            },
            ".fc .fc-button-primary": {
              backgroundColor: colors.buttonsCalendar[100],
              borderColor: colors.borderCalendar[100],
              borderRadius: " 8px",
              color: colors.colorButonCalendar[100],
            },
            ".fc .fc-daygrid-day-top": {
              margin: "0 auto",
            },
            ".fc-event-title ": {
              fontSize: "12px",
            },
            ".fc .fc-daygrid-day-events": {
              marginTop: "2px",
            },
            ".fc .fc-daygrid-event-harness": {
              margin: "0 5px 1.7px 5px",
            },
            ".fc-v-event .fc-event-main-frame": {
              padding: "2px 0 0 5px",
            },
          }}
        >
          <FullCalendar
            ref={calendarRef}
            height="90vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
              multiMonthPlugin,
            ]}
            headerToolbar={{
              left: "prev today next",
              center: "title",
              right: "MonthButton,WeekButton,dayButton",
            }}
            initialView="timeGridDay"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            eventDrop={handleEventDrop}
            select={handleDateClick}
            eventClick={handleEventClick}
            eventResize={handleEventResize}
            // eventMouseEnter={handleEventMouseEnter}
            // eventMouseLeave={handleEventMouseLeave}
            // eventDidMount={(arg) => {
            //   arg.el.addEventListener('mouseenter', () => handleEventMouseEnter(arg));
            //   arg.el.addEventListener('mouseleave', () => handleEventMouseLeave(arg));
            // }}
            eventsSet={(events) => setCurrentEvents(events)}
            initialEvents={mock}
            customButtons={{
              dayButton: {
                text: "Day",
                click: () => handleDayButtonClick("timeGridDay"), // Liên kết sự kiện click của nút "Day" với hàm xử lý
              },
              YearButton: {
                text: "Year",
                click: () => handleDayButtonClick("multiMonthYear"), // Liên kết sự kiện click của nút "Day" với hàm xử lý
              },
              MonthButton: {
                text: "Month",
                click: () => handleDayButtonClick("dayGridMonth"), // Liên kết sự kiện click của nút "Day" với hàm xử lý
              },
              ListButton: {
                text: "List",
                click: () => handleDayButtonClick("listYear"), // Liên kết sự kiện click của nút "Day" với hàm xử lý
              },
              WeekButton: {
                text: "Week",
                click: () => handleDayButtonClick("timeGridWeek"),
              },
            }}
            views={{
              listMonth: {
                buttonText: "List",
              },
              timeGridDay: {
                buttonText: "Day",
              },
              timeGridWeek: {
                buttonText: "Week",
              },
              dayGridMonth: {
                buttonText: "Month",
                // showNonCurrentDates: false,
              },
              multiMonthYear: {
                buttonText: "Year",
                dayMaxEventRows: 6,
                multiMonthMaxColumns: 1,
              },
            }}
          />
          {isHovering && <EventDetail event={hoveredEvent} />}
        </Box>
      </Box>

      {/* create plan dialog */}
      <Dialog
        maxWidth="lg"
        open={isDialogOpenCreate}
        onClose={closeCreateDialog}
      >
        <Box p={2}>
          <Typography
            variant="h3"
            style={{ marginBottom: "10px", fontWeight: "500" }}
          >
            {checkUpdate ? "Update Plans" : "Create Plans"}
          </Typography>
          <p style={{ color: "red" }}>{errorCreate}</p>
          <p style={{ color: "red" }}>{validateMoneyPlan}</p>
          <TextField
            label="Total amount"
            type="number"
            //autoFocus
            readOnly
            disabled
            // disabled={checkUpdate}
            value={parseFloat(totalAmount).toFixed(2)}
            onChange={(e) => setTotalAmount(e.target.value)}
            style={{
              width: `${checkUpdate ? "45%" : "73%"}`,
              margin: "10px 10px 20px 0",
            }}
          />
          {checkUpdate ? (
            <>
              <TextField
                label="Actual amount"
                type="number"
                disabled
                readOnly
                value={parseFloat(actualAmount).toFixed(2)}
                onChange={(e) => setActualAmount(e.target.value)}
                style={{ width: "25%", margin: "10px 10px 20px 0" }}
              />
            </>
          ) : (
            <></>
          )}
          <TextField
            label="Currency unit"
            type="text"
            value={currencyUnit}
            // disabled={checkUpdate}
            onChange={(e) => setCurrencyUnit(e.target.value)}
            style={{ width: "25%", marginTop: "10px", marginBottom: "20px" }}
          />
          {!checkUpdate && (
            <Box style={{ display: "flex", marginBottom: "10px" }}>
              <div style={{ marginRight: "10px" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="From"
                    value={dayjs(selectedStartDay)}
                    onChange={(date) => setSelectedStartDay(new Date(date))}
                  />
                </LocalizationProvider>
              </div>
              <div style={{ marginRight: "10px" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="To"
                    value={dayjs(selectedEndDay)}
                    onChange={(date) => setSelectedEndDay(new Date(date))}
                  />
                </LocalizationProvider>
              </div>
            </Box>
          )}
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <Typography variant="h5">Plan Details</Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleSuggestion}
              style={{ marginLeft: "10px" }}
            >
              Suggestion
            </Button>
            <Button
              variant="outlined"
              color="success"
              onClick={handleAddBox}
              style={{ marginLeft: "10px" }}
            >
              ADD Plan Detail
            </Button>
          </Box>

          {/* {errorText && totalSuggest ? <p style={{ color: "red" }}>{errorText} aaaa</p> : ""} */}
          {showConfirmation && totalAmountInBoxes > totalAmount && (
            <div style={{ display: "flex" }}>
              <p style={{ color: "red", marginRight: "10px" }}>
                Would you like to update this total amount?
              </p>
              <div>
                <Button
                  variant="outlined"
                  color="success"
                  size="small"
                  style={{ marginRight: "10px" }}
                  onClick={() => setTotalAmount(totalAmountInBoxes)}
                >
                  Yes
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => setShowConfirmation(false)}
                >
                  No
                </Button>
              </div>
            </div>
          )}

          {Array.from({ length: boxCount }).map((_, index) => (
            <Box
              key={index}
              sx={{ "& > :not(style)": { m: 1 } }}
              style={{ display: "flex", alignItems: "center" }}
            >
              <TextField
                label="Title"
                value={boxData[index]?.eventTitle}
                onChange={(e) => handleBoxTitleChange(e, index)}
                sx={{ width: 200 }}
              />
              <TextField
                label="Expect amount"
                type="number"
                value={boxData[index].amount}
                onChange={(e) => handleBoxAmountChange(e, index)}
                sx={{ width: 100 }}
              />
              {checkUpdate ? (
                <TextField
                  label="Actual amount"
                  type="number"
                  // step="0.01"
                  value={boxData[index].actualAmount}
                  onChange={(e) => handleBoxActualAmountChange(e, index)}
                  sx={{ width: 100 }}
                />
              ) : null}
              <TextField
                select
                label="Category"
                value={boxData[index].category ?? ""}
                onChange={(e) => handleBoxCategoryChange(e, index)}
                style={{ marginTop: "10px" }}
                sx={{ width: 100 }}
              >
                {categoriesList?.map((color) => (
                  <MenuItem key={color.id + color.name} value={color.id}>
                    {color.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Prioritize"
                value={boxData[index].eventColor}
                onChange={(e) => handleBoxColorChange(e, index)}
                style={{ marginTop: "10px" }}
                sx={{ width: 100 }}
              >
                {availableColors.map((color) => (
                  <MenuItem key={color.color + color.title} value={color.color}>
                    {color.title}
                  </MenuItem>
                ))}
              </TextField>
              <Fab
                size="small"
                color="error"
                aria-label="add"
                onClick={() => handleDeleteBox(index)}
              >
                <DeleteIcon />
              </Fab>
            </Box>
          ))}
          <DialogActions>
            {checkUpdate ? (
              <>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeletePlan}
                  style={{ marginTop: "10px", marginLeft: "10px" }}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateMoneyPlan}
                  style={{
                    marginTop: "10px",
                    marginLeft: "10px",
                    backgroundColor: "#0487D9",
                  }}
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCreateMoneyPlan}
                  style={{ marginTop: "10px", backgroundColor: "#0487D9" }}
                >
                  {selectedEvent ? "Save" : "Add"}
                </Button>
              </>
            )}
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog maxWidth="sm" open={isPopupOpen} onClose={handleDeleteCancel}>
        <Box p={2}>
          <Typography
            variant="h3"
            style={{ marginBottom: "10px", fontWeight: "500" }}
          >
            Delete Confirmation
          </Typography>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this plan?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleDeleteCancel}
              style={{ backgroundColor: "#0487D9", color: "white" }}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="primary"
              style={{ backgroundColor: "red", color: "white" }}
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog maxWidth="lg" open={isOpenCreateNote} onClose={closeDialog}>
        <Box p={2}>
          <Typography
            variant="h4"
            style={{
              marginTop: "10px",
              marginBottom: "15px",
              fontWeight: "500",
            }}
          >
            {selectedEvent ? "Edit Note" : "Add Note"}
          </Typography>
          <span className="text-danger">{validateNote}</span>

          <TextField
            label="Title"
            autoFocus
            value={eventTitle}
            style={{
              marginTop: "10px",
            }}
            onChange={(e) => setEventTitle(e.target.value)}
            fullWidth
          />
          <Box display="flex" pt={1.5}>
            <div style={{ marginRight: "10px", marginTop: "8px" }}>
              {allDay ? (
                <div style={{ display: "flex" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Start Date"
                      value={dayjs(dayStart)}
                      onChange={(newValue) => setDayStart(new Date(newValue))}
                    />
                  </LocalizationProvider>
                  <div style={{ marginLeft: "10px" }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="End Date"
                        value={dayjs(dayEnd)}
                        onChange={(newValue) => setDayEnd(new Date(newValue))}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
              ) : (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Start Date"
                    value={dayjs(dayStart)}
                    readOnly={isSmallScreen ? false : true}
                    onChange={(newValue) => setDayStart(new Date(newValue))}
                  />
                </LocalizationProvider>
              )}
            </div>
            {!allDay && (
              <>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["TimePicker", "TimePicker"]}>
                    <TimePicker
                      label="Start Time"
                      value={dayjs(timeStart)}
                      onChange={(newValue) => {
                        console.log(dayjs(newValue));
                        setTimeStart(new Date(newValue));
                      }}
                    />
                    <TimePicker
                      label="End Time"
                      value={dayjs(timeEnd)}
                      onChange={(newValue) => setTimeEnd(new Date(newValue))}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </>
            )}
          </Box>
          <Box display="flex" alignItems="center">
            <Checkbox
              checked={allDay}
              onChange={handleAllDayChange}
              color="primary"
            />
            <div>{allDay ? "All day" : "Custom time"}</div>
          </Box>

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              marginTop: "10px",
            }}
            fullWidth
          />

          <Typography
            style={{
              marginTop: "10px",
              marginBottom: "5px",
            }}
          >
            Pick color
          </Typography>
          <ColorPicker value={selectedColor} onChange={handleColorChange} />
          <DialogActions>
            {selectedEvent ? (
              <>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setIsPopoverNote(true)}
                  style={{ marginTop: "10px", marginLeft: "10px" }}
                >
                  Delete
                </Button>
              </>
            ) : (
              <></>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={selectedEvent ? handleUpdateNote : handleAddNote}
              style={{ marginTop: "10px", backgroundColor: "#0487D9" }}
            >
              {selectedEvent ? "Save" : "Add"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog maxWidth="lg" open={isOpenCreateCategory} onClose={closeDialog}>
        <Box p={2}>
          <Typography
            variant="h4"
            style={{
              marginTop: "10px",
              marginBottom: "15px",
              fontWeight: "500",
            }}
          >
            {isUpdateCate ? "Edit Category" : "Add Category"}
          </Typography>
          <span className="text-danger">{validateCategory}</span>
          <TextField
            label="Name"
            autoFocus
            value={createCategory}
            onChange={(e) => setCreateCategory(e.target.value)}
            style={{
              marginTop: "10px",
            }}
            fullWidth
          />
        </Box>
        <DialogActions>
          {isUpdateCate && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsDeleteCategory(true)}
              style={{ marginTop: "10px", backgroundColor: "#d90404" }}
            >
              Delete
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={isUpdateCate ? handleUpdateCategory : handleAddCategory}
            style={{ marginTop: "10px", backgroundColor: "#0487D9" }}
          >
            {isUpdateCate ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog maxWidth="sm" open={isPopoverNote} onClose={handleDeleteCancel}>
        <Box p={2}>
          <Typography
            variant="h3"
            style={{ marginBottom: "10px", fontWeight: "500" }}
          >
            Delete Confirmation
          </Typography>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this note?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleDeleteNoteCancel}
              style={{ backgroundColor: "#0487D9", color: "white" }}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteNote}
              color="primary"
              style={{ backgroundColor: "red", color: "white" }}
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog
        maxWidth="sm"
        open={isDeleteCategory}
        onClose={handleDeleteCancel}
      >
        <Box p={2}>
          <Typography
            variant="h3"
            style={{ marginBottom: "10px", fontWeight: "500" }}
          >
            Delete Confirmation
          </Typography>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this note?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setIsDeleteCategory(false)}
              style={{ backgroundColor: "#0487D9", color: "white" }}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteCategory}
              color="primary"
              style={{ backgroundColor: "red", color: "white" }}
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog maxWidth="sm" open={login} onClose={handleDeleteCancel}>
        <Box p={2}>
          <Typography
            variant="h3"
            style={{ marginBottom: "10px", fontWeight: "500" }}
          >
            SSPS
          </Typography>
          <DialogContent>
            <DialogContentText>
              You need to log in to perform the operation!!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleDeleteNoteCancel}
              style={{ backgroundColor: "red", color: "white" }}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogin}
              color="primary"
              style={{ backgroundColor: "#0487D9", color: "white" }}
              autoFocus
            >
              Login
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* category small */}
      <Dialog
        maxWidth="lg"
        open={isCategorySmall}
        onClose={() => setIsCategorySmall(false)}
      >
        <Box p={2}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              // marginTop: "5px",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "550" }}>
              Categories:
            </Typography>
            <Box>
              <Tooltip title="Add Category" placement="top-end">
                <IconButton>
                  <AddIcon
                    onClick={() => setIsOpenCreateCategory(true)}
                    sx={{ fontSize: 25 }}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Box>
            <List
              sx={{
                height: "30vh",
                overflow: "auto",
              }}
            >
              {categoriesList?.map((event) => (
                <ListItem
                  key={event.id}
                  sx={{
                    // backgroundColor: `${colors.listCategory[100]}`,
                    margin: "0px 0px 0px 0px",
                    borderRadius: "5px",
                    // color: "#790e61",
                    color: colors.iconTopbar[100],
                  }}
                >
                  <FiberManualRecordIcon
                    fontSize="sm"
                    sx={{ paddingRight: "5px" }}
                  />
                  <ListItemText
                    primaryTypographyProps={{ variant: "h6" }}
                    primary={event.name}
                  />
                  <IconButton
                    aria-describedby={id}
                    onClick={() => updateCategory(event)}
                    // onClick={handleClickCategory}
                  >
                    <MoreVertIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Box>
          <DialogActions>
            <Button
              variant="contained"
              color="error"
              onClick={() => setIsCategorySmall(false)}
              style={{ marginTop: "15px", marginLeft: "10px" }}
            >
              Close
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Calendar;
