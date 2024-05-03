import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import React, { useContext, useState } from 'react';
import { StateContext } from '../StateProvider';

const TimerSetting = ({ visible, onClose }) => {
    const {
        workTime,
        setWorkTime,
        shortTime,
        setShortTime,
        longTime,
        setLongTime,
    } = useContext(StateContext);

    const [workInput, setWorkInput] = useState(workTime / 60);
    const [shortInput, setShortInput] = useState(shortTime / 60);
    const [longInput, setLongInput] = useState(longTime / 60);

    const handleApply = () => {
        const parsedWorkTime = parseFloat(workInput);
        const parsedShortTime = parseFloat(shortInput);
        const parsedLongTime = parseFloat(longInput);

        if (!isNaN(parsedWorkTime) && !isNaN(parsedShortTime) && !isNaN(parsedLongTime)) {
            setWorkTime(parsedWorkTime * 60);
            setShortTime(parsedShortTime * 60);
            setLongTime(parsedLongTime * 60);
        }

        onClose();
    };

    return (
        <div>
            <Dialog open={visible} onClose={onClose}>
                <Box p={2}>
                    <DialogTitle id="alert-dialog-title">
                        <h3>Timer Setting</h3>
                    </DialogTitle>
                    <DialogContent>
                        <Box
                            style={{
                                marginTop: '10px',
                                marginBottom: '15px',
                                fontWeight: '500',
                            }}
                            sx={{
                                '& > :not(style)': { m: 1, width: '25ch' },
                            }}
                        >
                            <TextField
                                value={workInput}
                                label="Work"
                                variant="outlined"
                                style={{ width: '30%' }}
                                onChange={(e) => setWorkInput(e.target.value)}
                            />
                            <TextField
                                value={shortInput}
                                label="Short Break"
                                variant="outlined"
                                style={{ width: '30%' }}
                                onChange={(e) => setShortInput(e.target.value)}
                            />
                            <TextField
                                value={longInput}
                                label="Long Break"
                                variant="outlined"
                                style={{ width: '30%' }}
                                onChange={(e) => setLongInput(e.target.value)}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={onClose}
                            variant="contained"
                            color="error"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleApply}
                            variant="contained"
                            color="success"
                            autoFocus
                        >
                            Apply
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </div>
    );
};

export default TimerSetting;
