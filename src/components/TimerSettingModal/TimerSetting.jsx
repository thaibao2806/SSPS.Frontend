import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import React from 'react'

const TimerSetting = ({visible, onClose}) => {
  return (
    <div>
        <Dialog open={visible} onClose={onClose}>
        <Box p={2}>
            <DialogTitle id="alert-dialog-title">
                <h3>Timer Setting</h3>
            </DialogTitle>
            <DialogContent>
                <Box  style={{
                marginTop: "10px",
                marginBottom: "15px",
                fontWeight: "500",
                }} sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                  }}>
                    <TextField id="outlined-basic" label="Work" variant="outlined" style={{width: "30%"}} />
                    <TextField id="outlined-basic" label="Short Break" variant="outlined" style={{width: "30%"}}/>
                    <TextField id="outlined-basic" label="Long Break" variant="outlined" style={{width: "30%"}}/>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained" color='error'>Cancel</Button>
                <Button onClick={onClose} variant="contained" color='success' autoFocus>
                    Apply
                </Button>
            </DialogActions>
        </Box>
        </Dialog>
    </div>
  )
}

export default TimerSetting