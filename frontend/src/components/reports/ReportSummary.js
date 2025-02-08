import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ReportSummary() {
  const [summary, setSummary] = useState({});
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    axios.get(`http://localhost:8000/api/reports/summary?year=${currentYear}`)
      .then(response => setSummary(response.data))
      .catch(error => console.error("Error fetching report summary:", error));
  }, [currentYear]);

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3>Summary Laporan Bulanan Tahun {currentYear}</h3>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Bulan</th>
                <th>Pemasukan</th>
                <th>Pengeluaran</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(summary).map(month => (
                <tr key={month}>
                  <td>{month}</td>
                  <td>{summary[month].income}</td>
                  <td>{summary[month].expense}</td>
                  <td>{summary[month].saldo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReportSummary;