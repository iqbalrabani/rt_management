import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ResidentsList() {
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/residents')
      .then(response => setResidents(response.data))
      .catch(error => console.error("Error fetching residents:", error));
  }, []);

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3>Daftar Penghuni</h3>
      </div>
      <div className="card-body">
        {residents.length === 0 ? (
          <p>Tidak ada data penghuni.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Status</th>
                  <th>Telepon</th>
                </tr>
              </thead>
              <tbody>
                {residents.map(resident => (
                  <tr key={resident.id}>
                    <td>{resident.full_name}</td>
                    <td>{resident.status}</td>
                    <td>{resident.phone_number}</td>
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

export default ResidentsList;