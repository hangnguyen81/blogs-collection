import React, { useState } from 'react';
import PropTypes from 'prop-types';

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin(username, password);
    setUsername('');
    setPassword('');
  };
  return(
    <section className='login'>
      <h2>Login to application</h2>
      <form onSubmit={handleSubmit} className='login-form'>
        <div>
          <p>Username</p>
          <input
            id='username'
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <p>Password</p>
          <input
            id='password'
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id='login-button' type="submit">login</button>
      </form>
    </section>

  );
};

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
};

export default LoginForm;