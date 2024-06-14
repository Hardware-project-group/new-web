import {React,useEffect, useState} from 'react'
import "./user.css"
import UserCard from '../components/User/UserCard'

function User({ user }) {
     const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/get-user');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        // Handle error (e.g., show error message)
      }
    };

    fetchUsers();
  }, []);
  return (
     <div className='user-container'>
      {users.map((user) => (
        <UserCard key={user.userId} user={user} />
      ))}
    </div>
  )
}

export default User