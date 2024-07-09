import React, { useEffect, useState } from 'react';
import "./user.css";
import UserCard from '../components/User/UserCard';

function User() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newuser, setNewuser] = useState({});
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    userType: 'admin'
  });

  const handleBack = () => {
    setPage(false);
    setSuccess(false);
  }
const handleEnroll1 = async () => {
  const encodedData = new URLSearchParams(`fingerID=${newuser.userId}`);

  try {
    const response = await fetch('http://192.168.137.196/enroll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: encodedData.toString(),
    });
    console.log(response);
    const responseBody = await response.text(); // Read the response body as text
    console.log(responseBody);

    if (response.ok) {
      alert('Enroll Success: ' + responseBody); // Display the response body in the alert
      document.getElementById('outside').style.display = "none";
    } else {
      alert("Failed to enroll fingerprint: " + responseBody); // Display the error message in the alert
    }
  } catch (error) {
    console.log("Error:", error);
    alert("Something went wrong: " + error.message); // Display the error message in the alert
  }
};

  
const handleEnroll2 = async () => {
  const encodedData = new URLSearchParams(`fingerID=${newuser.userId}`);

  try {
    const response = await fetch('http://192.168.137.196/enroll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: encodedData.toString(),
    });
    console.log(response);
    const responseBody = await response.text(); // Read the response body as text
    console.log(responseBody);

    if (response.ok) {
      alert('Enroll Success: ' + responseBody); // Display the response body in the alert
      document.getElementById('outside').style.display = "none";
    } else {
      alert("Failed to enroll fingerprint: " + responseBody); // Display the error message in the alert
    }
  } catch (error) {
    console.log("Error:", error);
    alert("Something went wrong: " + error.message); // Display the error message in the alert
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    const encodedData = new URLSearchParams(formData);

    try {
      const response = await fetch('http://localhost:5000/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: encodedData.toString(),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Account Created');
        setNewuser(data);
        setSuccess(true);
        console.log(newuser);
      } else {
        console.error('Error creating user:', data);
        alert('Failed to create account');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create account');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

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
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      {!page ? 
        <span className='addUser' onClick={() => setPage(true)}>Add User</span>
        :
        <span className='addUser' onClick={()=>handleBack() }>Back</span>
      }
      {page?
        <form onSubmit={handleSubmit}>
          <div className='form'>
            <div className='row'>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder='nalakadinesh'
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className='row'>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder='create tempory password'
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className='row'>
              <select name="userType" id="userType" value={formData.userType} onChange={handleChange}>
                <option value="admin">admin</option>
                <option value="viewer">Only View</option>
                <option value="accesser">Only Access</option>
              </select>
            </div>
            <div className="row">
              <button type='submit' className='addUser'>Create User</button>
            </div>
          </div>
        </form>
        : 
        <>
          <div className='user-container'>
            {users.map((user) => (
              <UserCard key={user.userId} user={user} />
            ))}
          </div>
        </>
      }
      {success && 
        <div className="complete">
          <p className='success'>User Created Successfully</p>
          <p className='uname'>Username : {newuser.username}</p>
          <p className='mb-2 mt-2'>User Finger ID : <span className='ID'>{newuser.userId}</span> </p>
          <button className='addUser mr-2' id='outside' onClick={()=> handleEnroll1(newuser.userId)}>Enroll OutSide Fingerprint</button>
          <button className='addUser' onClick={()=> handleEnroll2(newuser.userId)}>Enroll Inside Fingerprint</button>
        </div>
      
      }
    </>
  );
}
export default User;
