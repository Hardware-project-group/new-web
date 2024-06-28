import React from 'react'
import './Stock.css'
import image from '../../assets/images/149071.png'

function StockDetail() {
  return (
      <div className='product-container'>
          <p className='p-name'>Product Name</p>
          <img src={image} alt="product" />
          <p className='p-code'>Product Code</p>
          <p className='stocklevel'>Stock : 1</p>
          <p>Stock Flag</p>
    </div>
  )
}

export default StockDetail