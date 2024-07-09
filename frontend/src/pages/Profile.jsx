import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import image from '../assets/images/149071.png'

function Profile({user}) {
  const params = useParams();
  const { id } = params;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace this URL with the actual URL to fetch user data
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:5000/profile/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user data ${id}`);
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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


  const handleEnroll1 = async () => {
  const encodedData = new URLSearchParams(`fingerID=${userData.userId}`);

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
  const encodedData = new URLSearchParams(`fingerID=${userData.userId}`);

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



  return (
    <div className='flex flex-col items-center border-2 border-solid border-orange-300 py-5 px-8 rounded'>
      <img src={ image} alt={ userData.username} className='w-20'/>
      <p className='py-1 font-bold text-lg'>{ userData.username}</p>
      <p className='font-bold text-red-600'>{userData.userType}</p>
      <div>
        <p>Outside Fingerprint Status: {userData.OutsideFinger === "true" ? <span className='text-rose-950 font-bold'>Enrolled</span> : <span>Not Enrolled</span>}</p>
        <p>Outside Fingerprint Status: {userData.InsideFinger === "true" ? <span className='text-rose-950 font-bold'>Enrolled</span> : <span>Not Enrolled</span>}</p>
      </div>
      <div>
        {userData.OutsideFinger === "false" && <span className='black_btn mb-1 cursor-pointer' onClick={()=>handleEnroll1()}>Enroll Outside Finger</span>}
        {userData.InsideFinger === "false" && <span className='black_btn cursor-pointer' onClick={()=>handleEnroll2()}>Enroll Inside Finger</span>}
      </div>
    </div>
  );
}

export default Profile;
