import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Nav.css';
import logo from '../../assets/images/logo.svg';

const Nav = ({ user, onSignOut }) => {
  const [toggleDropDown, setToggleDropDown] = useState(false);

  return (
    <nav className='flex-between w-full mb-16 pt-3'>
      <a href="/" className='flex gap-2 items-center'>
        <img
          src={logo}
          alt="Stocksync Logo"
          width={30}
          height={30}
          className='object-contain'
        />
        <p>StockSync</p>
      </a>

      {/* Desktop Navigation */}
      <div className="sm:flex hidden items-center">
        {user ? (
          <div className="flex gap-3 md:gap-5">
            <a href="/login" className='black_btn'>
              View Warehouse
            </a>
            <button type='button' className='outline_btn' onClick={onSignOut}>
              Log Out
            </button>
            <a href="/profile">
              <img
                src={user.image}
                width={37}
                height={37}
                className='rounded-full'
                alt='Profile'
              />
            </a>
          </div>
        ) : (
          <button type='button' className='black_btn'>
            <a href="/login">Log In</a>
          </button>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex relative items-center">
        {user ? (
          <div className="flex items-center">
            <img
              src={user.image}
              width={37}
              height={37}
              className='rounded-full cursor-pointer'
              alt='Profile'
              onClick={() => setToggleDropDown(!toggleDropDown)}
            />
            {toggleDropDown && (
              <div className="dropdown">
                <a
                  href="/profile"
                  className='dropdown_link'
                  onClick={() => setToggleDropDown(false)}
                >
                  Setting
                </a>
                <a
                  href="/login"
                  className='dropdown_link'
                  onClick={() => setToggleDropDown(false)}
                >
                  View Warehouse
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setToggleDropDown(false);
                    onSignOut();
                  }}
                  className='mt-5 w-full black_btn'
                >
                  LogOut
                </button>
              </div>
            )}
          </div>
        ) : (
          <button type='button' className='black_btn'>
            <a href="/login">Log In</a>
          </button>
        )}
      </div>
    </nav>
  );
};

// PropTypes for type-checking the props
Nav.propTypes = {
  user: PropTypes.object, // User object, assuming it has an image property
  onSignOut: PropTypes.func.isRequired, // Function to handle sign-out
};

export default Nav;
