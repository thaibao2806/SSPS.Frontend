import React, { useEffect, useState } from "react";
import Tags from "../../../components/Tags";
import "./pomodoro.css";
import Timer from "../../../components/Timer";
import SettingsIcon from "@mui/icons-material/Settings";
import TimerSetting from "../../../components/TimerSettingModal/TimerSetting";
import styled from "styled-components";
import TodoList from "./todolist";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { useMediaQuery, useTheme } from "@mui/material";

const Pomodoro = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery('(max-width: 1000px)');
  const isLargeScreen = useMediaQuery('(max-width: 1280px)');
  const [openModal, setOpenModal] = useState(false);
  const [currentTask, setCurrentTask] = useState("Work");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [countdownActive, setCountdownActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTodo, setIsTodo] = useState(false);

  useEffect(() => {
    if (countdownActive && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
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
      <BoxPomodoro className="pomodoro">
        <div>
          <Title>Pomodoro</Title>

          <Tags
            setCurrentTask={setCurrentTask}
            setTimeLeft={setTimeLeft}
            setCountdownActive={setCountdownActive}
          />
          <Timer
            currentTask={currentTask}
            timeLeft={timeLeft}
            startCountdown={startCountdown}
            stopCountdown={stopCountdown}
          />
          <BoxButton>
            <div onClick={() => setOpenModal(true)} className="icons">
              <SettingsIcon
                className="icon-btn"
                style={{ fontSize: "xxx-large" }}
              />
            </div>
            <TimerSetting
              visible={openModal}
              onClose={() => setOpenModal(false)}
            />
            <div onClick={() => setIsTodo(!isTodo)} className="icons">
              <PlaylistAddIcon
                className="icon-btn"
                style={{ fontSize: "xxx-large", marginLeft: "20px" }}
              />
            </div>
          </BoxButton>
        </div>
        {isTodo && <TodoList />}
        {/* <TodoList /> */}
      </BoxPomodoro>
    </div>
  );
};

export default Pomodoro;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 600;
  padding: 0rem 0;
  text-align: center;
`;

const BoxPomodoro = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-top: 10px;

  @media (max-width: 1000px) {
    display: block;
  }

  @media (max-width: 650px) {
    display: block;
  }
`;

const BoxButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

 
`;
