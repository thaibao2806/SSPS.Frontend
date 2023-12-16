import React from 'react'
import Rodal from 'rodal'
import "rodal/lib/rodal.css";
import css from './AddCardModal.module.css'
import { Box, Button, Dialog, DialogActions, TextField, Typography } from '@mui/material';


const AddCardModal = ({ visible, onClose, handleCardAdd, cardData }) => {
    const customStyles = {
        background: "rgb(58 58 58)",
        padding: "20px",
        width: "50%",
        top: "-3rem",
        height: "fit-content",
        maxWidth: "40rem"

    }
    const [title, setTitle] = React.useState('')
    const [detail, setDetail] = React.useState('')
    const [checkUpdate, setCheckUpdate] = React.useState(false)
    const [validate, setValidate] = React.useState("")

    React.useEffect(() => {
      // Set the initial state of the modal with the data of the clicked card
      if (cardData) {
        setTitle(cardData.title || "");
        setDetail(cardData.description);
        setCheckUpdate(true)
      } 
    }, [cardData]);

    const handleClose = () => {
        onClose()
        setTitle("")
        setDetail("")
        setCheckUpdate(false)
        setValidate("")
    }

    return (
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
            onClick={() => {
              if (!title) {
                setValidate("Need to enter title");
                return;
              }
              handleCardAdd(title, detail);
              setTitle("");
              setDetail("");
              setValidate("");
            }}
          >
            {checkUpdate ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    );
}

export default AddCardModal