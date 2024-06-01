import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { createListMoneyPlan, getCategories } from "../../data/calendarApi";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  Fab,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { tokens } from "../../theme";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { createAxios } from "../../createInstance";
import { updateToken } from "../../redux/authSlice";

const AddMoneyPlan = ({ isDialogOpenCreate, closeCreateDialog }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login?.currentUser);
  let axoiJWT = createAxios(user, dispatch, updateToken);
  const [errorCreate, setErrorCreate] = useState("");
  const [validateMoneyPlan, setValidateMoneyPlan] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [actualAmount, setActualAmount] = useState("");
  const [currencyUnit, setCurrencyUnit] = useState("");
  const [selectedStartDay, setSelectedStartDay] = useState(new Date());
  const [selectedEndDay, setSelectedEndDay] = useState(new Date());
  const [boxData, setBoxData] = useState([
    {
      eventTitle: "",
      eventColor: null,
    },
  ]);
  const [checkUpdate, setCheckUpdate] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [totalAmountInBoxes, setTotalAmountInBoxes] = useState(0);
  const [boxCount, setBoxCount] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);
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
  const [isDelete, setIsDelete] = useState(false);

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
    if (totalAmountInBoxes > totalAmount) {
      setShowConfirmation(true);
    }
    setTotalAmountInBoxes(total);
  };

  useEffect(() => {
    getCategory();
    console.log(isDialogOpenCreate, closeCreateDialog);
  }, []);

  const handleClose = () => {
    closeCreateDialog();
  };

  const getCategory = async () => {
    try {
      let res = await getCategories(user.data?.accessToken, axoiJWT);
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

  const handleSuggestion = () => {
    const amounts = totalAmount / 5;
    setBoxData([
      {
        eventTitle: "Home bill",
        eventColor: "1",
        amount: 1000000,
        category: categoriesList[9]?.id,
      },
      {
        eventTitle: "Electricity",
        eventColor: "1",
        amount: 70000,
        category: categoriesList[4]?.id,
      },
      {
        eventTitle: "Water bill",
        eventColor: "1",
        amount: 70000,
        category: categoriesList[8]?.id,
      },
      {
        eventTitle: "Food & Beverage",
        eventColor: "1",
        amount: 2500000,
        category: categoriesList[9]?.id,
      },
    ]);
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
        axoiJWT
      );
      if (res && res.status === 200 && res.data.msgCode === "SUCCESS") {
        toast.success("Create success!!");
        setErrorCreate("");
        setValidateMoneyPlan("");
        setIsDelete(false);
        handleClose();
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

  return (
    <div>
      <Dialog maxWidth="lg" open={isDialogOpenCreate} onClose={handleClose}>
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
            // disabled={checkUpdate}
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
                // disabled
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
                  //   onClick={handleDeletePlan}
                  style={{ marginTop: "10px", marginLeft: "10px" }}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  //   onClick={handleUpdateMoneyPlan}
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
    </div>
  );
};

export default AddMoneyPlan;
