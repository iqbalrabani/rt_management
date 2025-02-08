import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PaymentList() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/payments')
      .then(response => setPayments(response.data))
      .catch(error => console.error("Error fetching payments:", error));
  }, []);

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3>Daftar Pembayaran</h3>
      </div>
      <div className="card-body">
        {payments.length === 0 ? (
          <p>Tidak ada data pembayaran.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Penghuni</th>
                  <th>Jenis Iuran</th>
                  <th>Jumlah</th>
                  <th>Tanggal Bayar</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.id}>
                    <td>{payment.id}</td>
                    <td>{payment.resident ? payment.resident.full_name : '-'}</td>
                    <td>{payment.fee_type}</td>
                    <td>{payment.amount}</td>
                    <td>{payment.payment_date}</td>
                    <td>{payment.status}</td>
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

export default PaymentList;