/* eslint-disable linebreak-style */
import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const blogFormRef = useRef();

  const compareLikes = (a,b) => {
    return b.likes - a.likes;
  };

  const notifyText = (message,type='success') => {
    setNotification({ message, type });
    setTimeout(() => {setNotification(null);}, 3000);
  };

  useEffect(async() => {
    const initialBlogs = await blogService.getAll();
    setBlogs(initialBlogs.sort(compareLikes));
  },[]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('LoggedBloglistApp');
    if (loggedUserJSON){
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  },[]);

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('LoggedBloglistApp', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
    } catch (exception) {
      notifyText('Invalid username or password','error');
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('LoggedBloglistApp');
    window.location.reload();
  };

  const createBlog = async (blogObj) => {
    blogFormRef.current.toggleVisibility();
    try {
      const returnedBlog = await blogService.create(blogObj);
      notifyText(`New blog: ${returnedBlog.title} added successfully`);
      setBlogs(blogs.concat(returnedBlog).sort(compareLikes));
    } catch (error) {
      notifyText(error.message, 'error');
    }
  };

  const handleLike = async(id, blogObj) => {
    try {
      const updatedLikes = await blogService.update(id, blogObj);
      const updatedBlogs = [...blogs];
      const indexOfUpdatedBlog = updatedBlogs.findIndex(item => item.id === updatedLikes.id);
      updatedBlogs[indexOfUpdatedBlog] = updatedLikes;
      setBlogs(updatedBlogs.sort(compareLikes));
      notifyText('Blog updated successfully');
    } catch (error) {
      notifyText(error.message, 'error');
    }
  };

  const removeBlog = async(id) => {
    try {
      await blogService.remove(id);
      const blogsAfterRemove = blogs.filter(item => item.id !== id);
      notifyText('Remove blog successfully');
      setBlogs(blogsAfterRemove);
    } catch (error) {
      notifyText(error.message, 'error');
    }
  };

  const blogForm = () => (
    <Togglable ref={blogFormRef} buttonLabel = 'Add a new blog'>
      <BlogForm createBlog={createBlog} />
    </Togglable>
  );

  return (
    <>
      <Nav/>
      <Notification notification={notification} />
      {user === null
        ? <LoginForm handleLogin={handleLogin} />
        :
        <div className='bloglist'>
          <h2>List of blogs</h2>
          <h3 className='bloglist-userinfo'>
            {user.name} logged in {' '}
            <button onClick={handleLogout}>Logout</button>
          </h3>
          {blogForm()}
          {blogs.map((blog,i) =>
            <Blog
              key={i}
              blog={blog}
              username={user.username}
              handleLike={handleLike}
              removeBlog={removeBlog}
            />
          )}
        </div>
      }
      <Footer />
    </>
  );
};

export default App;