import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './AccessPage.css';
import { storage } from '../firebase'; // Import initialized storage
import { ref, listAll, getDownloadURL } from "firebase/storage"; // Import Firebase storage functions

function AccessPagePersonal() {
  const { accessId } = useParams();
  const [accessDetails, setAccessDetails] = useState(null);
  const [grabProductDetails, setGrabProductDetails] = useState(null); // Initialize as null to differentiate from an empty array
  const [imageURLs, setImageURLs] = useState([]);

  useEffect(() => {
    const fetchAccessDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/access-details/${accessId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch access details');
        }
        const data = await response.json();
        setAccessDetails(data.warehouseAccessDetail); // Extracting warehouseAccessDetail
      } catch (error) {
        console.error('Error fetching access details:', error);
      }
    };

    const fetchGrabProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/access-details/${accessId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch grab product details');
        }
        const data = await response.json();
        setGrabProductDetails(data.grabProductDetails); // Extracting grabProductDetails
      } catch (error) {
        console.error('Error fetching grab product details:', error);
      }
    };

    fetchAccessDetails();
    fetchGrabProductDetails();
  }, [accessId]);

  const fetchImages = async () => {
    const listRef = ref(storage, `/${accessId}`);
    
    try {
      const res = await listAll(listRef);
      const urls = await Promise.all(res.items.map(item => getDownloadURL(item)));
      setImageURLs(urls);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  if (!accessDetails || grabProductDetails === null) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <>
    <div className="access-container">
      <h2 className="access-header">Access Details</h2>
      <div className="access-details">
        <p>Entered person: {accessDetails.username}</p>
        <p>Date: {accessDetails.AccessDate.split('T')[0]}</p>
        <p>Entered Time: {accessDetails.InTime}</p>
        <p>Exit Time: {accessDetails.OutTime}</p>
        <p>Items Brought: {grabProductDetails.length}</p>
      </div>

      <h2 className="access-header mt-2">Grab Product Details</h2>
      <div className="grab-product-details">
        {grabProductDetails.length > 0 ? (
          <ul>
            {grabProductDetails.map((product, index) => (
              <li key={index}>
                <p>Serial Number: {product.SerialNumber}</p>
                <p>Product Name: {product.productName || 'Not Available'}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No products grabbed.</p>
        )}
      </div>
      <button className = "load-btn"onClick={fetchImages}>Load Images</button>
    </div>
    <div className="images-container3">
      {imageURLs.map((url, index) => (
        <img key={index} src={url} alt={`Image ${index + 1}`} />
      ))}
    </div>
    </>
  );
}

export default AccessPagePersonal;
