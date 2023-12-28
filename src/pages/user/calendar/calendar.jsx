import { useEffect, useRef, useState } from "react";
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
} from "@mui/material";
import { tokens } from "../../../theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { mockEventData } from "../../../data/mockData";
import { useDispatch, useSelector } from "react-redux";
import { createMoneyPlan, deletePlan, getCategories, getMoneyPlanRangeType, updateCategories, updateMoneyPlan, updateUsage } from "../../../data/calendarApi";
import SmallCalendar from "./smallCalendar";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Checkbox from "@mui/material/Checkbox";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { addMonths, endOfDay, format, isSameDay, isValid, parseISO, setMonth, startOfMonth, sub } from "date-fns";
 import { ToastContainer, toast } from "react-toastify";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { ColorPicker } from "material-ui-color";
import { createNote, deleteNote, getNote, updateNote } from "../../../data/noteApi";
import holidays from "date-holidays"
import { logOutUser } from "../../../redux/apiRequest";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.login?.currentUser);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpenCreate, setIsDialogOpenCreate] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [select, setSelect] = useState("")
  const [eventColor, setEventColor] = useState("3");
  const [category, setCategory] = useState("");
  const availableColors = [
    {
      title: "Highly",
      priority: "blue",
      color: "1",
    },
    {
      title: "Medium",
      priority: "#d966ff",
      color: "2",
    },

    {
      title: "Normal",
      priority: "gray",
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
  const [timeText, setTimeText] = useState("")
  const [totalAmount, setTotalAmount] = useState("")
  const [expectAmount, setExpectAmount] = useState("")
  const [selectedYear, setSelectedYear] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedStartDay, setSelectedStartDay] = useState(new Date());
  const [selectedEndDay, setSelectedEndDay] = useState(null);
  const [totalAmountInBoxes, setTotalAmountInBoxes] = useState(0);
  const [currencyUnit, setCurrencyUnit] = useState("")
  const [actualAmount, setActualAmount] = useState("")
  const [moneyExpect, setMoneyExpect] = useState("")
  const [moneyActual, setMoneyActual] = useState("")
  const [unit, setUnit] = useState("")
  
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
  const [type, setType] = useState("DAY")
  const [errorCreate, setErrorCreate] = useState("")
  const [dataUpdate, setDataUpdate] = useState("")
  const [checkUpdate, setCheckUpdate] = useState(false)
  const [idUpdate, setIdUpdate] = useState("")
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [idNote, setIdNote] = useState("")
  const [colorUpdate, setColorUpdate] = useState("");
  const [priority, setPriority] = useState("");
  const [categoriesList, setCategoriesList] = useState(null)
  const [categoryName, setCategoryName] = useState("")
  const [isOpenCreateNote, setIsOpenCreateNote] = useState(false)
  const [selectedColor, setSelectedColor] = useState(null);
  const [description, setDescription] = useState("")
  const [dataPlan, setDataPlan] = useState(null)
  const [errorUsage, setErrorUsage] = useState("")
  const [createCategory, setCreateCategory] = useState("")
  const [isOpenCreateCategory, setIsOpenCreateCategory] = useState(false)
  const [isUpdateCate, setIsUpdateCate] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [validateMoneyPlan, setValidateMoneyPlan] = useState("")
  const [validateCategory, setValidateCategory] = useState("");
  const [validateNote, setValidateNote] = useState("")
  const [isPopoverNote, setIsPopoverNote] = useState(false);
  const [login, setLogin] = useState(false)
  const calendarRef = useRef(null);
  const mock = mockEventData
  const [isDelete, setIsDelete] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(true);

  // const hd = new holidays('VN')
  // const holiday = hd.getHolidays()
  
  useEffect(() => {
    
    getCategory()
    
  }, []);

  const getCategory = async () => {
    try {
      let res = await getCategories(user.data?.accessToken);
      if (res && res.data.msgCode === "SUCCESS") {
        setCategoriesList(res.data?.data);
      }
    } catch (error) {
      if (error.response.status === 401) {
        console.log(401);
        const timeoutDelay = 5000;

        toast.warning("Session expired. Logging out in 5 seconds.");

        setTimeout(() => {
          logOutUser(dispatch, navigate);
        }, timeoutDelay);
      }
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
    console.log(index)
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
    const date1 = selected.start
    const date2 = selected.end
    const result = isSameDay(date1, date2)
    if (result) {
      setTimeEnd(selected.end);
    } else {
      setTimeEnd(dayjs(selected.start).endOf("day").toDate());
    }
    setSelect(selected)
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
    setIsUpdateCate(false)
    setCreateCategory("")
    setIsOpenCreateCategory(false)
    setIsOpenCreateNote(false)
    setEventDate("")
    setEventTitle("")
    setSelect("")
    setTimeEnd(dayjs(currentDate))
    setTimeStart(dayjs(currentDate));
    setDayEnd(dayjs(currentDate));
    setDayStart(dayjs(currentDate));
    setSelectedEvent(null)
    setEventColor("indigo");
    setMoneyActual("")
    setMoneyExpect("")
    setCategory("")
    setSelectedColor(null)
    setTimeEnd("")
    setTimeStart("")
    setDayStart("")
    setDescription("")
    setDayEnd("")
    setErrorUsage("")
    setValidateCategory("")
    setValidateNote("")
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
    let ctg
    checkId.map((item) => {
      if (item.expectAmount < item.actualAmount) {
        setErrorUsage("Warning: Actual money is higher than expected money");
      }
        setMoneyExpect(item.expectAmount);
      setMoneyActual(item.actualAmount);
      setCategoryName(item.priority);
      setDescription(item?.description);
      setSelectedColor(item?.color);
      setTimeEnd(dayjs(item?.end));
      setTimeStart(item?.start);
      setColorUpdate(item?.color);
      ctg = categoriesList.filter((i) => i.id === item.categoryId);
      if(item.expectAmount && item.actualAmount) {
        openDialog()
      } else {
        setIdNote(item.id)
        setIsOpenCreateNote(true)
      }
    });
    ctg.map((item) => setCategory(item.id));
    const calendarApi = selected.view.calendar;
    setDayStart(selected.event.start);
    setDayEnd(selected.event.end || selected.event.start);
    setEventDate(calendarApi)
    setSelectedEvent(selected);
    setEventTitle(selected.event.title);
    setEventColor(selected.event.backgroundColor);
    // openDialog();
    // setIsOpenCreateNote(true)
  };

  const handleUpdateEvent = async() => {
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
            eventColor === "blue" ? 1 : eventColor === "#d966ff" ? 2 : 3,
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

        let res = await updateUsage(moneyPlanId, data, user.data?.accessToken);
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
      if (error.response.status === 401) {
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
    setIsDialogOpenCreate(true)
  }

  const closeCreateDialog = () => {
    setIsDialogOpenCreate(false);
    setCurrencyUnit("")
    setTimeFrame("Chose");
    setBoxData([
      {
        eventTitle: "",
        eventColor: "",
        actualAmount: actualAmount,
      },
    ]);
    setErrorCreate("")
    setTotalAmount("")
    setBoxCount(1)
    setValidateMoneyPlan("")
    setCheckUpdate(false)
  }

  const handleCreatePlan = () => {
    if (!user?.data) {
      setLogin(true)
      return;
    }
    openCreateDialog()
  }

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
    updatedBoxData[index].actualAmount = parseInt(e.target.value) || 0;
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

  const handleSuggestion =() => {
    const amounts = totalAmount / 5
    setBoxData([
      {
        eventTitle: "Tiền nhà",
        eventColor: "2",
        amount: amounts,
        category: categoriesList[9].id,
      },
      {
        eventTitle: "Tiền điện",
        eventColor: "2",
        amount: amounts,
        category: categoriesList[4].id,
      },
      {
        eventTitle: "Tiền nước",
        eventColor: "2",
        amount: amounts,
        category: categoriesList[8].id,
      },
      {
        eventTitle: "Tiền mạng",
        eventColor: "2",
        amount: amounts,
        category: categoriesList[6].id,
      },
      {
        eventTitle: "Tiền sinh hoạt",
        eventColor: "2",
        amount: amounts,
        category: categoriesList[9].id,
      },
    ]);

  }
  
    useEffect(() => {
      setBoxCount(boxData.length);
      updateTotalAmountInBoxes();
    }, [boxData]);

  const updateTotalAmountInBoxes = () => {
    const total = boxData.reduce(
      (sum, box) => sum + parseInt(box.amount || 0),
      0
    );
    if (isDelete) {
      setActualAmount(0);
    } else {
      const totalActual = boxData.reduce(
        (sum, box) => sum + parseInt(box?.actualAmount || 0),
        0
      );
      setActualAmount(totalActual);
    }
    if(totalAmountInBoxes > totalAmount) {
      setShowConfirmation(true)
    }
    setTotalAmountInBoxes(total);
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
      setTimeText(`Month: ${selectedMonth?.$M +1}/${selectedMonth?.$y}`);
    } else if (timeFrame === "DAY") {
      setTimeText(
        `Day: ${selectedStartDay?.$D}/${selectedStartDay?.$M + 1} - ${selectedEndDay?.$D}/${selectedEndDay?.$M + 1}/${
          selectedEndDay?.$y
        }`
      );
    }
  };

  const handleCreateMoneyPlan = async() => {
    try {
      if (!user?.data) {
        navigate("/login");
        return;
      }
      const type = timeFrame;
      const expectAmount = totalAmount;
      let dateTime;
      if (timeFrame === "YEAR") {
        dateTime = selectedYear;
      } else if (timeFrame === "MONTH") {
        dateTime = selectedMonth;
      } else if (timeFrame === "DAY") {
        const time = new Date(selectedStartDay);
        time.setDate(time.getDate());
        // dateTime = time.toISOString();
        dateTime = selectedStartDay;
      }

      const convertedData = boxData.map((item) => ({
        categoryId: item?.category,
        name: item?.eventTitle,
        expectAmount: item?.amount,
        priority: item?.eventColor,
      }));
      const usageMoneys = convertedData;
      if (!timeFrame || !totalAmount || !currencyUnit || !dateTime) {
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
      const res = await createMoneyPlan(
        type,
        expectAmount,
        currencyUnit,
        dateTime,
        usageMoneys,
        user.data?.accessToken
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
    } catch (error) {
      if (error.response.status === 401) {
        console.log(401);
        const timeoutDelay = 5000;

        toast.warning("Session expired. Logging out in 5 seconds.");

        setTimeout(() => {
          logOutUser(dispatch, navigate);
        }, timeoutDelay);
      }
    }
  }

  const handleAllDayChange = (e) => {
    setAllDay(e.target.checked);
  };

  const handleDayButtonClick = async(item) => {
    try {
      let convertedData = [];
      setExpectAmount("")
      if (item === "timeGridDay") {
        calendarRef.current.getApi().changeView(item);
        setExpectAmount(0);
        setActualAmount(0);
        setUnit("");
        setIdUpdate(false)
        setType("DAY");
      }
     
      if (item === "timeGridWeek") {
        calendarRef.current.getApi().changeView(item);
        setIdUpdate(false);
        setType("DAY");
      }
      if (item === "dayGridMonth") {
        calendarRef.current.getApi().changeView(item);
        setExpectAmount(0)
        setActualAmount(0);
        setUnit("")
        setIdUpdate(false);
        setType("MONTH");
      }

      if (item === "multiMonthYear") {
        calendarRef.current.getApi().changeView(item);
        setIdUpdate(false);
        setExpectAmount(0);
        setActualAmount(0);
        setUnit("");
        setType("YEAR");
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
      let res = await getMoneyPlanRangeType(
        type,
        startDate,
        endDate,
        user.data?.accessToken
      );
      if (res && res.data.msgCode === "SUCCESS") {
        setDataUpdate(res.data.data);
        let end = new Date(endDate);
        const year = end.getFullYear();
        const month = String(end.getMonth() + 1).padStart(2, "0"); // Lưu ý: tháng bắt đầu từ 0
        const day = String(end.getDate() + 1).padStart(2, "0");
        let data;
        // Tạo chuỗi theo định dạng "yyyy-mm-dd"
        const nextDayString = `${year}-${month}-${day}`;
        let ctg, categoryId;
        console.log("ssss", res.data?.data)
        setExpectAmount("")
        setActualAmount(0)
        setUnit("")

          res.data?.data.map(
            (item) => (
              console.log("aaaa", item),
              (data = item?.usageMoneys.map(
                (i, index) => (
                  (ctg = categoriesList?.filter(
                    (j) => j.name === i.categoryName
                  )),
                  ctg?.map((item) => (categoryId = item.id)),
                  {
                    id: `box-${index}-${i.name}`,
                    title: i.name,
                    start: startDate,
                    end: nextDayString,
                    color:
                      i.expectAmount < i.actualAmount
                        ? "red"
                        : i.priority === 1
                        ? "blue"
                        : i.priority === 2
                        ? "#d966ff"
                        : "gray",
                    actualAmount: i.actualAmount,
                    expectAmount: i.expectAmount,
                    categoryId: categoryId,
                    priority: i.priority === 1 ? 1 : i.priority === 2 ? 2 : 3,
                  }
                ),
                setExpectAmount(item?.expectAmount),
                setUnit(item.currencyUnit),
                console.log("ssss", item?.expectAmount),
                // setActualAmount(item.actualAmount),
                setIdUpdate(item.id)
              ))
            )
          );
        let totalActual = 0;
        data?.forEach((item) => {
          convertedData.push(item);
          totalActual = totalActual + item.actualAmount;
        });
        setActualAmount(totalActual);
        setDataPlan(data);

         if (type === "DAY" || type === "MONTH") {
           let start = new Date(startDate);
           let day = start.getDate() - 1;
           let month = (start.getMonth() + 1).toString().padStart(2, "0");
           let year = start.getFullYear();
           if (day === 0) {
             const lastDayOfPreviousMonth = new Date(year, month - 1, 0);
             day = lastDayOfPreviousMonth.getDate();
             month = lastDayOfPreviousMonth.getMonth() + 1;
           }
           let dateStart = `${year}-${month}-${day
             .toString()
             .padStart(2, "0")}`;
           const inputDate = parseISO(dateStart);
           let end = new Date(endDate);
           let enddDay = end.getDate();
           let endmMonth = (end.getMonth() + 1).toString().padStart(2, "0");
           let endYear = end.getFullYear();
           let dateEnd = `${endYear}-${endmMonth}-${enddDay
             .toString()
             .padStart(2, "0")}`;
           const inputDateEnd = parseISO(dateEnd);
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
           console.log(FromDate, ToDate);
           let res = await getNote(FromDate, ToDate, user.data?.accessToken);
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

         if (type === "YEAR") {
           let start = new Date(startDate);
           let day = start.getDate();
           let month = (start.getMonth() + 1).toString().padStart(2, "0");
           let year = start.getFullYear();
           if (day === 0) {
             const lastDayOfPreviousMonth = new Date(year, month - 1, 0);
             day = lastDayOfPreviousMonth.getDate();
             month = lastDayOfPreviousMonth.getMonth() + 1;
           }
           let dateStart = `${year}-${month}-${day
             .toString()
             .padStart(2, "0")}`;
           const inputDate = parseISO(dateStart);
           let end = new Date(endDate);
           let enddDay = end.getDate();
           let endmMonth = (end.getMonth() + 1).toString().padStart(2, "0");
           let endYear = end.getFullYear();
           let dateEnd = `${endYear}-${endmMonth}-${enddDay
             .toString()
             .padStart(2, "0")}`;
           const inputDateEnd = parseISO(dateEnd);
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
           let res = await getNote(FromDate, ToDate, user.data?.accessToken);
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

        if (calendarRef.current) {
          const calendarApi = calendarRef.current.getApi();
          calendarApi.removeAllEvents();
          convertedData.map((item) => calendarApi.addEvent(item));
        }
        setCurrentEvents(convertedData);
      }
    } catch (error) {
      if (error.response.status === 401) {
        console.log(401);
        // const timeoutDelay = 5000; 

        // toast.warning("Session expired. Logging out in 5 seconds.");

        // setTimeout(() => {
        //   logOutUser(dispatch, navigate);
        // }, timeoutDelay);
      }
    }
  };

  useEffect(()=> {
     const calendarApi = calendarRef.current.getApi();

     const handleDateSet = (info) => {
       const view = info.view;
       const startDate = info.start;
       const endDate = info.end;
       if (view.type === "dayGridMonth" ) {
         if (startDate.getDate() !== 1) {
           // Đặt startDate thành ngày đầu tiên của tháng tiếp theo
           let end = new Date(endDate)
          const date = addMonths(startOfMonth(startDate), 1);
           const formattedStartDate = format(date, "yyyy-MM-dd");
           const formattedEndDate = format(end.setDate(0), "yyyy-MM-dd");
           setStartDate(formattedStartDate);
           setEndDate(formattedEndDate);
           return
         } else {
           let end = new Date(endDate);
           const formattedStartDate = format(startDate, "yyyy-MM-dd");
           // const formattedEndDate = format(
           //   addMonths(startOfMonth(startDate), 1),
           //   "yyyy-MM-dd"
           // );
           const formattedEndDate = format(end.setDate(0), "yyyy-MM-dd");
           setStartDate(formattedStartDate);
           setEndDate(formattedEndDate);
         }
       } else if (view.type === "timeGridDay") {
        const formattedStartDate = format(startDate, "yyyy-MM-dd");
        const formattedEndDate = format(startDate, "yyyy-MM-dd");
        setStartDate(formattedStartDate);
        setEndDate(formattedEndDate);
       } else if (view.type === "listYear") {
        console.log(startDate, endDate);
        const formattedStartDate = format(startDate, "yyyy-MM-dd");
        const formattedEndDate = format(endDate, "yyyy-MM-dd");
        setStartDate(formattedStartDate);
        setEndDate(formattedEndDate);
       } else {
         const formattedStartDate = format(startDate, "yyyy-MM-dd");
         const formattedEndDate = format(endDate, "yyyy-MM-dd");
         setStartDate(formattedStartDate);
         setEndDate(formattedEndDate);
         
       }
        
     };

     if (type === "DAY") {
      setExpectAmount("")
       handleDayButtonClick("timeGridDAY");
     }
     if(type === "MONTH") {
      setExpectAmount("");
      handleDayButtonClick("dayGridMonth");
     }
      if(type === "YEAR") {
      setExpectAmount("");
      handleDayButtonClick("multiMonthYear");
     }

     calendarApi.on("datesSet", handleDateSet);

     return () => {
       calendarApi.off("datesSet", handleDateSet);
     };
  }, [ startDate, endDate, type])

  const handleUpdatePlan = () => {
    setCheckUpdate(true)
    openCreateDialog();
    setSelectedStartDay(new Date(startDate));
    setSelectedMonth(new Date(startDate));
    setSelectedYear(new Date(startDate));
     let checkctg, ctgId
    if (dataUpdate && dataUpdate.length > 0) {
      dataUpdate.forEach((item, index) => {
        setIdUpdate(item.id)
        setTimeFrame(item.type);
        setTotalAmount(item.expectAmount);
        // setActualAmount(item.actualAmount)
        setCurrencyUnit(item.currencyUnit);
        if (item.usageMoneys && item.usageMoneys.length > 0) {
          const updatedBoxData = item.usageMoneys.map(
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
                actualAmount: usageMoney.actualAmount
              }
            )
          );
          setBoxData(updatedBoxData);
        }
      });
    }
  };

  const handleDeletePlan = async() => {
    setPopupOpen(true);
  }

  const handleDeleteConfirm = async() => {
    try {
      const moneyPlanId = idUpdate;
      let res = await deletePlan(moneyPlanId, user.data?.accessToken);
      if (res && res.data.msgCode === "SUCCESS") {
        toast.success("Delete success!!");
        setActualAmount(0);
        if (type === "DAY") {
          handleDayButtonClick("timeGridDAY");
        } else if (type === "MONTH") {
          handleDayButtonClick("dayGridMonth");
        } else if (type === "YEAR") {
          handleDayButtonClick("multiMonthYear");
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
      if (error.response.status === 401) {
        console.log(401);
        const timeoutDelay = 5000;

        toast.warning("Session expired. Logging out in 5 seconds.");

        setTimeout(() => {
          logOutUser(dispatch, navigate);
        }, timeoutDelay);
      }
    }
  };

  const handleDeleteCancel = () => {
    setPopupOpen(false);
  };

  const handleUpdateMoneyPlan = async() => {
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

      const usages = boxData.map((item, index) => ({
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
        usages,
        user.data?.accessToken
      );
      if (res && res.data.msgCode === "SUCCESS") {
        toast.success("Update success!!");
        setCheckUpdate(false);
        if (type === "DAY") {
          handleDayButtonClick("timeGridDAY");
        } else if (type === "MONTH") {
          handleDayButtonClick("dayGridMonth");
        } else if (type === "YEAR") {
          handleDayButtonClick("multiMonthYear");
        }
        setIsDelete(false);
        closeCreateDialog();
      } else {
        toast.error("Update failed!!!");
      }
    } catch (error) {
      if (error.response.status === 401) {
        console.log(401);
        const timeoutDelay = 5000;

        toast.warning("Session expired. Logging out in 5 seconds.");

        setTimeout(() => {
          logOutUser(dispatch, navigate);
        }, timeoutDelay);
      }
    }
  }

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleAddNote = async() => {
    try {
    if (!user?.data) {
      setLogin(true)
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
        user.data?.accessToken
      );
      if (res && res.data.msgCode === "SUCCESS") {
        toast.success("Create Success!!");
        if (type === "DAY") {
          handleDayButtonClick("timeGridDAY");
        } else if (type === "MONTH") {
          handleDayButtonClick("dayGridMonth");
        } else if (type === "YEAR") {
          handleDayButtonClick("multiMonthYear");
        }
        closeDialog();
      } else {
        toast.error("failed!!!");
      }
    } catch (error) {
      if (error.response.status === 401) {
        console.log(401);
        const timeoutDelay = 5000;

        toast.warning("Session expired. Logging out in 5 seconds.");

        setTimeout(() => {
          logOutUser(dispatch, navigate);
        }, timeoutDelay);
      }
    }
  }

  const handleUpdateNote = async() => {
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
      if(!allDay) {
        fromDate = timeStart;
        toDate = timeEnd;
      } 
      console.log(selectedColor);
      let res = await updateNote(
        id,
        title,
        description,
        color,
        fromDate,
        toDate,
        user.data?.accessToken
      );
      if (res && res.data.msgCode === "SUCCESS") {
        toast.success("Update success!!");
        if (type === "DAY") {
          handleDayButtonClick("timeGridDAY");
        } else if (type === "MONTH") {
          handleDayButtonClick("dayGridMonth");
        } else if (type === "YEAR") {
          handleDayButtonClick("multiMonthYear");
        }
        closeDialog();
      } else {
        toast.error("Update failed!!");
      }
    } catch (error) {
      if (error.response.status === 401) {
        console.log(401);
        const timeoutDelay = 5000;

        toast.warning("Session expired. Logging out in 5 seconds.");

        setTimeout(() => {
          logOutUser(dispatch, navigate);
        }, timeoutDelay);
      }
    }
  }

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
        user.data?.accessToken
      );
      if (res && res.data.msgCode === "SUCCESS") {
        toast.success("Update success!!");
        if (type === "DAY") {
          handleDayButtonClick("timeGridDAY");
        } else if (type === "MONTH") {
          handleDayButtonClick("dayGridMonth");
        } else if (type === "YEAR") {
          handleDayButtonClick("multiMonthYear");
        }
        closeDialog();
      } else {
        toast.error("Update failed!!");
      }
    } catch (error) {if (error.response.status === 401) {
      console.log(401);
      const timeoutDelay = 5000;

      toast.warning("Session expired. Logging out in 5 seconds.");

      setTimeout(() => {
        logOutUser(dispatch, navigate);
      }, timeoutDelay);
    }}
  };

  const handleDeleteNote = async() => {
    try {
      let id = idNote;
      let res = await deleteNote(id, user.data?.accessToken);
      if (res && res.data.msgCode === "SUCCESS") {
        toast.success("Delete success!!");
        if (type === "DAY") {
          handleDayButtonClick("timeGridDAY");
        } else if (type === "MONTH") {
          handleDayButtonClick("dayGridMonth");
        } else if (type === "YEAR") {
          handleDayButtonClick("multiMonthYear");
        }
        setIsPopoverNote(false);
        closeDialog();
      } else {
        toast.error("Delete Failed!!");
      }
    } catch (error) {if (error.response.status === 401) {
      console.log(401);
      const timeoutDelay = 5000;

      toast.warning("Session expired. Logging out in 5 seconds.");

      setTimeout(() => {
        logOutUser(dispatch, navigate);
      }, timeoutDelay);
    }}
  }

  const handleEventDrop = async(eventDropInfo) => {
    const { event } = eventDropInfo;
    let id = event.id
    let title = event.title;
    let color = event.backgroundColor.slice(1);
    let description = event.extendedProps.description;
    let fromDate = format(event.start, "yyyy-MM-dd'T'HH:mm:ss");
    let toDate = format(event.end, "yyyy-MM-dd'T'HH:mm:ss");
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
    setIsUpdateCate(true)
    setIsOpenCreateCategory(true)
    setCreateCategory(e.name)
    setSelectedCategory(e)
  }

  const handleUpdateCategory = async() => {
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
        let res = await updateCategories(categories, user.data?.accessToken);
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
      if (error.response.status === 401) {
        console.log(401);
        const timeoutDelay = 5000;

        toast.warning("Session expired. Logging out in 5 seconds.");

        setTimeout(() => {
          logOutUser(dispatch, navigate);
        }, timeoutDelay);
      }
    }
    
  }

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
      let res = await updateCategories(categories, user.data?.accessToken);
      if (res && res.data.msgCode === "SUCCESS") {
        toast.success("Update success!!");
        getCategory();
        closeDialog();
      } else {
        toast.error("Update failed!!");
      }
    } catch (error) {
      if (error.response.status === 401) {
        console.log(401);
        const timeoutDelay = 5000;

        toast.warning("Session expired. Logging out in 5 seconds.");

        setTimeout(() => {
          logOutUser(dispatch, navigate);
        }, timeoutDelay);
      }
    }
  }

  const handleDeleteNoteCancel = () => {
    setIsPopoverNote(false)
    setLogin(false)
  }

  const handleLogin = () => {
   navigate("/login");
  }

  return (
    <Box m="10px 35px 0 35px">
      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 22%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
        >
          <Button
            variant="outlined"
            color="success"
            onClick={handleCreatePlan}
            style={{
              marginBottom: "20px",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            <AddIcon />
            Create
          </Button>
          {expectAmount > 0 && (
            <Button
              variant="outlined"
              color="warning"
              onClick={handleUpdatePlan}
              style={{
                marginBottom: "20px",
                fontSize: "16px",
                fontWeight: "600",
                marginLeft: "10px",
              }}
            >
              Update
            </Button>
          )}
          {/* <SmallCalendar/> */}
          <Typography variant="h5" sx={{ fontWeight: "500" }}>
            Expect amount:{" "}
          </Typography>
          <List
            sx={{
              overflow: "auto",
            }}
          >
            <ListItem
              sx={{
                backgroundColor: colors.greenAccent[700],
                margin: "1px 0",
                borderRadius: "2px",
              }}
            >
              <ListItemText
                primary={
                  <Typography>
                    {expectAmount ? expectAmount : 0} {unit}
                  </Typography>
                }
              />
            </ListItem>
          </List>
          <Typography variant="h5" sx={{ fontWeight: "500" }}>
            Actual amount:{" "}
          </Typography>
          <List
            sx={{
              overflow: "auto",
            }}
          >
            <ListItem
              sx={{
                backgroundColor:
                  expectAmount < actualAmount ? "red" : colors.greenAccent[700],
                margin: "1px 0",
                borderRadius: "2px",
              }}
            >
              <ListItemText
                primary={
                  <Typography>
                    {actualAmount ? actualAmount : 0} {unit}
                  </Typography>
                }
              />
            </ListItem>
          </List>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "500" }}>
              Categories:
            </Typography>
            <Tooltip title="Add Category" placement="top-end">
              <IconButton>
                <AddIcon
                  onClick={() => setIsOpenCreateCategory(true)}
                  sx={{ fontSize: 30 }}
                />
              </IconButton>
            </Tooltip>
          </Box>

          <List
            sx={{
              height: "335px",
              overflow: "auto",
            }}
          >
            {categoriesList?.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.greenAccent[700],
                  margin: "10px 0",
                  color: "black",
                  borderRadius: "2px",
                }}
                onClick={() => updateCategory(event)}
              >
                <ListItemText primary={event.name} />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="20px">
          <FullCalendar
            ref={calendarRef}
            height="87vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
              multiMonthPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "YearButton,MonthButton,dayButton",
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
                showNonCurrentDates: false,
              },
              multiMonthYear: {
                buttonText: "Year",
                dayMaxEventRows: 6,
              },
            }}
          />
        </Box>
      </Box>
      <Dialog maxWidth="lg" open={isDialogOpen} onClose={closeDialog}>
        <Box p={2}>
          <Typography
            variant="h4"
            style={{
              marginTop: "10px",
              marginBottom: "15px",
              fontWeight: "500",
            }}
          >
            {selectedEvent ? "Edit Plan" : "Add Plan"}
          </Typography>

          <p style={{ color: "#cccc00" }}>
            {moneyActual > moneyExpect
              ? "Warning: Actual money is higher than expected money"
              : errorUsage}{" "}
          </p>
          <TextField
            label="Title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            fullWidth
          />
          <Box display="flex" pt={1.5}></Box>
          <Box display="flex">
            <TextField
              select
              label="Categories"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: "48.75%", margin: "10px 10px 0 0px" }}
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
              value={eventColor}
              onChange={(e) => setEventColor(e.target.value)}
              style={{ width: "48%", margin: "10px 10px 0 0px" }}
            >
              {availableColors.map((color) => (
                <MenuItem
                  key={color.color + color.title}
                  value={color.priority}
                >
                  {color.title}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box display="flex">
            <TextField
              label="Expect amount"
              value={moneyExpect}
              onChange={(e) => setMoneyExpect(e.target.value)}
              style={{ width: "48.75%", margin: "10px 10px 0 0px" }}
            />
            <TextField
              label="Actual amount"
              value={moneyActual}
              onChange={(e) => setMoneyActual(e.target.value)}
              style={{ width: "48%", margin: "10px 10px 0 0px" }}
            />
          </Box>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={selectedEvent ? handleUpdateEvent : handleAddEvent}
              style={{ marginTop: "10px", backgroundColor: "#0487D9" }}
            >
              {selectedEvent ? "Save" : "Add"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

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
            autoFocus
            value={totalAmount}
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
                value={actualAmount}
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
            onChange={(e) => setCurrencyUnit(e.target.value)}
            style={{ width: "25%", marginTop: "10px", marginBottom: "20px" }}
          />
          <Box style={{ display: "flex" }}>
            <TextField
              select
              label="Plan Type"
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              style={{ marginRight: "15px", marginBottom: "20px" }}
            >
              <MenuItem value="Chose">Chose time</MenuItem>
              <MenuItem value="YEAR">Year</MenuItem>
              <MenuItem value="MONTH">Month</MenuItem>
              <MenuItem value="DAY">Day</MenuItem>
            </TextField>
            {timeFrame === "YEAR" && (
              <>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    views={["year"]}
                    label="Select Year"
                    value={dayjs(selectedYear)}
                    onChange={(date) => setSelectedYear(new Date(date))}
                  />
                </LocalizationProvider>
              </>
            )}

            {timeFrame === "MONTH" && (
              <>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    views={["year", "month"]}
                    label="Select Year and Month"
                    value={dayjs(selectedMonth)}
                    onChange={(date) => setSelectedMonth(new Date(date))}
                  />
                </LocalizationProvider>
              </>
            )}

            {timeFrame === "DAY" && (
              <div style={{ display: "flex" }}>
                <div style={{ marginRight: "10px" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Select Day"
                      value={dayjs(selectedStartDay)}
                      onChange={(date) => setSelectedStartDay(new Date(date))}
                    />
                  </LocalizationProvider>
                </div>
              </div>
            )}
          </Box>
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
                The total amount has exceeded the limit, do you want to update
                the total amount?
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
                  value={boxData[index].actualAmount}
                  onChange={(e) => handleBoxActualAmountChange(e, index)}
                  sx={{ width: 100 }}
                />
              ) : null}
              <TextField
                select
                label="Category"
                value={boxData[index].category}
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
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeletePlan}
                  style={{ marginTop: "10px", marginLeft: "10px" }}
                >
                  Delete
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
                    readOnly
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
                      onChange={(newValue) => setTimeStart(new Date(newValue))}
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
            <Button
              variant="contained"
              color="primary"
              onClick={selectedEvent ? handleUpdateNote : handleAddNote}
              style={{ marginTop: "10px", backgroundColor: "#0487D9" }}
            >
              {selectedEvent ? "Save" : "Add"}
            </Button>
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
    </Box>
  );
};

export default Calendar;
