import React, { useCallback, useEffect, useState } from 'react'
import "../pages/user/pomodoro/pomodoro.css"
import CirclarProgress from './CirclarProgress'
import moment from 'moment';
import Clock from './Clock';
import styled from "styled-components"

const Timer = () => {
  

  return (
    <TimerContainer>
        <CirclarProgress/>
        {/* <div className='time-display'>
          {moment.utc(timeLeft * 1000).format("mm:ss")}
        </div> */}
    </TimerContainer>
  );
};
export default Timer;

const TimerContainer = styled.div`
  background: conic-gradient(#ccc, #000 150deg, #ccc);
  width: 25rem;
  height: 25rem;
  margin: 2rem auto;
  border-radius: 50%;
  display: grid;
  place-items: center ;
  box-shadow: -50px -50px 150px rgba(158, 158, 158, 0.2), 50px -10px 100px rgba(0, 0, 0, 0.5) ;
`