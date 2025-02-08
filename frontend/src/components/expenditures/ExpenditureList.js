import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ExpenditureList() {
  const [expenditures, setExpenditures] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/expenditures')
      .then(response => setExpenditures(response.data))
      .catch(error => console.error("Error fetching expenditures:", error));
  }, []);

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3>Daftar Pengeluaran</h3>
      </div>
      <div className="card-body">
        {expenditures.length === 0 ? (
          <p>Tidak ada data pengeluaran.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Deskripsi</th>
                  <th>Jumlah</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {expenditures.map(exp => (
                  <tr key={exp.id}>
                    <td>{exp.id}</td>
                    <td>{exp.description}</td>
                    <td>{exp.amount}</td>
                    <td>{exp.expense_date}</td>
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

export default ExpenditureList;