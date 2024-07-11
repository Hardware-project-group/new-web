import React, { useEffect, useState } from 'react';
import './Stock.css';
import image from '../../assets/images/149071.png';

function StockDetail() {
  const [productDetails, setProductDetails] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch('http://localhost:5000/get-stock-details');
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        const data = await response.json();
        setProductDetails(data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, []);

  return (
    <div className='product-container'>
      {productDetails.map((product, index) => (
        <div key={index}>
          <p className='p-name'>Product Name: {product.productName}</p>
          <img src={image} alt="product" />
          <p className='p-code'>Product Code: {product.productCode}</p>
          <p className='stocklevel'>Stock: {product.stockLevel}</p>
          <p className={`stock-flag ${product.stockLevel < 5 ? 'red-flag' : 'green-flag'}`}>
            {product.stockLevel < 5 ? 'Low Stock' : 'In Stock'}
          </p>
        </div>
      ))}
    </div>
  );
}

export default StockDetail;
