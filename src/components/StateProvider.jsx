import React, {createContext, useEffect, useState} from 'react'

export const StateContext = createContext();


const StateProvider = ({children}) => {
    const [workTime, setWorkTime] = useState(25*60)
    const [shortTime, setShortTime] = useState(5 * 60)
    const [longTime, setLongTime] = useState(30*60)
    const [initTime, setInitTime] = useState(0)
    const [activeTag, setActiveTag] = useState(0)
    const [progress, setProgress] = useState(55)
    const [time, setTime] = useState(100)
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
      switch(activeTag) {
        case 0: 
          setTime(workTime);
          setInitTime(workTime)
          break
        case 1:
          setTime(shortTime);
          setInitTime(shortTime);
          break
        case 2:
          setTime(longTime);
          setInitTime(longTime);
          break
        default:
          break
      }
    }, [activeTag, workTime, shortTime, longTime])
  return (
    <StateContext.Provider value={{activeTag, setActiveTag, progress, setProgress, time, setTime, isActive, setIsActive, initTime, setInitTime, workTime, setWorkTime, shortTime, setShortTime, longTime, setLongTime}}>{children}</StateContext.Provider>
  )
}

export default StateProvider