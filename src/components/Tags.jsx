import React, { useContext } from 'react'
import styled, {css} from "styled-components"
import { StateContext } from './StateProvider';

const Tags = () => {
  const {activeTag, setActiveTag} = useContext(StateContext)

  const handleTagClick = (index) => {
    setActiveTag(index)
  }

  return (
      <TagsContainer >
        {["Work", "Short Break", "Long Break"].map((tag, i) => (
          <Tag onClick={() =>handleTagClick(i)} activeTag={activeTag === i} key={i}> {tag}</Tag>
        ))}
      </TagsContainer>
  );
};

export default Tags;

const TagsContainer = styled.div`
  background: #ccc;
  height: 3.5rem;
  width: 25rem;
  margin: 0 auto;
  border-radius: 5rem;
  display: flex;
  gap: 1;
  align-items: center;
`

const Tag = styled.button`
  all:unset;
  height: 3rem;
  text-align: center;
  border-radius: 5rem;
  flex: 1;
  font-size: 1rem;
  font-weight: bold;

  ${({activeTag}) => activeTag && css`
    background: #b85600;
  `}
`
