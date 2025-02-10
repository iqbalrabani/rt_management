import React, { useState, useEffect } from 'react';
import axios from 'axios';

function formatRupiah(angka) {
  return "Rp" + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function AddExpenditure() {
  const [jenisIuran, setJenisIuran] = useState('Perbaikan Jalan');
  const [customJenisIuran, setCustomJenisIuran] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [message, setMessage] = useState('');
  const [adding, setAdding] = useState(false);

  // Opsi dropdown untuk jenis iuran
  const feeOptions = [
    'Perbaikan Jalan',
    'Perbaikan Selokan',
    'Gaji Satpam',
    'Token Listrik Pos',
    'Custom'
  ];

  // Set nilai amount otomatis jika jenis iuran merupakan tipe fixed
  useEffect(() => {
    if (jenisIuran === 'Gaji Satpam') {
      setAmount(2500000);
    } else if (jenisIuran === 'Token Listrik Pos') {
      setAmount(200000);
    } else {
      setAmount(''); // reset untuk pilihan lainnya
    }
  }, [jenisIuran]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdding(true);
    // Jika opsi Custom dipilih, validasi input custom harus terisi
    let descriptionPayload = jenisIuran;
    if (jenisIuran === 'Custom') {
      if (!customJenisIuran.trim()) {
        setMessage("Silakan isi jenis iuran custom.");
        setAdding(false);
        return;
      }
      descriptionPayload = customJenisIuran;
    }
    // Jika jenis iuran selain yang fixed, pastikan amount terisi
    if (
      (jenisIuran === 'Perbaikan Jalan' ||
       jenisIuran === 'Perbaikan Selokan' ||
       jenisIuran === 'Custom') &&
      !amount
    ) {
      setMessage("Silakan isi jumlah pengeluaran.");
      setAdding(false);
      return;
    }
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      setMessage("Jumlah harus berupa angka.");
      setAdding(false);
      return;
    }
    const payload = {
      description: descriptionPayload,
      amount: numericAmount,
      expense_date: expenseDate
    };

    try {
      await axios.post('http://localhost:8000/api/expenditures', payload);
      setMessage("Pengeluaran berhasil ditambahkan!");
      // Reset form
      setJenisIuran('Perbaikan Jalan');
      setCustomJenisIuran('');
      setAmount('');
      setExpenseDate('');
    } catch (error) {
      console.error("Error adding expenditure:", error);
      setMessage("Terjadi kesalahan saat menambahkan pengeluaran.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3>Tambah Pengeluaran</h3>
      </div>
      <div className="card-body">
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Jenis Iuran:</label>
            <select 
              className="form-select"
              value={jenisIuran}
              onChange={(e) => setJenisIuran(e.target.value)}
              required
            >
              {feeOptions.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select>
          </div>
          {jenisIuran === 'Custom' && (
            <div className="mb-3">
              <label className="form-label">Isi Jenis Iuran Custom:</label>
              <input
                type="text"
                className="form-control"
                value={customJenisIuran}
                onChange={(e) => setCustomJenisIuran(e.target.value)}
                required
              />
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Jumlah:</label>
            {(jenisIuran === 'Gaji Satpam' || jenisIuran === 'Token Listrik Pos') ? (
              <select className="form-select" disabled>
                <option value={amount}>{formatRupiah(amount)}</option>
              </select>
            ) : (
              <input 
                type="number"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Tanggal Pengeluaran:</label>
            <input 
              type="date" 
              className="form-control"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={adding}>
            {adding ? 'Loading...' : 'Tambah Pengeluaran'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddExpenditure;