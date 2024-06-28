import React, { useState } from 'react';
import './login.css';
import logo from '../../assets/images/logo.svg';

function LoginForm({ onLogin , user}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

    return ( 
        <section >
            { !user ? (
    <div className='login-container'>
      <div className='upper'>
        <img src={logo} alt="stocksync logo" className='logo' />
        <h2>Welcome to StockSync</h2>
      </div>
      <form onSubmit={handleSubmit} className='down'>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          autoComplete="off"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name='password'
          id='password'
          autoComplete="off"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type='submit'>Login</button>
      </form>
                </div>
            ) : (
                    <div>
                        <div className="navigatesection">
                            <span className='btn'><a href='/stockDetails'>Stock Details</a></span>
                            {user.userType === "access" || user.userType === "admin" && 
                                <span className='btn'><a href="/access">Access History</a></span>
                            }
                            {user.userType === "admin" && 
                                <>
                                    <span className='btn'>Update Stock</span>
                                    <span className='btn'><a href="/user">User Details</a></span>
                                    <span className='btn'>System Setting</span>
                                </>
                                
                            }
                        </div>

                    </div >
        )}
    </section>
  );
}

export default LoginForm;
