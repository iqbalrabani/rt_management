import React, { useState } from 'react';
import axios from 'axios';

function ReportDetail() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState('1');
  const [report, setReport] = useState(null);

  const handleFetchReport = () => {
    axios.get(`http://localhost:8000/api/reports/monthly/${year}/${month}`)
      .then(response => setReport(response.data))
      .catch(error => console.error("Error fetching report detail:", error));
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3>Detail Laporan</h3>
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <label className="col-sm-2 col-form-label">Tahun:</label>
          <div className="col-sm-4">
            <input 
              type="number" 
              className="form-control" 
              value={year} 
              onChange={(e) => setYear(e.target.value)} 
            />
          </div>
          <label className="col-sm-2 col-form-label">Bulan:</label>
          <div className="col-sm-4">
            <select 
              className="form-select" 
              value={month} 
              onChange={(e) => setMonth(e.target.value)}
            >
              {[...Array(12).keys()].map(m => (
                <option key={m+1} value={m+1}>{m+1}</option>
              ))}
            </select>
          </div>
        </div>
        <button className="btn btn-primary mb-3" onClick={handleFetchReport}>Tampilkan Laporan</button>
        {report && (
          <div>
            <h4>Pembayaran</h4>
            {report.payments.length === 0 ? (
              <p>Tidak ada data pembayaran.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Penghuni</th>
                      <th>Jumlah</th>
                      <th>Tanggal Bayar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.payments.map(pay => (
                      <tr key={pay.id}>
                        <td>{pay.id}</td>
                        <td>{pay.resident ? pay.resident.full_name : '-'}</td>
                        <td>{pay.amount}</td>
                        <td>{pay.payment_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <h4>Pengeluaran</h4>
            {report.expenditures.length === 0 ? (
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
                    {report.expenditures.map(exp => (
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
        )}
      </div>
    </div>
  );
}

export default ReportDetail;