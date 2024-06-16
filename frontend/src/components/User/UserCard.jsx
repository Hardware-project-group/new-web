import React from 'react'
import { useNavigate } from 'react-router-dom';
import './UserCard.css'
import image from '../../assets/images/149071.png'

function UserCard({ user }) {
   
  const navigate = useNavigate();

  const handleclick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
      <div className='container' onClick={() => handleclick(user.userId)}>
          <img src={image} alt="user profile" className='image' />
          <h2 className='name'>{user.username}</h2>
          <p className='type'>User Type: <span>{ user.userType}</span> </p>
    </div>
  )
}

export default UserCard