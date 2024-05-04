import {
  Box,
  Button,
  Dialog,
  DialogActions,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createTodoCard, getAllTodoNote } from "../../data/todo";
import { toast } from "react-toastify";

const AddCard = ({ visible, onCloseTask }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login?.currentUser);

  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [checkUpdate, setCheckUpdate] = useState(false);
  const [validate, setValidate] = useState("");
  const [todoNote, setTodoNote] = useState([]);
  const [todoId, setTodoId] = useState("");

  useEffect(() => {
    getAllNote();
  }, []);

  const getAllNote = async () => {
    let res = await getAllTodoNote(user.data?.accessToken);
    if (res && res.data.msgCode === "SUCCESS") {
      setTodoNote(res.data?.data);
    }
  };

  const handleClose = () => {
    onCloseTask();
    setTitle("");
    setTodoId("")
    setDetail("");
    setCheckUpdate(false);
    setValidate("");
  };

  const handleCardAdd = async () => {
    try {
      if (!title || !todoId) {
        setValidate("Need to enter title");
        return;
      }
      const card = {
        id: new Date().getTime(),
        title,
        description: detail,
      };
      let res = await createTodoCard(todoId, card, user.data?.accessToken);
      if (res && res.data.msgCode === "SUCCESS") {
        toast.success("Create success!!");
        handleClose()
      } else {
        toast.error("Create failed!!!");
      }
    } catch (error) {
        console.log(error);
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
      <Dialog open={visible} onClose={handleClose}>
        <Box p={2}>
          <Typography
            variant="h4"
            style={{
              marginTop: "10px",
              marginBottom: "15px",
              fontWeight: "500",
            }}
          >
            {checkUpdate ? "Edit card" : "Add Card"}
          </Typography>
          <span className="text-danger">{validate}</span>
          <TextField
            select
            autoFocus
            label="Select Column"
            value={todoId}
            onChange={(e) => setTodoId(e.target.value)}
            style={{ marginTop: "10px", width: "100%" }}
          >
            {todoNote.map((note) => (
              <MenuItem key={note.id + note.title} value={note.id}>
                {note.title}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Title"
            autoFocus
            style={{ marginTop: "10px" }}
            value={title}
            fullWidth
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            maxRows={5}
            style={{ marginTop: "10px" }}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />
        </Box>
        <DialogActions>
          <Button
            variant="contained"
            style={{ marginTop: "10px", backgroundColor: "#0487D9" }}
            // onClick={() => {
            //   if (!title) {
            //     setValidate("Need to enter title");
            //     return;
            //   }
            //   handleCardAdd(title, detail);
            //   setTitle("");
            //   setDetail("");
            //   setValidate("");
            // }}
            onClick={handleCardAdd}
          >
            {checkUpdate ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddCard;
