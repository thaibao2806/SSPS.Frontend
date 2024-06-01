import React, { useState } from 'react';
import styled from "styled-components";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, {text: newTask.trim(), completed: false}]);
      setNewTask('');
    }
  };

  const handleToggleComplete = (index) => {
    const updatedTasks = tasks.map((task, i) => 
      i === index ? {...task, completed: !task.completed} : task
    );
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <Container>
      <Title>Todo List</Title>
      <InputContainer>
        <StyledInput type="text" value={newTask} onChange={handleInputChange} />
        <StyledButton onClick={handleAddTask}>Add Task</StyledButton>
      </InputContainer>
      <StyledList>
        {tasks.map((task, index) => (
          <StyledListItem key={index} completed={task.completed}>
            <Checkbox type="checkbox" checked={task.completed} onChange={() => handleToggleComplete(index)} />
            {task.text}
            <DeleteButton onClick={() => handleDeleteTask(index)}>Delete</DeleteButton>
          </StyledListItem>
        ))}
      </StyledList>
    </Container>
  );
};

export default TodoList;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 4px;
  font-size: 1.6rem;

  @media (max-width: 1000px) {
    margin-top: 20px;
  }

  @media (max-width: 650px) {
    margin-top: 20px;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 600;
  padding: 0rem 0;
  text-align: center;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0rem 0;
`;

const StyledInput = styled.input`
  padding: 0.75rem;
  font-size:1rem;
  width: 20rem;
  border: none;
  border-radius: 1rem;
  margin-right: 1rem;
`;

const StyledButton = styled.button`
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: white;
  background: dodgerblue;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
`;

const StyledList = styled.ul`
  list-style: none;
  width: 27rem;
  padding: 0;
`;

const StyledListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  margin: 1rem 0;
  background: ${props => props.completed ? '#d3d3d3' : '#fff'};
  border-radius: 1rem;
`;

const Checkbox = styled.input`
  margin-right: 1rem;
  margin-left: 1rem;
  font-size: 1rem;
  transform: scale(2);
`;

const DeleteButton = styled.button`
  padding: 0.5rem 1rem;
  color: white;
  background: red;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  font-size: 1rem;
`;