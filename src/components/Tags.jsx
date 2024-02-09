import React, { useState } from 'react'
import "../pages/user/pomodoro/pomodoro.css"


const Tags = ({ setCurrentTask, setTimeLeft, setCountdownActive }) => {
  const handleTagClick = (tag, duration) => {
    setCurrentTask(tag);
    setTimeLeft(duration);
    setCountdownActive(false);
  };

  return (
    <div>
      <div className='tag-container'>
        {["Work", "Short Break", "Long Break"].map((tag, i) => (
          <button
            className={`btn-tags`}
            key={i}
            onClick={() => handleTagClick(tag, getDuration(tag))}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

const getDuration = (task) => {
  switch (task) {
    case "Work":
      return 25 * 60;
    case "Short Break":
      return 5 * 60;
    case "Long Break":
      return 15 * 60;
    default:
      return 0;
  }
};

export default Tags;
