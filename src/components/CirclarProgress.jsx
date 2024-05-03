import React, { useContext, useEffect } from 'react'
import styled from "styled-components"
import Clock from './Clock'
import { StateContext } from './StateProvider';

const CirclarProgress = () => {

  const {progress, setProgress, time, initTime} = useContext(StateContext)

  useEffect(()=> {
    setProgress(time / (initTime / 100))
  }, [setProgress, time])

  return (
    <OuterCircle progress = {progress}>
      <InnerCircle  >
          <Clock />
      </InnerCircle>
    </OuterCircle>
  );
};
export default CirclarProgress

const OuterCircle = styled.div`
  width: 22rem;
  height: 22rem;
  background: #9a1a1a;
  border-radius: 50%;
  display: grid;
  place-items: center ;
  background: conic-gradient(red ${({progress}) => progress}%, transparent ${({progress}) => progress}%);
`

const InnerCircle = styled.div`
  width: 20rem;
  height: 20rem;
  background: #e9d4d4;
  border-radius: 50%;
  display: grid;
  place-items: center ;
`