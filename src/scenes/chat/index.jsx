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
import Assitant from "../../assets/assistan.jpg";
import { tokens } from "../../theme";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextareaAutosize,
  useTheme,
} from "@mui/material";
import { chatBox, chatBoxAdmin } from "../../data/chatApi";
import DeleteIcon from "@mui/icons-material/Delete";
import { is } from "date-fns/locale";
import TingTing from "../../assets/tingting.mp3";
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
import AddMoneyPlan from "../../components/MoneyPlan/AddMoneyPlan";
import AddNote from "../../components/Notes/AddNote";
import AddColumn from "../../components/Todo/AddColumn";
import AddCard from "../../components/Todo/AddCard";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createAxios } from "../../createInstance";
import { updateToken } from "../../redux/authSlice";
import jwt_decode from "jwt-decode";

const LargeImageOverlay = ({ imageUrl, onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.8)",
        zIndex: 10000,
      }}
    >
      <img
        src={imageUrl}
        alt="Large Image"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "90%",
          maxHeight: "90%",
        }}
      />
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: "20px",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </div>
  );
};

const ChatAIAdmin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login?.currentUser);
  let axoisJWT = createAxios(user, dispatch, updateToken);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [chatContent, setChatContent] = useState("");
  const [msgersation, setmsgersation] = useState([]);
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
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [imageUrls, setImageUrls] = useState("");
  const [showLargeImage, setShowLargeImage] = useState(false);
  const [userId, setUserId] = useState();

  useEffect(() => {
    if (user) {
      const decode = jwt_decode(user?.data.accessToken);
      setUserId(decode?.id);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [msgersation]);

  useEffect(() => {
    // Kiểm tra và xóa cuộc trò chuyện sau 24 giờ
    const savedmsgersations = JSON.parse(
      localStorage.getItem("msgersationsAdmin")
    );
    if (savedmsgersations === null) {
      setmsgersation([]);
      return;
    }
    const storedVolumeState = localStorage.getItem("isVolumeOnAdmin");
    if (storedVolumeState !== null) {
      setPopoverVolumn(JSON.parse(storedVolumeState));
    }
    setmsgersation(savedmsgersations);
    scrollToBottom();
    console.log(moneyPLan, chatContent);
  }, []);

  const handleDeleteMessages = () => {
    // Xóa tin nhắn từ state
    setIsConfirmDeleteOpen(false);
    setAnchorEl1(null);
    setmsgersation([]);
    // Xóa tin nhắn từ localStorage
    localStorage.removeItem("msgersationsAdmin");
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
      localStorage.setItem("isVolumeOnAdmin", JSON.stringify(newState));
      return newState;
    });
  };

  const handleSendMessage = async () => {
    if (chatContent.trim() !== "") {
      const currentTime = new Date().getTime();
      const newmsgersation = {
        sender: "You",
        message: chatContent,
        time: currentTime,
      };
      const updatedmsgersation = [...msgersation, newmsgersation];
      setmsgersation(updatedmsgersation);
      localStorage.setItem(
        "msgersationsAdmin",
        JSON.stringify(updatedmsgersation)
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
      let res = await chatBoxAdmin(
        chatContent,
        userId,
        true,
        axoisJWT,
        user.data?.accessToken
      );
      console.log("test", res);

      if (res.data.result === true) {
        console.log(res.data.data);
        // setIsTyping(isTyping.slice(0, -1));
        if (res.data.data?.type === "other") {
          setResponseChat(false);
          let updatedmsgersation;
          if (
            res.data.data?.response.includes(
              "Unfortunately, I was not able to answer your question"
            ) &&
            res.data.data?.response.includes("Column not found")
          ) {
            popoverVolumn ? null : new Audio(TingTing).play();
            updatedmsgersation = [
              ...msgersation,
              { sender: "You", message: chatContent },
              { sender: "Ai", message: "No data" },
            ];
          } else if (
            res.data.data?.response.includes(
              "Unfortunately, I was not able to answer your question"
            )
          ) {
            popoverVolumn ? null : new Audio(TingTing).play();
            updatedmsgersation = [
              ...msgersation,
              { sender: "You", message: chatContent },
              {
                sender: "Ai",
                message: "Sorry, I can't answer this question right now",
              },
            ];
          } else {
            popoverVolumn ? null : new Audio(TingTing).play();
            updatedmsgersation = [
              ...msgersation,
              { sender: "You", message: chatContent },
              { sender: "Ai", message: res.data.data?.response },
            ];
          }

          setmsgersation(updatedmsgersation);
          localStorage.setItem(
            "msgersationsAdmin",
            JSON.stringify(updatedmsgersation)
          );
          setChatContent("");
          console.log(res.data.data?.response);
        } else if (res.data.data?.type === "image") {
          popoverVolumn ? null : new Audio(TingTing).play();
          const imageUrl = res.data.data?.response;
          const updatedmsgersation = [
            ...msgersation,
            { sender: "You", message: chatContent },
            { sender: "Ai", message: imageUrl, isImage: true },
          ];
          setmsgersation(updatedmsgersation);
          localStorage.setItem(
            "msgersationsAdmin",
            JSON.stringify(updatedmsgersation)
          );
          setChatContent("");
          setResponseChat(false);
        } else if (res.data.data?.type === "json") {
          popoverVolumn ? null : new Audio(TingTing).play();
          // const json = JSON.parse(res.data.data?.response);
          let jsonResponse;
          try {
            jsonResponse = JSON.parse(res.data.data?.response);
            console.log("Parsed JSON Response:", jsonResponse);
          } catch (e) {
            console.error("Failed to parse JSON:", e);
            jsonResponse = "Invalid JSON format";
          }

          const updatedmsgersation = [
            ...msgersation,
            { sender: "You", message: chatContent },
            {
              sender: "Ai",
              message: jsonResponse,
              type: "json",
            },
          ];
          setmsgersation(updatedmsgersation);
          localStorage.setItem(
            "msgersationsAdmin",
            JSON.stringify(updatedmsgersation)
          );
          setChatContent("");
          setResponseChat(false);
        }
      } else {
        setResponseChat(false);
        popoverVolumn ? null : new Audio(TingTing).play();
        const updatedmsgersation = [
          ...msgersation,
          { sender: "You", message: chatContent },
          {
            sender: "Ai",
            message: "Sorry, I can't answer this question right now",
          },
        ];
        setmsgersation(updatedmsgersation);
        localStorage.setItem(
          "msgersationsAdmin",
          JSON.stringify(updatedmsgersation)
        );
        setChatContent("");
      }
    } catch (e) {
      setResponseChat(false);
      popoverVolumn ? null : new Audio(TingTing).play();
      const updatedmsgersation = [
        ...msgersation,
        { sender: "You", message: chatContent },
        { sender: "Ai", message: "Sorry, I cannot answer your question yet" },
      ];
      setmsgersation(updatedmsgersation);
      localStorage.setItem(
        "msgersationsAdmin",
        JSON.stringify(updatedmsgersation)
      );
      setChatContent("");
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

  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    //setImageDialogOpen(true);
    setShowLargeImage(true);
    // handleClose();
  };

  const handleCloseLargeImage = () => {
    setShowLargeImage(false);
    setSelectedImageUrl("");
  };
  return (
    <div>
      {/* {imageUrls ? <img src={imageUrls} alt="Firebase Image" /> : <p>Loading image...</p>} */}
      {showLargeImage && (
        <LargeImageOverlay
          imageUrl={selectedImageUrl}
          onClose={handleCloseLargeImage}
        />
      )}
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
          style={{ zIndex: showLargeImage ? 9998 : 9999 }}
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
                    <ListItemText>Clear msgersation</ListItemText>
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
              {msgersation?.map((msg, index) => (
                <Box
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
                      whiteSpace: "pre-line", // Giữ nguyên các dòng mới
                    }}
                  >
                    {msg.isImage ? (
                      <img
                        src={msg.message}
                        alt="AI response"
                        style={{
                          cursor: "pointer",
                          maxWidth: "250px",
                          maxHeight: "250px",
                        }}
                        onClick={() => handleImageClick(msg.message)}
                      />
                    ) : msg.type === "json" ? (
                      msg.message && Array.isArray(msg.message) && msg.message.length > 0 ? (
                        <TableContainer>
                          <Table
                            key={index}
                            border="1"
                            sx={{
                              borderCollapse: "collapse",
                              width: "100%",
                              "& .MuiTableCell-root": {
                                borderColor: "white", // Apply white border color to all cells
                                borderWidth: 1,
                                borderStyle: "solid",
                              },
                              "& .MuiTableHead-root .MuiTableCell-root": {
                                borderColor: "white", // Apply white border color to header cells
                              },
                              "& .MuiTableRow-root": {
                                borderColor: "white", // Apply white border color to rows
                              },
                            }}
                             size="small" aria-label="a dense table"
                          >
                            <TableHead>
                              <TableRow>
                                {Object.keys(msg.message[0]).map((key) => (
                                  <TableCell key={key} style={{ borderColor: "white", color: "white" }}>{key}</TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {msg.message.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                  {Object.values(row).map(
                                    (value, cellIndex) => (
                                      <TableCell key={cellIndex} style={{ borderColor: "white", color: "white" }}>{value}</TableCell>
                                    )
                                  )}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        "Data is not an array"
                      )
                    ) : (
                      msg.message
                    )}
                  </Typography>
                </Box>
              ))}
              {responseChat && (
                <Typography variant="body2">Typing...</Typography>
              )}

              <div ref={endOfChatRef} />
            </Box>
            <TextField
              multiline
              minRows={1}
              maxRows={4}
              variant="outlined"
              fullWidth
              autoFocus
              value={chatContent}
              onChange={handleChange}
              onKeyPress={(event) => {
                if (event.key === "Enter" && !event.shiftKey && !responseChat) {
                  event.preventDefault(); // Prevents the addition of a new line
                  handleSendMessage();
                }
              }}
              InputProps={{
                inputComponent: TextareaAutosize,
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
      <AddMoneyPlan
        isDialogOpenCreate={moneyPLan}
        closeCreateDialog={handleCloseMoneyPlan}
      />
      <AddNote isOpenCreateNote={note} closeDialog={() => setNote(false)} />
      <AddColumn visible={todo} oncloseNote={() => setTodo(false)} />
      <AddCard visible={task} onCloseTask={() => setTask(false)} />

      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="lg"
      >
        <DialogContent>
          <img
            src={selectedImageUrl}
            alt="Enlarged"
            style={{ width: "100%" }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setImageDialogOpen(false);
              handleClick();
            }}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChatAIAdmin;
