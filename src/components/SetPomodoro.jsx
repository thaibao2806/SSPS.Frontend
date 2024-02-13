import React, { useContext, useState } from 'react'
import { SettingsContext } from '../context/SettingsContext'

const SetPomodoro = () => {

    const [newTimer, setNewTimer] = useState({
        work: 10,
        short: 5,
        long: 15,
        active: 'work'
    })

    const {updateExecute} = useContext(SettingsContext)

    const handleChange = input => {
        const {name, value} = input.target
        switch (name) {
            case 'work':
                setNewTimer({
                    ...newTimer,
                    work: parseFloat(value)
                })
                break;
            case 'shortBreak':
                setNewTimer({
                    ...newTimer,
                    short: parseFloat(value)
                })
                break;
            case 'longBreak':
                setNewTimer({
                    ...newTimer,
                    long: parseFloat(value)
                })
                break;
        }
    }
    const handleSubmit = e => {
        e.preventDefault()
        updateExecute(newTimer)
    }
    return (
        <div className="form-containers">
            <form noValidate onSubmit={handleSubmit}>
                <div className="input-wrappers">
                    <input className="input" type="number" name="work" onChange={handleChange} value={newTimer.work} />
                    <input className="input" type="number" name="shortBreak" onChange={handleChange} value={newTimer.short} />
                    <input className="input" type="number" name="longBreak" onChange={handleChange} value={newTimer.long} />
                </div>
                <button className="btn-pomodoro" type='submit'>Set Timer</button>
            </form>
        </div>
    )
}

export default SetPomodoro