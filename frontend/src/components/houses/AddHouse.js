import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddHouse() {
  const [houseNumber, setHouseNumber] = useState('');
  const [status, setStatus] = useState('tidak_dihuni');
  const [currentResidentId, setCurrentResidentId] = useState('');
  const [residents, setResidents] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/residents')
      .then(response => setResidents(response.data))
      .catch(error => console.error("Error fetching residents:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      house_number: houseNumber,
      status,
      current_resident_id: currentResidentId || null
    };

    axios.post('http://localhost:8000/api/houses', payload)
      .then(response => {
        setMessage("Rumah berhasil ditambahkan!");
        setHouseNumber('');
        setStatus('tidak_dihuni');
        setCurrentResidentId('');
      })
      .catch(error => {
        console.error("Error adding house:", error);
        setMessage("Terjadi kesalahan saat menambahkan rumah.");
      });
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3>Tambah Rumah</h3>
      </div>
      <div className="card-body">
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nomor Rumah:</label>
            <input 
              type="text" 
              className="form-control"
              value={houseNumber} 
              onChange={(e) => setHouseNumber(e.target.value)}
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Status:</label>
            <select 
              className="form-select"
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="dihuni">Dihuni</option>
              <option value="tidak_dihuni">Tidak Dihuni</option>
            </select>
          </div>
          {status === 'dihuni' && (
            <div className="mb-3">
              <label className="form-label">Pilih Penghuni:</label>
              <select 
                className="form-select"
                value={currentResidentId}
                onChange={(e) => setCurrentResidentId(e.target.value)}
              >
                <option value="">-- Pilih Penghuni --</option>
                {residents.map(resident => (
                  <option key={resident.id} value={resident.id}>
                    {resident.full_name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button type="submit" className="btn btn-primary">Tambah Rumah</button>
        </form>
      </div>
    </div>
  );
}

export default AddHouse;