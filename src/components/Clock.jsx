import React,{useContext, useEffect, useState}  from 'react'
import styled from "styled-components"
import { StateContext } from './StateProvider';
import Bring from "../assets/audio.mp3"

const Clock = () => {
  const {time, setTime, isActive, setIsActive, initTime} = useContext(StateContext)
  useEffect(()=> {
    if(isActive && time > 0) {
      const interval = setInterval(()=> {
        setTime((time) => time -1)
      }, 1000)
  
      return () => clearInterval(interval)
    } else if( time === 0) {
      new Audio(Bring).play()
    }
  }, [time, isActive])

  const toggleClock = () => {
    setIsActive(!isActive)
  }

  const resetTime =() => {
    setTime(initTime)
    setIsActive(false)
  }

  const getTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min < 10 ? "0" + min : min}:${sec < 10 ?"0"+ sec:sec}`
  }
  return (
    <ClockContainer>
      <TimerText>
        {getTime(time)}
      </TimerText>
      <StartPauseButton onClick={toggleClock}>{isActive ? "Pause" : "Start"}</StartPauseButton>
      {time === 0 && <ResetButton onClick={resetTime}>RESET</ResetButton>}
    </ClockContainer>
  );
};
export default Clock

const ClockContainer = styled.div`
  display: grid;
  place-items: center;
`

const TimerText = styled.h3`
  font-size: 5rem;
`

const StartPauseButton = styled.button`
  all:unset;
  text-align: center;
  font-size: 2rem;
  text-transform: uppercase;
  letter-spacing: 1rem;
`

const ResetButton = styled(StartPauseButton)`
  color: red;
`