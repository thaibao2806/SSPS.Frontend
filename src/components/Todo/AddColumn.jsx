import {
  Box,
  Button,
  Dialog,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { ColorPicker } from "material-ui-color";
import React, { useState } from "react";
import { createTodoNote } from "../../data/todo";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "../../redux/apiRequest";
import { toast } from "react-toastify";
import { createAxios } from "../../createInstance";
import { updateToken } from "../../redux/authSlice";

const AddColumn = ({ visible, oncloseNote }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login?.currentUser);
  let axoiJWT = createAxios(user, dispatch, updateToken);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [color, setColor] = useState(null);
  const [colors, setColors] = useState(null);
  const [cards, setCards] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [validate, setValidate] = useState("");

  const handleClose = () => {
    oncloseNote();
    setTitle("");
    setFromDate(new Date());
    setColor(null);
    setToDate(new Date());
    setValidate("");
  };

  const handleColor = (color) => {
    setColor(color);
    setColors(color);
  };

  const handleColumnAdd = async () => {
    try {
      if (!user?.data) {
        navigate("/login");
        return;
      }
      if(!title, !color) {
        setValidate("Need to enter title and color")
        return
      }
      if (fromDate > toDate) {
        setValidate("Start time is less than end time");
        return;
      }
      const cards = [];
      let res = await createTodoNote(
        title,
        fromDate,
        toDate,
        color.hex,
        cards,
        user.data?.accessToken,
        axoiJWT

      );
      if (res && res.data.msgCode === "SUCCESS") {
        toast.success("Create success!!!");
        handleClose()
      } else {
        toast.error("Create failed!!!");
      }
    } catch (error) {
        console.log(401);
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
      <Dialog open={visible} maxWidth="sm" onClose={handleClose}>
        <Box p={2}>
          <Typography
            variant="h4"
            style={{
              marginTop: "10px",
              marginBottom: "15px",
              fontWeight: "500",
            }}
          >
            {isUpdate ? "Edit column" : "Add column"}
          </Typography>
          <span className="text-danger">{validate}</span>
          <TextField
            autoFocus
            label="Title column"
            style={{
              marginTop: "10px",
            }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            fullWidth
          />
          <Box display="flex">
            <div style={{ marginRight: "10px", marginTop: "10px" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="From date"
                  value={dayjs(fromDate)}
                  onChange={(newValue) => setFromDate(new Date(newValue))}
                />
              </LocalizationProvider>
            </div>
            <div style={{ marginLeft: "10px", marginTop: "10px" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="To date"
                  value={dayjs(toDate)}
                  onChange={(newValue) => setToDate(new Date(newValue))}
                />
              </LocalizationProvider>
            </div>
          </Box>
          <Typography
            style={{
              marginTop: "10px",
              marginBottom: "5px",
            }}
          >
            Pick color
          </Typography>
          <ColorPicker value={color} onChange={handleColor} />
        </Box>
        <DialogActions>
          <Button
            variant="contained"
            style={{ marginTop: "10px", backgroundColor: "#0487D9" }}
            // onClick={() => {
            //   if ((!title, !color)) {
            //     setValidate("Need to enter title and color");
            //     return;
            //   }
            //   if (fromDate > toDate) {
            //     setValidate("The start date must be before the end date");
            //     return;
            //   }
            //   {
            //     isUpdate
            //       ? handleColumnAdd(
            //           id,
            //           title,
            //           fromDate,
            //           toDate,
            //           color.hex || colors,
            //           cards
            //         )
            //       : handleColumnAdd(
            //           title,
            //           fromDate,
            //           toDate,
            //           color.hex || colors,
            //           cards
            //         );
            //   }

            //   setTitle("");
            //   setFromDate(new Date());
            //   setToDate(new Date());
            //   setColor(null);
            //   setIsUpdate(false);
            //   setValidate("");
            // }}
            onClick={handleColumnAdd}
          >
            {isUpdate ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddColumn;
