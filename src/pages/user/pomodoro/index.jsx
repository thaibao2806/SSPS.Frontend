import React, { useEffect, useState } from 'react'
import Tags from '../../../components/Tags'
import "./pomodoro.css"
import Timer from '../../../components/Timer'
import SettingsIcon from '@mui/icons-material/Settings';
import { tokens } from "../../../theme";
import { useTheme, } from "@mui/material";
import moment from 'moment';
import TimerSetting from '../../../components/TimerSettingModal/TimerSetting';
import styled from "styled-components"

const Pomodoro = () => {
  const [openModal, setOpenModal] = useState(false);
  const [currentTask, setCurrentTask] = useState("Work");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [countdownActive, setCountdownActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (countdownActive && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);

      return () => {
        clearInterval(timerId);
      };
    } else {
      setCountdownActive(false);
    }
  }, [countdownActive, timeLeft]);

  const startCountdown = () => {
    setIsPaused(false);
    setCountdownActive(true);
  };

  const stopCountdown = () => {
    setIsPaused(true);
    setCountdownActive(false);
  };

  return (
    <div>
      <Title>Pomodoro</Title>
      <Tags setCurrentTask={setCurrentTask} setTimeLeft={setTimeLeft} setCountdownActive={setCountdownActive} />
      <Timer currentTask={currentTask} timeLeft={timeLeft} startCountdown={startCountdown} stopCountdown={stopCountdown} />
      <div onClick={() => setOpenModal(true)} className='icons'>
        <SettingsIcon className='icon-btn' style={{ fontSize: "xxx-large" }} />
      </div>
      <TimerSetting visible={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
};

export default Pomodoro;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 600;
  padding: 0rem 0;
  text-align: center;
`