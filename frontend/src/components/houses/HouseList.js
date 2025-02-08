import React, { useEffect, useState } from 'react';
import axios from 'axios';

function HouseList() {
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/houses')
      .then(response => setHouses(response.data))
      .catch(error => console.error("Error fetching houses:", error));
  }, []);

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3>Daftar Rumah</h3>
      </div>
      <div className="card-body">
        {houses.length === 0 ? (
          <p>Tidak ada data rumah.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nomor Rumah</th>
                  <th>Status</th>
                  <th>Penghuni</th>
                </tr>
              </thead>
              <tbody>
                {houses.map(house => (
                  <tr key={house.id}>
                    <td>{house.house_number}</td>
                    <td>{house.status}</td>
                    <td>{house.currentResident ? house.currentResident.full_name : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default HouseList;