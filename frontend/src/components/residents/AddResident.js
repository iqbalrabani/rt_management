import React, { useState } from 'react';
import axios from 'axios';

function AddResident() {
  const [fullName, setFullName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState('tetap');
  const [phone, setPhone] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('belum');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('full_name', fullName);
    formData.append('ktp_photo', photo);
    formData.append('status', status);
    formData.append('phone_number', phone);
    formData.append('marital_status', maritalStatus);

    axios.post('http://localhost:8000/api/residents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(response => {
      setMessage("Penghuni berhasil ditambahkan!");
      setFullName('');
      setPhoto(null);
      setStatus('tetap');
      setPhone('');
      setMaritalStatus('belum');
    })
    .catch(error => {
      console.error("Error adding resident:", error);
      setMessage("Terjadi kesalahan saat menambahkan penghuni.");
    });
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3>Tambah Penghuni</h3>
      </div>
      <div className="card-body">
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="form-label">Nama Lengkap:</label>
            <input 
              type="text" 
              className="form-control"
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Foto KTP:</label>
            <input 
              type="file" 
              className="form-control"
              onChange={(e) => setPhoto(e.target.files[0])} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Status Penghuni:</label>
            <select 
              className="form-select"
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="tetap">Tetap</option>
              <option value="kontrak">Kontrak</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Nomor Telepon:</label>
            <input 
              type="text" 
              className="form-control"
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Status Pernikahan:</label>
            <select 
              className="form-select"
              value={maritalStatus} 
              onChange={(e) => setMaritalStatus(e.target.value)}
            >
              <option value="menikah">Menikah</option>
              <option value="belum">Belum</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Tambah Penghuni</button>
        </form>
      </div>
    </div>
  );
}

export default AddResident;