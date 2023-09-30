import React, { useState, useEffect } from 'react';
import { startCase } from 'lodash';
import propertyListingsData from './PropertyListings';
import './PropertyListing.css'
const PropertyListingsTable = () => {
  const [propertyData, setPropertyData] = useState([]); // Renamed from 'data'
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    fetch('http://api.example.com/propertyListings') // Replace with your API endpoint
    .then(response => response.json())
    .then(data => setPropertyData(data))
    .catch(error => console.error('Error fetching data:', error));
    // Simulated API call, replace with actual fetch code
    // Using propertyListingsData instead of 'data'
    setPropertyData(propertyListingsData);
  }, []);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const sortedData = propertyData.sort((a, b) => {
    const factor = sortOrder === 'asc' ? 1 : -1;
    return a[sortColumn] > b[sortColumn] ? 1 * factor : -1 * factor;
  });

  const filteredData = sortedData.filter(item =>
    item.name.toLowerCase().includes(filterText.toLowerCase()) ||
    item.location.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <input className='input'
        type="text"
        placeholder="Search..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      <table className='table'>
        <thead>
          <tr className='name'>
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('price')}>Price</th>
            <th onClick={() => handleSort('location')}>Location</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>${item.price}</td>
              <td>{item.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button className='btn' onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button className='btn' onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default PropertyListingsTable;
