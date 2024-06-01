import { Box, Button, Checkbox, Dialog, DialogActions, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { ColorPicker } from 'material-ui-color';
import React, { useState } from 'react'
import { createNote } from '../../data/noteApi';
import { tokens } from '../../theme';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { createAxios } from '../../createInstance';
import { updateToken } from '../../redux/authSlice';

const AddNote = ({isOpenCreateNote,closeDialog }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login?.currentUser);
  let axoiJWT = createAxios(user, dispatch, updateToken);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [validateNote, setValidateNote] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [allDay, setAllDay] = useState(false);
  const currentDate = new Date();
  const [dayStart, setDayStart] = useState(dayjs(currentDate));
  const [dayEnd, setDayEnd] = useState(dayjs(currentDate));
  const [timeStart, setTimeStart] = useState(dayjs(currentDate));
  const [timeEnd, setTimeEnd] = useState(dayjs(currentDate));
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);

  const handleAllDayChange = (e) => {
    setAllDay(e.target.checked);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleClose = () => {
    closeDialog()
    setEventTitle("")
    setDescription("")
    setSelectedColor("")
  }

  const handleAddNote = async () => {
    try {
      if (!user?.data) {
        setLogin(true);
        return;
      }
      let title = eventTitle;
      let color = selectedColor?.hex;
      let fromDate = format(new Date(dayStart), "yyyy-MM-dd");
      let toDate = format(new Date(dayEnd), "yyyy-MM-dd");
      if (!allDay) {
        fromDate = format(new Date(timeStart), "yyyy-MM-dd'T'HH:mm:ss");
        toDate = format(new Date(timeEnd), "yyyy-MM-dd'T'HH:mm:ss");
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
        axoiJWT
      );
      if (res && res.data.msgCode === "SUCCESS") {
        handleClose();
        toast.success("Create success!!")
      } else {
        toast.error("failed!!!");
      }
    } catch (error) {
      console.log(error);

      if (error.response?.status === 401) {
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
      <Dialog maxWidth="lg" open={isOpenCreateNote} onClose={handleClose}>
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
    </div>
  )
}

export default AddNote