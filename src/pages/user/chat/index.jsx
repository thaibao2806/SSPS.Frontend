import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Assitant from "../../../assets/assistan.jpg"
import { tokens } from "../../../theme";
import {useTheme} from "@mui/material";

const ChatAI = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [anchorEl, setAnchorEl] = useState(null);
  const [chatContent, setChatContent] = useState('');
  const [conversation, setConversation] = useState([]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event) => {
    setChatContent(event.target.value);
  };

  const handleSendMessage = () => {
    if (chatContent.trim() !== '') {
      setConversation([...conversation, { sender: 'You', message: chatContent }]);
      setChatContent('');
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
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
      <Box sx={{ '& > :not(style)': { m: 1 } }}>
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
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          style={{ zIndex: 99999 }}
        >
          <Box
            sx={{
              p: 2,
              width: '400px',
              height: '600px',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '8px',
              boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.3)',
              backgroundColor: colors.primary[900],
            }}
          >
            <Box sx={{ marginBottom: '0px', borderBottom: '1px solid #ccc', paddingBottom: '5px', display:"flex"}}>
              <Stack direction="row" spacing={2}>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                >
                  <Avatar alt="Remy Sharp" src={Assitant} sx={{ width: 40, height: 40 }} />
                </StyledBadge>
              </Stack>
              <Typography variant="h4" sx={{paddingLeft:"10px", fontWeight:'550'}} >
                  Assistant AI
                  <div style={{fontSize:"14px", fontWeight:"500"}}>Is active</div>
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                marginBottom: '16px',
                padding: '8px',
              }}
            >
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    textAlign: 'left',
                    marginBottom: '8px',
                    wordBreak: 'break-word',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.sender === 'You' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      backgroundColor: msg.sender === 'You' ? '#00BFFF' : '#4CAF50',
                      color: '#fff',
                      borderRadius: msg.sender === 'You' ? '8px 8px 0 8px' : '8px 8px 8px 0',
                      padding: '8px',
                      display: 'inline-block',
                      maxWidth: '80%',
                      fontSize: "14px"
                    }}
                  >
                    {msg.message}
                  </Typography>
                </div>
              ))}
            </Box>
            <TextField
              multiline
              rows={1}
              variant="outlined"
              fullWidth
              autoFocus
              value={chatContent}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Fab
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
    </div>
  );
};

export default ChatAI;
