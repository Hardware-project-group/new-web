import React, { useState, useEffect } from 'react';
import './styles/global.css';
import { Route, Routes, BrowserRouter, redirect } from 'react-router-dom';
import Home from './pages/Home';
import Nav from './components/Nav/Nav';
import LoginForm from './components/LoginForm/LoginForm';
import User from './pages/user';
import Profile from './pages/Profile';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = async (username, password) => {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username,
        password,
      }),
      credentials: 'include',
    });

    const result = await response.json();

    if (response.ok) {
      setUser(result.session); // Assuming the backend sends the session object
    } else {
      console.error('Login failed:', result);
      alert("Invalid username or password .. Try again!");
    }
  };

  const handleLogout = async () => {
    const response = await fetch('http://localhost:5000/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      setUser(null);
    } else {
      console.error('Logout failed');
      alert("Failed Try again");
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch('http://localhost:5000/check-session', {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.json();
      if (response.ok && result.session) {
        setUser(result.session);
      }
    };

    checkSession();
  }, []);

  return (
    <div>
      <div className="main">
        <div className='gradient'></div>
      </div>
      <main className='app'>
        <BrowserRouter>
          <Nav user={user} onSignOut={handleLogout} />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<LoginForm onLogin={handleLogin} user={user} />} />
            <Route path='/user' element={<User />} user={ user} />
            <Route path='/profile' element={<Profile/>} user={ user} />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
