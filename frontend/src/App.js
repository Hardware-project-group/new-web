import React, { useState, useEffect } from 'react';
import './styles/global.css';
import { Route, Routes, BrowserRouter, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Nav from './components/Nav/Nav';
import LoginForm from './components/LoginForm/LoginForm';
import User from './pages/user';
import Profile from './pages/Profile';
import Access from './pages/Access';
import StockSync from './pages/StockSync';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
      navigate('/');
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
          <Nav user={user} onSignOut={handleLogout} />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<LoginForm onLogin={handleLogin} user={user} />} />
            {user &&
              <>
                <Route path='/user' element={<User />} user={ user} />
                <Route path='/profile/:id' element={<Profile/>} user={ user} />
                <Route path='/access' element={<Access />} user={user} />
                <Route path='/stockDetails' element={<StockSync />} user={user} />
              </>
            }
          </Routes>
      </main>
    </div>
  );
}

export default App;
