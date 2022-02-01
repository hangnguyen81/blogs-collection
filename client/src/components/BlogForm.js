import React,{ useState } from 'react';
import PropTypes from 'prop-types';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [likes, setLikes] = useState(0);
  const [summary, setSummary] = useState('');

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title,
      author,
      url,
      likes,
      summary
    });
    setTitle('');
    setAuthor('');
    setUrl('');
    setLikes(0);
    setSummary('');
  };
  return(
    <div className='createBlogForm'>
      <h3 className='title'>CREATE NEW BLOG</h3>
      <form onSubmit={addBlog} className='login-form'>
            Title: <input type='text' value={title} name='title' id='title' onChange={({ target }) => {setTitle(target.value);}}/>
            Author: <input type='text' value={author} name='author' id='author' onChange={({ target }) => {setAuthor(target.value);}}/>
            Blog URL: <input type='text' value={url} name='url' id='url' onChange={({ target }) => {setUrl(target.value);}} />
            Likes: <input type='text' value={likes} name='likes' id='likes' onChange={({ target }) => {setLikes(Number(target.value));}} />
            Summary: <textarea value={summary} name='summary' id='summary' onChange={({ target }) => {setSummary(target.value);}}/>
        <button id='createBlog-button' type="submit">Create blog</button>
      </form>
    </div>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
};

export default BlogForm;