import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './access.css';

function AccessPage() {
  const [accessDetail, setAccessDetails] = useState([]);

  useEffect(() => {
    const fetchAccess = async () => {
      try {
        const response = await fetch('http://localhost:5000/get-access-details');
        if (!response.ok) {
          throw new Error('Failed to fetch access details');
        }
        const data = await response.json();
        setAccessDetails(data);
      } catch (error) {
        console.error('Error fetching access details:', error);
      }
    };

    fetchAccess();
  }, []);

    return (
      <>
        <h2 className='mb-1.5 text-2xl font-extrabold '>Warehouse Access Details</h2>
        <div className='w-full auto-cols-auto grid grid-cols-2 gap-4 '>
          {accessDetail.map((element, index) => (
             <Link to={`/access-details/${element.accessId}`} key={index}>
              <div className="component border-2 border-solid border-black px-3 py-2 rounded" >           
                  <p key={index} className='text-lg'>Entered person: <span className='font-extrabold ' > {element.username}</span></p>
                  <p key={index}>Date: <span> {element.accessDate.split('T')[0]}</span></p>
                  <p key={index}>Entered Time: <span> {element.InTime}</span></p>
                  <p key={index}>Exit Time: <span> {element.OutTime}</span></p>
              <p key={index}>Items Brought: <span> { element.grabProductCount}</span> <span className=''>View</span> </p>   
              </div>
            </Link>
          ))}
    </div>
      </>
  );
}

export default AccessPage;
