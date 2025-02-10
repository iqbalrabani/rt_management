import React, { useState, useEffect } from 'react';
import axios from 'axios';

function formatRupiah(angka) {
  return "Rp" + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function AddPayment() {
  const [houseId, setHouseId] = useState('');
  const [feeType, setFeeType] = useState('satpam'); // opsi: "satpam", "kebersihan-bulanan", "kebersihan-tahunan"
  const [paymentDate, setPaymentDate] = useState('');
  const [houses, setHouses] = useState([]);
  const [message, setMessage] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/api/houses')
      .then(response => setHouses(response.data))
      .catch(error => console.error("Error fetching houses:", error));
  }, []);

  // Ambil rumah terpilih dan penghuni dari rumah tersebut
  const selectedHouse = houses.find(h => String(h.id) === houseId);
  const occupant = selectedHouse
    ? (selectedHouse.currentResident || selectedHouse.current_resident)
    : null;

  const getAmountForFeeType = (feeType) => {
    if (feeType === 'satpam') return 100000;
    if (feeType === 'kebersihan-bulanan') return 15000;
    if (feeType === 'kebersihan-tahunan') return 15000 * 12;
    return 0;
  };

  // Menghitung periode secara otomatis berdasarkan tanggal bayar dan jenis iuran
  const calculatePeriod = (paymentDate, feeType) => {
    if (!paymentDate) return { periodStart: '', periodEnd: '' };
    const date = new Date(paymentDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    if (feeType === 'kebersihan-tahunan') {
      return {
        periodStart: `${year}-01-01`,
        periodEnd: `${year}-12-31`
      };
    } else {
      // Untuk "satpam" dan "kebersihan-bulanan"
      const periodStart = `${year}-${month}-01`;
      const lastDay = new Date(year, date.getMonth() + 1, 0).getDate();
      const periodEnd = `${year}-${month}-${lastDay.toString().padStart(2, '0')}`;
      return { periodStart, periodEnd };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdding(true);
    // Jika tidak ada rumah terpilih atau tidak ada penghuni, tampilkan pesan error.
    if (!selectedHouse || !occupant) {
      setMessage("Silakan pilih rumah yang memiliki penghuni.");
      setAdding(false);
      return;
    }
    const { periodStart, periodEnd } = calculatePeriod(paymentDate, feeType);
    const payload = {
      resident_id: occupant.id,
      house_id: houseId,
      fee_type: (feeType === "kebersihan-bulanan" || feeType === "kebersihan-tahunan")
                  ? "kebersihan"
                  : feeType,
      amount: getAmountForFeeType(feeType),
      payment_date: paymentDate,
      period_start: periodStart,
      period_end: periodEnd,
      status: "belum"
    };

    try {
      await axios.post('http://localhost:8000/api/payments', payload);
      setMessage("Pembayaran berhasil ditambahkan!");
      // Reset form
      setHouseId('');
      setFeeType('satpam');
      setPaymentDate('');
    } catch (error) {
      console.error("Error adding payment:", error);
      setMessage("Terjadi kesalahan saat menambahkan pembayaran.");
    } finally {
      setAdding(false);
    }
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
            <label className="form-label">Rumah Tertagih:</label>
            <select 
              className="form-select"
              value={houseId}
              onChange={(e) => setHouseId(e.target.value)}
              required
            >
              {houses.length === 0 ? (
                <option>Loading...</option>
              ) : (
                <>
                  <option value="">-- Pilih Rumah --</option>
                  {houses.map(house => (
                    <option key={house.id} value={house.id}>
                      {house.house_number}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Penghuni:</label>
            <input 
              type="text" 
              className="form-control" 
              value={selectedHouse && occupant ? (occupant.full_name || occupant.name) : 'Tidak ada penghuni'}
              disabled
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Jenis Iuran:</label>
            <select 
              className="form-select"
              value={feeType} 
              onChange={(e) => setFeeType(e.target.value)}
            >
              <option value="satpam">Satpam</option>
              <option value="kebersihan-bulanan">Kebersihan (Bulanan)</option>
              <option value="kebersihan-tahunan">Kebersihan (Tahunan)</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Jumlah:</label>
            <input 
              type="text" 
              className="form-control" 
              value={formatRupiah(getAmountForFeeType(feeType))}
              disabled
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
          <button type="submit" className="btn btn-primary" disabled={adding}>
            {adding ? 'Loading...' : 'Tambah Pembayaran'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPayment;