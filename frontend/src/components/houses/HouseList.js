import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HouseList = () => {
  const [houses, setHouses] = useState([]);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [expandedHouseIds, setExpandedHouseIds] = useState([]);
  const [historyData, setHistoryData] = useState({});
  const [editingHouseId, setEditingHouseId] = useState(null);

  const [editForm, setEditForm] = useState({
    houseNumber: '',
    status: 'tidak_dihuni',
    currentResidentId: ''
  });

  // Helper: Dapatkan nama penghuni dengan fallback
  const getResidentName = (resident) => {
    if (!resident) return '-';
    return resident.full_name || resident.name || '-';
  };

  // Helper: Format status rumah (Dihuni/Tidak Dihuni)
  const formatStatus = (status) => {
    if (!status) return '';
    return status.toLowerCase() === 'dihuni' ? 'Dihuni' : 'Tidak Dihuni';
  };

  // Helper: Format status hunian dari Resident (misalnya, "Tetap" atau "Kontrak")
  const formatResidentStatus = (status) => {
    if (!status) return 'Tetap';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Fungsi untuk mengambil data rumah
  const fetchHouses = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/houses');
      setHouses(res.data);
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      setMessage(`Gagal mengambil data rumah: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengambil data penghuni
  const fetchResidents = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/residents');
      setResidents(res.data);
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      setMessage(`Gagal mengambil data penghuni: ${errMsg}`);
    }
  };

  // Fungsi untuk mengambil history untuk suatu rumah (dengan urutan terbaru di atas)
  const fetchHistoryForHouse = async (houseId) => {
    try {
      const res = await axios.get('http://localhost:8000/api/house-histories');
      let filtered = res.data.filter(
        (history) => history.house && history.house.id === houseId
      );
      // Urutkan: record current (end_date === null) di atas, lalu descending berdasarkan start_date
      filtered.sort((a, b) => {
        if (a.end_date === null && b.end_date !== null) return -1;
        if (a.end_date !== null && b.end_date === null) return 1;
        return new Date(b.start_date) - new Date(a.start_date);
      });
      setHistoryData((prev) => ({ ...prev, [houseId]: filtered }));
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      setMessage(`Gagal mengambil history untuk rumah ID ${houseId}: ${errMsg}`);
    }
  };

  useEffect(() => {
    fetchHouses();
    fetchResidents();
    const handleHouseAdded = () => fetchHouses();
    window.addEventListener('houseAdded', handleHouseAdded);
    return () => {
      window.removeEventListener('houseAdded', handleHouseAdded);
    };
  }, []);

  // Toggle tampilan history untuk suatu rumah
  const toggleHistory = async (houseId) => {
    if (expandedHouseIds.includes(houseId)) {
      setExpandedHouseIds(expandedHouseIds.filter((id) => id !== houseId));
    } else {
      setExpandedHouseIds([...expandedHouseIds, houseId]);
      if (!historyData[houseId]) {
        await fetchHistoryForHouse(houseId);
      }
    }
  };

  // --- Form Edit Rumah ---
  const handleEditClick = (house) => {
    const currentRes = house.currentResident || house.current_resident;
    setEditingHouseId(house.id);
    setEditForm({
      houseNumber: house.house_number,
      status: house.status,
      currentResidentId: currentRes ? String(currentRes.id) : ''
    });
  };

  const handleCancelEdit = () => {
    setEditingHouseId(null);
    setEditForm({
      houseNumber: '',
      status: 'tidak_dihuni',
      currentResidentId: ''
    });
  };

  const handleSaveEdit = async (houseId) => {
    setSaving(true);
    try {
      const payload = {
        house_number: editForm.houseNumber,
        status: editForm.status,
        current_resident_id: editForm.currentResidentId || null
      };
      await axios.put(`http://localhost:8000/api/houses/${houseId}`, payload);
      setMessage('Rumah berhasil diperbarui!');
      setEditingHouseId(null);
      setEditForm({
        houseNumber: '',
        status: 'tidak_dihuni',
        currentResidentId: ''
      });
      await fetchHouses();
      if (expandedHouseIds.includes(houseId)) {
        await fetchHistoryForHouse(houseId);
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      setMessage(`Gagal memperbarui rumah: ${errMsg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="card mb-4">
        <div className="card-header">
          <h3>Daftar Rumah</h3>
        </div>
        <div className="card-body">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3>Daftar Rumah</h3>
      </div>
      <div className="card-body">
        {message && <div className="alert alert-info">{message}</div>}
        {/* Form Tambah Rumah telah dihilangkan */}
        {houses.length === 0 ? (
          <p>Tidak ada data rumah.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nomor Rumah</th>
                  <th>Status Penghuni</th>
                  <th>Penghuni</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {houses.map((house, index) => (
                  <React.Fragment key={house.id}>
                    <tr>
                      {editingHouseId === house.id ? (
                        <>
                          <td>{index + 1}</td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              value={editForm.houseNumber}
                              onChange={(e) =>
                                handleEditFormChange('houseNumber', e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <select
                              className="form-select"
                              value={editForm.status}
                              onChange={(e) =>
                                handleEditFormChange('status', e.target.value)
                              }
                            >
                              <option value="dihuni">Dihuni</option>
                              <option value="tidak_dihuni">Tidak Dihuni</option>
                            </select>
                          </td>
                          <td>
                            {editForm.status.toLowerCase() === 'dihuni' ? (
                              <select
                                className="form-select"
                                value={editForm.currentResidentId}
                                onChange={(e) =>
                                  handleEditFormChange('currentResidentId', e.target.value)
                                }
                              >
                                <option value="">-- Pilih Penghuni --</option>
                                {residents.map((resident) => (
                                  <option key={resident.id} value={String(resident.id)}>
                                    {getResidentName(resident)}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() => handleSaveEdit(house.id)}
                              disabled={saving}
                            >
                              {saving ? 'Loading...' : 'Simpan'}
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={handleCancelEdit}
                              disabled={saving}
                            >
                              Batal
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{index + 1}</td>
                          <td>{house.house_number}</td>
                          <td>{formatStatus(house.status)}</td>
                          <td>
                            {house.status.toLowerCase() === 'tidak_dihuni'
                              ? '-'
                              : getResidentName(house.currentResident || house.current_resident)}
                          </td>
                          <td>
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() => handleEditClick(house)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-info btn-sm"
                              onClick={() => toggleHistory(house.id)}
                            >
                              {expandedHouseIds.includes(house.id)
                                ? 'Hide History'
                                : 'See History'}
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                    {expandedHouseIds.includes(house.id) && (
                      <tr>
                        <td colSpan="5">
                          <div className="card card-body">
                            <h5>History Pemilik Rumah</h5>
                            {historyData[house.id] ? (
                              <ul className="list-group">
                                {house.status.toLowerCase() === 'tidak_dihuni' && (
                                  <li className="list-group-item">
                                    <span className="badge bg-warning">House is Empty</span>
                                  </li>
                                )}
                                {historyData[house.id].length > 0 ? (
                                  (() => {
                                    let currentShown = false;
                                    return historyData[house.id].map((history) => {
                                      let isCurrent = false;
                                      if (
                                        house.status.toLowerCase() === 'dihuni' &&
                                        history.end_date === null
                                      ) {
                                        if (!currentShown) {
                                          isCurrent = true;
                                          currentShown = true;
                                        }
                                      }
                                      return (
                                        <li key={history.id} className="list-group-item">
                                          {getResidentName(history.resident)} &nbsp;
                                          {house.status.toLowerCase() === 'tidak_dihuni' ||
                                          !isCurrent ? (
                                            <span className="badge bg-danger">Past</span>
                                          ) : (
                                            <>
                                              <span className="badge bg-success me-1">Current</span>
                                              <span className="badge bg-info">
                                                {formatResidentStatus(history.resident?.status)}
                                              </span>
                                            </>
                                          )}
                                          <br />
                                          <small>
                                            (Start: {history.start_date}
                                            {history.end_date ? `, End: ${history.end_date}` : ''})
                                          </small>
                                        </li>
                                      );
                                    });
                                  })()
                                ) : (
                                  house.status.toLowerCase() !== 'tidak_dihuni' && (
                                    <p>Tidak ada history pemilik rumah.</p>
                                  )
                                )}
                              </ul>
                            ) : (
                              <p>Loading history...</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HouseList;