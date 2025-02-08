import React, { useState } from 'react';
import axios from 'axios';

function AddExpenditure() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { description, amount, expense_date: expenseDate };

    axios.post('http://localhost:8000/api/expenditures', payload)
      .then(response => {
        setMessage("Pengeluaran berhasil ditambahkan!");
        setDescription('');
        setAmount('');
        setExpenseDate('');
      })
      .catch(error => {
        console.error("Error adding expenditure:", error);
        setMessage("Terjadi kesalahan saat menambahkan pengeluaran.");
      });
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
            <label className="form-label">Deskripsi:</label>
            <input 
              type="text" 
              className="form-control"
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              required 
            />
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
            <label className="form-label">Tanggal Pengeluaran:</label>
            <input 
              type="date" 
              className="form-control"
              value={expenseDate} 
              onChange={(e) => setExpenseDate(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary">Tambah Pengeluaran</button>
        </form>
      </div>
    </div>
  );
}

export default AddExpenditure;