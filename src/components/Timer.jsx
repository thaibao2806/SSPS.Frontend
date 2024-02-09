import React, { useCallback, useEffect, useState } from 'react'
import "../pages/user/pomodoro/pomodoro.css"
import CirclarProgress from './CirclarProgress'
import moment from 'moment';
import Clock from './Clock';

const Timer = ({ currentTask, timeLeft, startCountdown, stopCountdown, countdownActive }) => {
  const [firstClick, setFirstClick] = useState(true);

  const handleInterval = useCallback(() => {
    if (countdownActive && timeLeft > 0) {
      setTimeLeft(prevTime => prevTime - 1);
    } else {
      stopCountdown();
      setFirstClick(true); // Đặt lại trạng thái của firstClick sau khi đếm ngược kết thúc
    }
  }, [countdownActive, timeLeft, stopCountdown]);

  useEffect(() => {
    if (firstClick && !countdownActive) {
      startCountdown();
      setFirstClick(false);
    }

    const timerId = setInterval(handleInterval, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [firstClick, countdownActive, handleInterval, startCountdown]);

  return (
    <div>
      <div className='timer-container'>
        <CirclarProgress timeLeft={timeLeft} startCountdown={startCountdown} stopCountdown={stopCountdown} countdownActive={countdownActive}/>
        {/* <div className='time-display'>
          {moment.utc(timeLeft * 1000).format("mm:ss")}
        </div> */}
      </div>
    </div>
  );
};
export default Timer;