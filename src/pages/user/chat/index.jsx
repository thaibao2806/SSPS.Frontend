import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import MarkUnreadChatAltOutlinedIcon from '@mui/icons-material/MarkUnreadChatAltOutlined';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SendIcon from '@mui/icons-material/Send';

const ChatAI = () => {
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

  return (
    <div>
      <Box sx={{ '& > :not(style)': { m: 1 } }}>
        <Box>
          <Fab color="secondary" aria-label="chat" onClick={handleClick}>
            <MarkUnreadChatAltOutlinedIcon sx={{ fontSize: '30px' }} />
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
              backgroundColor: '#fff',
            }}
          >
            <Typography variant="h3" sx={{ marginBottom: '16px', borderBottom: '1px solid #ccc', paddingBottom: '8px' }}>
              Assistant AI
            </Typography>
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
