import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SendIcon from "@mui/icons-material/Send";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Assitant from "../../../assets/assistan.jpg";
import { tokens } from "../../../theme";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  useTheme,
} from "@mui/material";
import { chatBox } from "../../../data/chatApi";
import DeleteIcon from "@mui/icons-material/Delete";
import { is } from "date-fns/locale";
import TingTing from "../../../assets/tingting.mp3";
import {
  Close,
  Minimize,
  Remove,
  Settings,
  VoiceChat,
  VolumeMute,
  VolumeMuteOutlined,
  VolumeOff,
  VolumeUp,
} from "@mui/icons-material";
import AddMoneyPlan from "../../../components/MoneyPlan/AddMoneyPlan";
import AddNote from "../../../components/Notes/AddNote";
import AddColumn from "../../../components/Todo/AddColumn";
import AddCard from "../../../components/Todo/AddCard";

const ChatAI = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [chatContent, setChatContent] = useState("");
  const [conversation, setConversation] = useState([]);
  const [responseChat, setResponseChat] = useState(false);
  const [popoverVolumn, setPopoverVolumn] = useState(false);
  const endOfChatRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const open = Boolean(anchorEl);
  const openSetting = Boolean(anchorEl1);
  const [moneyPLan, setMoneyPlan] = useState(false);
  const [note, setNote] = useState(false);
  const [todo, setTodo] = useState(false);
  const [task, setTask] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);
  
  

  useEffect(() => {
    // Kiểm tra và xóa cuộc trò chuyện sau 24 giờ
    const savedConversations = JSON.parse(
      localStorage.getItem("conversations")
    );
    if (savedConversations === null) {
      setConversation([]);
      return;
    }
    const storedVolumeState = localStorage.getItem("isVolumeOn");
    if (storedVolumeState !== null) {
      setPopoverVolumn(JSON.parse(storedVolumeState));
    }
    setConversation(savedConversations);
    scrollToBottom();
    console.log(moneyPLan, chatContent)
  }, []);

  const handleDeleteMessages = () => {
    // Xóa tin nhắn từ state
    setIsConfirmDeleteOpen(false);
    setAnchorEl1(null);
    setConversation([]);
    // Xóa tin nhắn từ localStorage
    localStorage.removeItem("conversations");
  };

  const handleCloseDialog = () => {
    // setIsDialogOpen(false);
    setIsConfirmDeleteOpen(false);
    // Đóng Popover khi Dialog được đóng
    // setAnchorEl(null);
  };

  const scrollToBottom = () => {
    endOfChatRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setTimeout(scrollToBottom, 0);
    // setResponseChat(false);
  };

  const handleClickSetting = (event) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    // setResponseChat(true);
  };

  const handleCloseSetting = () => {
    setAnchorEl1(null);
    setIsConfirmDeleteOpen(false);
  };

  const handleChange = (event) => {
    setChatContent(event.target.value);
  };

  const handleToggleVolume = () => {
    setPopoverVolumn((prevState) => {
      const newState = !prevState;
      // Lưu trạng thái mới vào Local Storage
      localStorage.setItem("isVolumeOn", JSON.stringify(newState));
      return newState;
    });
  };

  const handleSendMessage = async () => {
    if (chatContent.trim() !== "") {
      const currentTime = new Date().getTime();
      const newConversation = {
        sender: "You",
        message: chatContent,
        time: currentTime,
      };
      const updatedConversation = [...conversation, newConversation];
      setConversation(updatedConversation);
      localStorage.setItem(
        "conversations",
        JSON.stringify(updatedConversation)
      );
      setChatContent("");
      await responseChatBox();
    }
  };

  const handleCloseMoneyPlan = () => {
    setMoneyPlan(false);
  };

  const responseChatBox = async () => {
    setResponseChat(true);
    try {
      if (chatContent.trim().toLowerCase() === "@moneyplan") {
        // Hiển thị cảnh báo yêu cầu người dùng tạo kế hoạch
        setResponseChat(false); // Tắt trạng thái phản hồi
        setMoneyPlan(true)
        popoverVolumn ? null : new Audio(TingTing).play();
        const updatedConversation = [
          ...conversation,
          { sender: "You", message: chatContent },
          { sender: "Ai", message: "Please create a financial plan!" },
        ];
        setConversation(updatedConversation);
        localStorage.setItem(
          "conversations",
          JSON.stringify(updatedConversation)
        );
        setChatContent("")
        return;
      }

      if (chatContent.trim().toLowerCase() === "@todolist") {
        // Hiển thị cảnh báo yêu cầu người dùng tạo kế hoạch
        setResponseChat(false); // Tắt trạng thái phản hồi
        setTodo(true)
        popoverVolumn ? null : new Audio(TingTing).play();
        const updatedConversation = [
          ...conversation,
          { sender: "You", message: chatContent },
          { sender: "Ai", message: "Please create a todolist column!" },
        ];
        setConversation(updatedConversation);
        localStorage.setItem(
          "conversations",
          JSON.stringify(updatedConversation)
        );
        setChatContent("")
        return;
      }

      if (chatContent.trim().toLowerCase() === "@note") {
        // Hiển thị cảnh báo yêu cầu người dùng tạo kế hoạch
        setResponseChat(false); // Tắt trạng thái phản hồi
        setNote(true)
        popoverVolumn ? null : new Audio(TingTing).play();
        const updatedConversation = [
          ...conversation,
          { sender: "You", message: chatContent },
          { sender: "Ai", message: "Please create a todolist column!" },
        ];
        setConversation(updatedConversation);
        localStorage.setItem(
          "conversations",
          JSON.stringify(updatedConversation)
        );
        setChatContent("")
        return;
      }

      if (chatContent.trim().toLowerCase() === "@task") {
        // Hiển thị cảnh báo yêu cầu người dùng tạo kế hoạch
        setResponseChat(false); // Tắt trạng thái phản hồi
        setTask(true)
        popoverVolumn ? null : new Audio(TingTing).play();
        const updatedConversation = [
          ...conversation,
          { sender: "You", message: chatContent },
          { sender: "Ai", message: "Please create a todolist column!" },
        ];
        setConversation(updatedConversation);
        localStorage.setItem(
          "conversations",
          JSON.stringify(updatedConversation)
        );
        setChatContent("")
        alert("Please create a financial plan!");
        return;
      }
      let res = await chatBox(chatContent);
      // setIsTyping([...isTyping, true]);

      if (res.result === true) {
        console.log(res.data);
        // setIsTyping(isTyping.slice(0, -1));
        setResponseChat(false);
        popoverVolumn ? null : new Audio(TingTing).play();
        const updatedConversation = [
          ...conversation,
          { sender: "You", message: chatContent },
          { sender: "Ai", message: res.data?.message },
        ];
        setConversation(updatedConversation);
        localStorage.setItem(
          "conversations",
          JSON.stringify(updatedConversation)
        );
        setChatContent("")
        console.log(res.data?.message);
      } else {
        setResponseChat(false);
        popoverVolumn ? null : new Audio(TingTing).play();
        const updatedConversation = [
          ...conversation,
          { sender: "You", message: chatContent },
          {
            sender: "Ai",
            message: "Sorry, I can't answer this question right now",
          },
        ];
        setConversation(updatedConversation);
        localStorage.setItem(
          "conversations",
          JSON.stringify(updatedConversation)
        );
        setChatContent("")
      }
    } catch (e) {
      setResponseChat(false);
      popoverVolumn ? null : new Audio(TingTing).play();
      const updatedConversation = [
        ...conversation,
        { sender: "You", message: chatContent },
        { sender: "Ai", message: "Sorry, I cannot answer your question yet" },
      ];
      setConversation(updatedConversation);
      localStorage.setItem(
        "conversations",
        JSON.stringify(updatedConversation)
      );
      setChatContent("")
    }
  };

  const id = open ? "simple-popover" : undefined;
  const idSetting = open ? "simple-popover-setting" : undefined;

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#44b700",
      color: "#44b700",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));

  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  }));

  return (
    <div>
      <Box sx={{ "& > :not(style)": { m: 1 } }}>
        <Box>
          <Fab color="secondary" aria-label="chat" onClick={handleClick}>
            {/* <MarkUnreadChatAltOutlinedIcon sx={{ fontSize: '30px', color:"white" }} /> */}
            <Stack direction="row" spacing={2}>
              <Avatar
                alt="Remy Sharp"
                src={Assitant}
                sx={{ width: 60, height: 60 }}
              />
            </Stack>
          </Fab>
        </Box>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          style={{ zIndex: 99999 }}
        >
          <Box
            sx={{
              p: 2,
              width: "400px",
              height: "600px",
              display: "flex",
              flexDirection: "column",
              borderRadius: "8px",
              boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
              backgroundColor: colors.primary[900],
            }}
          >
            <Box
              sx={{
                marginBottom: "0px",
                borderBottom: "1px solid #ccc",
                paddingBottom: "5px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Stack direction="row" spacing={2}>
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <Avatar
                      alt="Remy Sharp"
                      src={Assitant}
                      sx={{ width: 40, height: 40 }}
                    />
                  </StyledBadge>
                </Stack>
                <Typography
                  variant="h4"
                  sx={{ paddingLeft: "10px", fontWeight: "550" }}
                >
                  Assistant AI
                  <div style={{ fontSize: "14px", fontWeight: "500" }}>
                    Is active
                  </div>
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="center">
                <IconButton id="settings" onClick={handleClickSetting}>
                  <Settings style={{ fontSize: "25px" }} />
                </IconButton>
                <IconButton onClick={handleClose}>
                  <Remove style={{ fontSize: "25px" }} />
                </IconButton>
              </Box>
              <Popover
                id={idSetting}
                open={openSetting}
                anchorEl={anchorEl1}
                onClose={handleCloseSetting}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                style={{ zIndex: 99999 }}
              >
                <MenuList>
                  <MenuItem onClick={() => setIsConfirmDeleteOpen(true)}>
                    <ListItemIcon>
                      <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Clear conversation</ListItemText>
                  </MenuItem>
                  {isConfirmDeleteOpen && (
                    <Card>
                      <CardContent>
                        Are you sure you want to delete this message?
                      </CardContent>
                      <CardActions>
                        <Button
                          onClick={handleCloseDialog}
                          style={{ backgroundColor: "#0487D9", color: "white" }}
                          color="primary"
                          size="small"
                        >
                          Cancle
                        </Button>
                        <Button
                          onClick={handleDeleteMessages}
                          color="primary"
                          style={{ backgroundColor: "red", color: "white" }}
                          autoFocus
                          size="small"
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Card>
                  )}
                  <MenuItem onClick={handleToggleVolume}>
                    <ListItemIcon>
                      {popoverVolumn ? (
                        <VolumeUp fontSize="small" />
                      ) : (
                        <VolumeOff fontSize="small" />
                      )}
                    </ListItemIcon>
                    <ListItemText>
                      {popoverVolumn ? "Turn on volumn" : "Turn off volumn"}
                    </ListItemText>
                  </MenuItem>
                </MenuList>
              </Popover>
            </Box>

            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                marginBottom: "16px",
                padding: "8px",
              }}
            >
              {conversation?.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    textAlign: "left",
                    marginBottom: "8px",
                    wordBreak: "break-word",
                    display: "flex",
                    flexDirection: "column",
                    alignItems:
                      msg.sender === "You" ? "flex-end" : "flex-start",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      backgroundColor:
                        msg.sender === "You" ? "#00BFFF" : "#4CAF50",
                      color: "#fff",
                      borderRadius:
                        msg.sender === "You"
                          ? "8px 8px 0 8px"
                          : "8px 8px 8px 0",
                      padding: "8px",
                      display: "inline-block",
                      maxWidth: "80%",
                      fontSize: "14px",
                    }}
                  >
                    {msg.message}
                  </Typography>
                </div>
              ))}
              {responseChat && (
                <Typography variant="body2">Typing...</Typography>
              )}

              <div ref={endOfChatRef} />
            </Box>
            <TextField
              multiline
              rows={1}
              maxRows={4}
              variant="outlined"
              fullWidth
              autoFocus
              value={chatContent}
              onChange={handleChange}
              onKeyPress={(event) => {
                if (event.key === "Enter" && !responseChat) {
                  event.preventDefault(); // Prevents the addition of a new line
                  handleSendMessage();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Fab
                      disabled={chatContent.trim() === "" || responseChat}
                      color="secondary"
                      aria-label="send"
                      onClick={handleSendMessage}
                      size="small"
                    >
                      <SendIcon />
                    </Fab>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Popover>
      </Box>
      <AddMoneyPlan isDialogOpenCreate={moneyPLan} closeCreateDialog={handleCloseMoneyPlan} />
      <AddNote isOpenCreateNote = {note} closeDialog={() => setNote(false)}/>
      <AddColumn visible={todo} oncloseNote={() => setTodo(false)}/>
      <AddCard visible={task} onCloseTask={() => setTask(false)}/>
    </div>
  );
};

export default ChatAI;
