import React, { useState } from 'react';
import TagDropDown from '../components/TagDropDown/TagDropDown';
import ProductDropDown from '../components/ProductType/ProductDropDown';
import './update.css';

function UpdateStock() {
    const [selectedTag, setSelectedTag] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
     const [refresh, setRefresh] = useState(0);

    const handleSubmit = async () => {
        const payload = {
            tagId: selectedTag,
            productId: selectedProduct,
            serialNumber: serialNumber
        };

        try {
            const response = await fetch('http://localhost:5000/update-stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Failed to submit data');
            }

            const result = await response.json();
            console.log('Success:', result);
            setSelectedTag('');
            setSelectedProduct('');
            setSerialNumber('');
            alert("Stock Details Updated!");
            setRefresh(refresh + 1);

            // Optionally reset form or show success message
        } catch (error) {
            console.error('Error submitting form:', error);
            alert("Error to update data? Try Again!");
        }
    };

    return (
        <div>
            <h1 className='title'>Update New Stock</h1>
            <div className='dropdown2'>
                <TagDropDown onTagChange={setSelectedTag} refresh={refresh}/>
                <ProductDropDown onProductChange={setSelectedProduct} refresh={refresh} />
                <input
                    type="text"
                    name="serial"
                    id="serial"
                    placeholder='Enter the serial number'
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                />
            </div>
            <input type="button" value="Submit" name='submit' onClick={handleSubmit} />
        </div>
    );
}

export default UpdateStock;
