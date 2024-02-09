import React from 'react'
import "../pages/user/pomodoro/pomodoro.css"
import moment from 'moment';

const Clock = ({ timeLeft, startCountdown, stopCountdown, countdownActive }) => {
  return (
    <div>
      <div className='clock-container'onClick={countdownActive ? stopCountdown : startCountdown}>
        <h1 className='timer-text'>
          {moment.utc(timeLeft * 1000).format("mm:ss")}
        </h1>
        <h3 className='timer-text-btn' >
          {countdownActive ? "Stop" : "Start"}
        </h3>
      </div>
    </div>
  );
};
export default Clock