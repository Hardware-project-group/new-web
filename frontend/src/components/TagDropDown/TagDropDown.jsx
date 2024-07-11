import React, { useEffect, useState } from 'react';

const TagDropDown = ({ onTagChange, refresh }) => {
    const [tagDetails, setTagDetails] = useState([]);

    useEffect(() => {
        const fetchTagDetails = async () => {
            try {
                const response = await fetch('http://localhost:5000/get-tag-details');
                if (!response.ok) {
                    throw new Error('Failed to fetch tag details');
                }
                const data = await response.json();
                setTagDetails(data);
            } catch (error) {
                console.error('Error fetching tag details:', error);
            }
        };

        fetchTagDetails();
    }, [refresh]);

    return (
        <select onChange={(e) => onTagChange(e.target.value)}>
            <option value="">Select a Tag</option>
            {tagDetails.map(tag => (
                <option key={tag.tagId} value={tag.tagId}>{tag.tagId}</option>
            ))}
        </select>
    );
};

export default TagDropDown;
