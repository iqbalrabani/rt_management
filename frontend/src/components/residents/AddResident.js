import React, { useState } from 'react';
import axios from 'axios';

function AddResident({ initialData, onSuccess }) {
  const [fullName, setFullName] = useState(initialData ? initialData.full_name : '');
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState(initialData ? (initialData.status === 'tetap' ? 'Tetap' : 'Kontrak') : 'Tetap');
  const [phone, setPhone] = useState(initialData ? initialData.phone_number : '');
  const [maritalStatus, setMaritalStatus] = useState(initialData ? (initialData.marital_status === 'menikah' ? 'Menikah' : 'Belum') : 'Belum');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('full_name', fullName);
      if (photo) {
        formData.append('ktp_photo', photo);
      }
      formData.append('status', status === 'Tetap' ? 'tetap' : 'kontrak');
      formData.append('phone_number', phone);
      formData.append('marital_status', maritalStatus === 'Belum' ? 'belum' : 'menikah');

      if (initialData) {
        await axios.put(`http://localhost:8000/api/residents/${initialData.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage("Penghuni berhasil diperbarui!");
      } else {
        await axios.post('http://localhost:8000/api/residents', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage("Penghuni berhasil ditambahkan!");
        setFullName('');
        setPhoto(null);
        setStatus('Tetap');
        setPhone('');
        setMaritalStatus('Belum');
        window.dispatchEvent(new Event('residentAdded'));
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(initialData ? "Error updating resident:" : "Error adding resident:", error);
      const errMsg = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message;
      setMessage(initialData 
        ? `Gagal memperbarui penghuni: ${errMsg}` 
        : `Gagal menambahkan penghuni: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3>{initialData ? "Edit Penghuni" : "Tambah Penghuni"}</h3>
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
              required={!initialData} 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Status Penghuni:</label>
            <select 
              className="form-select"
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Tetap">Tetap</option>
              <option value="Kontrak">Kontrak</option>
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
              <option value="Menikah">Menikah</option>
              <option value="Belum">Belum</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Memproses..." : initialData ? "Simpan Perubahan" : "Tambah Penghuni"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddResident;