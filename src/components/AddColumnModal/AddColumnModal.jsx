import React from "react";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import css from "./AddColumnModal.module.css";
import { Box, Button, Dialog, DialogActions, TextField, Typography } from "@mui/material";
import { ColorPicker } from "material-ui-color";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { format } from "date-fns";

const AddColumnModal = ({ visible, onClose, handleColumnAdd, columnData }) => {
  const customStyles = {
    background: "rgb(58 58 58)",
    padding: "20px",
    width: "50%",
    top: "-3rem",
    height: "fit-content",
    maxWidth: "40rem",
  };
  const [id, setId] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [fromDate, setFromDate] = React.useState(new Date());
  const [toDate, setToDate] = React.useState(new Date());
  const [color, setColor] = React.useState(null);
  const [cards, setCards] = React.useState([]);
  const [isUpdate, setIsUpdate] = React.useState(false);
  const [validate, setValidate] = React.useState("");

  React.useEffect(() => {
    // Set the initial state of the modal with the data of the clicked card
    if (columnData) {
      setIsUpdate(true);
      setId(columnData.id);
      setTitle(columnData.title || "");
      setFromDate(dayjs(columnData.fromDate));
      setToDate(dayjs(columnData.toDate));
      setColor(`#${columnData.color}`);
      setCards(columnData.cards);
    }
  }, [columnData, visible]);

  const handleClose = () => {
    onClose();
    setTitle("");
    setFromDate(new Date());
    setColor(null);
    setToDate(new Date());
    setValidate("")
  };

  const handleColor = (color) => {
    setColor(color)
  }

  return (
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
          onClick={() => {
            if(!title, !color) {
              setValidate("Need to enter title and color")
              return
            }
            if(fromDate > toDate) {
              setValidate("The start date must be before the end date");
              return
            }
            {isUpdate
              ? handleColumnAdd(
                  id,
                  title,
                  fromDate,
                  toDate,
                  color.hex,
                  cards
                )
              : handleColumnAdd(
                  title,
                  fromDate,
                  toDate,
                  color.hex,
                  cards
                );}

                setTitle("")
                setFromDate(new Date())
                setToDate( new Date())
                setColor(null)
                setIsUpdate(false)
                setValidate("")
          }}
        >
          {isUpdate ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddColumnModal;
