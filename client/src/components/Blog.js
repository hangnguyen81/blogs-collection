import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, username, handleLike, removeBlog }) => {
  const [visible, setVisible] = useState(false);
  const display = { display: visible? '':'none' };
  const toggleVisibility = () => setVisible(!visible);
  const { id, title, url, author, likes, summary } = blog;

  const likeBlog = () => {
    const updateObj = {
      title,
      author,
      url,
      likes: likes + 1,
      summary
    };
    handleLike(id, updateObj);
  };

  const renderRemoveButton = () => {
    if (blog.creator.username === username)
      return <button onClick={() => {removeBlog(id);}}>Remove</button>;
    else
      return null;
  };

  return (
    <div className='blog-details'>
      <h4 className='blog-title'>
        {title}. Author: {author}
        <button onClick={() => {toggleVisibility();}}>{visible?'Hide':'View'}</button>
      </h4>
      <div style={display}>
        <p>{url}</p>
        <p className='likes'>Favourite: {likes} likes <button onClick={() => {likeBlog();}}>Like</button></p>
        <p>Creator: {blog.creator.name}</p>
        <p className='blog-info blog-info-small'>Summary: {summary}</p>
        {renderRemoveButton()}
      </div>
    </div>

  );
};

Blog.propTypes = {
  handleLike: PropTypes.func.isRequired
};

export default Blog;