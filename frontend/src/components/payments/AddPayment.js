import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddPayment() {
  const [residentId, setResidentId] = useState('');
  const [houseId, setHouseId] = useState('');
  const [feeType, setFeeType] = useState('satpam');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [status, setStatus] = useState('belum');
  const [residents, setResidents] = useState([]);
  const [houses, setHouses] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/residents')
      .then(response => setResidents(response.data))
      .catch(error => console.error("Error fetching residents:", error));

    axios.get('http://localhost:8000/api/houses')
      .then(response => setHouses(response.data))
      .catch(error => console.error("Error fetching houses:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      resident_id: residentId,
      house_id: houseId || null,
      fee_type: feeType,
      amount,
      payment_date: paymentDate,
      period_start: periodStart,
      period_end: periodEnd,
      status
    };

    axios.post('http://localhost:8000/api/payments', payload)
      .then(response => {
        setMessage("Pembayaran berhasil ditambahkan!");
        setResidentId('');
        setHouseId('');
        setFeeType('satpam');
        setAmount('');
        setPaymentDate('');
        setPeriodStart('');
        setPeriodEnd('');
        setStatus('belum');
      })
      .catch(error => {
        console.error("Error adding payment:", error);
        setMessage("Terjadi kesalahan saat menambahkan pembayaran.");
      });
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3>Tambah Pembayaran</h3>
      </div>
      <div className="card-body">
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Pilih Penghuni:</label>
            <select 
              className="form-select"
              value={residentId} 
              onChange={(e) => setResidentId(e.target.value)}
              required
            >
              <option value="">-- Pilih Penghuni --</option>
              {residents.map(resident => (
                <option key={resident.id} value={resident.id}>
                  {resident.full_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Pilih Rumah (opsional):</label>
            <select 
              className="form-select"
              value={houseId} 
              onChange={(e) => setHouseId(e.target.value)}
            >
              <option value="">-- Pilih Rumah --</option>
              {houses.map(house => (
                <option key={house.id} value={house.id}>
                  {house.house_number}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Jenis Iuran:</label>
            <select 
              className="form-select"
              value={feeType} 
              onChange={(e) => setFeeType(e.target.value)}
            >
              <option value="satpam">Satpam</option>
              <option value="kebersihan">Kebersihan</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Jumlah:</label>
            <input 
              type="number" 
              className="form-control"
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Tanggal Bayar:</label>
            <input 
              type="date" 
              className="form-control"
              value={paymentDate} 
              onChange={(e) => setPaymentDate(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Periode Mulai:</label>
            <input 
              type="date" 
              className="form-control"
              value={periodStart} 
              onChange={(e) => setPeriodStart(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Periode Selesai:</label>
            <input 
              type="date" 
              className="form-control"
              value={periodEnd} 
              onChange={(e) => setPeriodEnd(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Status Pembayaran:</label>
            <select 
              className="form-select"
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="belum">Belum</option>
              <option value="lunas">Lunas</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Tambah Pembayaran</button>
        </form>
      </div>
    </div>
  );
}

export default AddPayment;