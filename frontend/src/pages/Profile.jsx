import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Profile({user}) {
  const { userId } = useParams();
  const [User, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

//   useEffect(() => {
//     // Replace this URL with the actual URL to fetch user data
//     const fetchUser = async () => {
//       try {
//         const response = await fetch(`https://api.example.com/users/${userId}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch user data');
//         }
//         const data = await response.json();
//         setUser(data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [userId]);

  useEffect(() => {
    if (user) {
      document.title = `${user.username}'s Profile`;
    }
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
      <div>
          <p>{ userId}</p>
      {/* <h1>{user.username}'s Profile</h1>
      <img src={user.profilePicture || 'default-profile.png'} alt={`${user.username}'s profile`} />
      <p>User ID: {user.id}</p>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Type: {user.userType}</p>
      Add more user details as needed */}
    </div>
  );
}

export default Profile;
