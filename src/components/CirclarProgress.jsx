import React, { useState } from 'react'
import "../pages/user/pomodoro/pomodoro.css"
import Clock from './Clock'

const CirclarProgress = ({ timeLeft, startCountdown, stopCountdown, countdownActive }) => {
  return (
    <div>
      <div className='outer-circle'>
        <div className='inner-circle'>
          <Clock timeLeft={timeLeft} startCountdown={startCountdown} stopCountdown={stopCountdown} countdownActive={countdownActive} />
        </div>
      </div>
    </div>
  );
};
export default CirclarProgress