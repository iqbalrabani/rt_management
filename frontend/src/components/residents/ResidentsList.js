import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ResidentsList() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [message, setMessage] = useState('');

  // Base URL sesuai konfigurasi backend
  const baseUrl = 'http://localhost:8000';

  // Fungsi helper untuk menghasilkan URL foto yang valid.
  const getPhotoUrl = (photoPath) => {
    if (!photoPath) return '';
    if (photoPath.startsWith('http')) return photoPath;
    if (photoPath.includes('storage/')) {
      return `${baseUrl}/${photoPath.replace(/^\/+/, '')}`;
    }
    return `${baseUrl}/storage/${photoPath.replace(/^\/+/, '')}`;
  };

  // Fungsi untuk mengambil data penghuni dari API
  const fetchResidents = () => {
    setLoading(true);
    axios
      .get(`${baseUrl}/api/residents`)
      .then((response) => {
        setResidents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching residents:", error);
        const errMsg =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : error.message;
        setMessage(`Gagal mengambil data penghuni: ${errMsg}`);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchResidents();
    window.addEventListener('residentAdded', fetchResidents);
    return () => {
      window.removeEventListener('residentAdded', fetchResidents);
    };
  }, []);

  // Saat tombol Edit ditekan, ambil data penghuni dan
  // konversi nilai status dan marital_status ke format yang diharapkan
  // oleh backend update: "Tetap" atau "Kontrak" untuk status,
  // "Menikah" atau "Belum" untuk marital_status.
  const handleEdit = (resident) => {
    setEditingId(resident.id);
    setEditData({
      full_name: resident.full_name,
      status: resident.status
        ? resident.status.charAt(0).toUpperCase() + resident.status.slice(1).toLowerCase()
        : '',
      phone_number: resident.phone_number,
      marital_status: resident.marital_status
        ? resident.marital_status.charAt(0).toUpperCase() + resident.marital_status.slice(1).toLowerCase()
        : '',
      current_photo: resident.ktp_photo,
      new_ktp_photo: null,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  // Update field non-file
  const handleChange = (e, field) => {
    setEditData({ ...editData, [field]: e.target.value });
  };

  // Tangani input file untuk foto KTP (unggahan baru)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEditData({ ...editData, new_ktp_photo: file });
  };

  // Saat menyimpan perubahan, gunakan FormData untuk mengirim data ke API.
  // Karena mengirim file, gunakan multipart form-data dan override method menjadi PUT.
  const handleSaveEdit = async (id) => {
    try {
      const formData = new FormData();
      formData.append('full_name', editData.full_name);
      formData.append('status', editData.status);
      formData.append('phone_number', editData.phone_number);
      formData.append('marital_status', editData.marital_status);
      if (editData.new_ktp_photo) {
        formData.append('ktp_photo', editData.new_ktp_photo);
      }
      // Override method untuk PUT
      formData.append('_method', 'PUT');

      await axios.post(`${baseUrl}/api/residents/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      fetchResidents();
      setEditingId(null);
      setEditData({});
      setMessage("Penghuni berhasil diperbarui!");
    } catch (error) {
      console.error("Error updating resident:", error);
      const errMsg =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message;
      setMessage(`Gagal memperbarui penghuni: ${errMsg}`);
    }
  };

  // Fungsi untuk memformat tampilan status (hanya untuk tampilan)
  const capitalizeStatus = (status) => {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3>Daftar Penghuni</h3>
      </div>
      <div className="card-body">
        {message && <div className="alert alert-info">{message}</div>}
        {loading ? (
          <p>Loading...</p>
        ) : residents.length === 0 ? (
          <p>Tidak ada data penghuni.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  {/* Kolom No */}
                  <th>No</th>
                  <th>Nama</th>
                  <th>Foto KTP</th>
                  <th>Status Penghuni</th>
                  <th>Telepon</th>
                  <th>Status Pernikahan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {residents.map((resident, index) => (
                  <tr key={resident.id}>
                    {/* Kolom No */}
                    <td>{index + 1}</td>
                    {/* Kolom Nama */}
                    <td>
                      {editingId === resident.id ? (
                        <input
                          type="text"
                          value={editData.full_name}
                          onChange={(e) => handleChange(e, 'full_name')}
                          className="form-control"
                          required
                        />
                      ) : (
                        resident.full_name
                      )}
                    </td>
                    {/* Kolom Foto KTP */}
                    <td>
                      {editingId === resident.id ? (
                        <>
                          {editData.current_photo && !editData.new_ktp_photo && (
                            <img
                              src={getPhotoUrl(editData.current_photo)}
                              alt="KTP Current"
                              style={{ maxWidth: '100px', marginBottom: '5px' }}
                            />
                          )}
                          {editData.new_ktp_photo && (
                            <img
                              src={URL.createObjectURL(editData.new_ktp_photo)}
                              alt="KTP New"
                              style={{ maxWidth: '100px', marginBottom: '5px' }}
                            />
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            onChange={handleFileChange}
                          />
                        </>
                      ) : resident.ktp_photo ? (
                        <img
                          src={getPhotoUrl(resident.ktp_photo)}
                          alt="KTP"
                          style={{ maxWidth: '100px' }}
                        />
                      ) : (
                        '-'
                      )}
                    </td>
                    {/* Kolom Status Penghuni */}
                    <td>
                      {editingId === resident.id ? (
                        <select
                          value={editData.status}
                          onChange={(e) => handleChange(e, 'status')}
                          className="form-select"
                          required
                        >
                          <option value="Tetap">Tetap</option>
                          <option value="Kontrak">Kontrak</option>
                        </select>
                      ) : (
                        capitalizeStatus(resident.status)
                      )}
                    </td>
                    {/* Kolom Telepon */}
                    <td>
                      {editingId === resident.id ? (
                        <input
                          type="text"
                          value={editData.phone_number}
                          onChange={(e) => handleChange(e, 'phone_number')}
                          className="form-control"
                          required
                        />
                      ) : (
                        resident.phone_number
                      )}
                    </td>
                    {/* Kolom Status Pernikahan */}
                    <td>
                      {editingId === resident.id ? (
                        <select
                          value={editData.marital_status}
                          onChange={(e) => handleChange(e, 'marital_status')}
                          className="form-select"
                          required
                        >
                          <option value="Menikah">Menikah</option>
                          <option value="Belum">Belum</option>
                        </select>
                      ) : (
                        capitalizeStatus(resident.marital_status)
                      )}
                    </td>
                    {/* Kolom Aksi */}
                    <td>
                      {editingId === resident.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(resident.id)}
                            className="btn btn-success btn-sm me-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="btn btn-secondary btn-sm"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEdit(resident)}
                          className="btn btn-warning btn-sm"
                        >
                          Edit
                        </button>
                      )}
                    </td>
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