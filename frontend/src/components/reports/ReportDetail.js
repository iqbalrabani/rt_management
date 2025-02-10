import React, { useState } from 'react';
import axios from 'axios';

function formatRupiah(angka) {
  return "Rp" + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getKeterangan(saldo) {
  if (saldo > 0) return { text: 'Surplus', color: 'bg-success' };
  if (saldo === 0) return { text: 'Balance', color: 'bg-warning' };
  return { text: 'Defisit', color: 'bg-danger' };
}

function ReportDetail() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState('1');

  // State untuk Pemasukan
  const [payments, setPayments] = useState([]);
  const [loadingIncome, setLoadingIncome] = useState(false);

  // State untuk Pengeluaran
  const [expenditures, setExpenditures] = useState([]);
  const [loadingExpense, setLoadingExpense] = useState(false);

  // State untuk menentukan apakah laporan sudah ditampilkan
  const [showReport, setShowReport] = useState(false);

  // Fungsi untuk mengambil data Pemasukan
  const fetchIncome = () => {
    setLoadingIncome(true);
    axios
      .get('http://localhost:8000/api/payments')
      .then((response) => {
        // Filter data berdasarkan tahun dan bulan (dari payment_date)
        const filtered = response.data.filter(payment => {
          const date = new Date(payment.payment_date);
          return (
            date.getFullYear() === parseInt(year) &&
            (date.getMonth() + 1) === parseInt(month)
          );
        });
        setPayments(filtered);
        setLoadingIncome(false);
      })
      .catch((error) => {
        console.error("Error fetching payments:", error);
        setLoadingIncome(false);
      });
  };

  // Fungsi untuk mengambil data Pengeluaran
  const fetchExpense = () => {
    setLoadingExpense(true);
    axios
      .get(`http://localhost:8000/api/reports/monthly/${year}/${month}`)
      .then((response) => {
        const expenses = response.data.expenditures || [];
        setExpenditures(expenses);
        setLoadingExpense(false);
      })
      .catch((error) => {
        console.error("Error fetching expenditures:", error);
        setLoadingExpense(false);
      });
  };

  // Handler untuk mengambil laporan ketika tombol "Tampilkan Laporan" diklik
  const handleFetchReport = () => {
    setShowReport(true);
    fetchIncome();
    fetchExpense();
  };

  // Hitung total pemasukan dan pengeluaran
  const totalIncome = payments.reduce((sum, pay) => sum + Number(pay.amount), 0);
  const totalExpense = expenditures.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const balance = totalIncome - totalExpense;
  const keterangan = getKeterangan(balance);

  return (
    <div className="container my-4">
      <div className="card">
        <div className="card-header">
          <h3>Detail Laporan</h3>
        </div>
        <div className="card-body">
          {/* Baris untuk Input Tahun, Bulan, dan Tombol Tampilkan Laporan */}
          <div className="row mb-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label">Tahun:</label>
              <input
                type="number"
                className="form-control"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Bulan:</label>
              <select
                className="form-select"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                {[...Array(12).keys()].map((m) => (
                  <option key={m + 1} value={m + 1}>
                    {m + 1}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary w-100" onClick={handleFetchReport}>
                Tampilkan Laporan
              </button>
            </div>
          </div>

          {showReport && (
            <>
              {/* Panel Pemasukan */}
              <div className="row mb-3 align-items-center">
                <div className="col-md-3">
                  <h4>Pemasukan</h4>
                </div>
                <div className="col-md-9">
                  {loadingIncome ? (
                    <p>Loading pemasukan...</p>
                  ) : payments.length === 0 ? (
                    <p>Tidak ada data pemasukan.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped">
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Rumah</th>
                            <th>Penghuni</th>
                            <th>Tanggal Pembayaran</th>
                            <th>Jumlah</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((pay, idx) => (
                            <tr key={pay.id}>
                              <td>{idx + 1}</td>
                              <td>
                                {pay.house &&
                                pay.house.house_number &&
                                pay.house.house_number.trim() !== ''
                                  ? pay.house.house_number
                                  : '-'}
                              </td>
                              <td>
                                {pay.resident &&
                                ((pay.resident.full_name && pay.resident.full_name.trim() !== '') ||
                                 (pay.resident.name && pay.resident.name.trim() !== ''))
                                  ? (pay.resident.full_name || pay.resident.name)
                                  : '-'}
                              </td>
                              <td>{pay.payment_date}</td>
                              <td>{formatRupiah(pay.amount)}</td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan="4" className="text-end fw-bold">
                              Total Pemasukan
                            </td>
                            <td className="fw-bold">{formatRupiah(totalIncome)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Panel Pengeluaran */}
              <div className="row mb-3 align-items-center">
                <div className="col-md-3">
                  <h4>Pengeluaran</h4>
                </div>
                <div className="col-md-9">
                  {loadingExpense ? (
                    <p>Loading pengeluaran...</p>
                  ) : expenditures.length === 0 ? (
                    <p>Tidak ada data pengeluaran.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped">
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Deskripsi</th>
                            <th>Tanggal Pengeluaran</th>
                            <th>Jumlah</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expenditures.map((exp, idx) => (
                            <tr key={exp.id}>
                              <td>{idx + 1}</td>
                              <td>{exp.description}</td>
                              <td>{exp.expense_date}</td>
                              <td>{formatRupiah(exp.amount)}</td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan="3" className="text-end fw-bold">
                              Total Pengeluaran
                            </td>
                            <td className="fw-bold">{formatRupiah(totalExpense)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Panel Saldo */}
              <div className="row mb-3 align-items-center">
                <div className="col-md-3">
                  <h4>Saldo</h4>
                </div>
                <div className="col-md-9">
                  {(loadingIncome || loadingExpense) ? (
                    <p>Loading saldo...</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped">
                        <thead>
                          <tr>
                            <th>Saldo</th>
                            <th>Keterangan</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{formatRupiah(balance)}</td>
                            <td>
                              <span className={`badge ${keterangan.color}`}>
                                {keterangan.text}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportDetail;
