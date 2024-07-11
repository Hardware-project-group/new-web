import React, { useEffect, useState } from 'react';

const ProductDropDown = ({ onProductChange,refresh }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/get-product-details');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [refresh]);

    return (
        <select onChange={(e) => onProductChange(e.target.value)}>
            <option value="">Select a Product</option>
            {products.map(product => (
                <option key={product.productId} value={product.productId}>{product.productName}</option>
            ))}
        </select>
    );
};

export default ProductDropDown;
