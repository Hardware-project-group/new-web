import React from 'react'
import './UserCard.css'
import image from '../../assets/images/149071.png'

function UserCard({user}) {
  return (
      <div className='container'>
          <img src={image} alt="user profile" className='image' />
          <h2 className='name'>{user.username}</h2>
          <p className='type'>User Type: <span>{ user.userType}</span> </p>
    </div>
  )
}

export default UserCard