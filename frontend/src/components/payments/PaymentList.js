import React, { useEffect, useState } from 'react';
import axios from 'axios';

function formatRupiah(angka) {
  return "Rp" + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedHouseIds, setExpandedHouseIds] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/payments')
      .then(response => {
        setPayments(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching payments:", error);
        setLoading(false);
      });
  }, []);

  // Group payments berdasarkan house.id
  const groupedPayments = payments.reduce((groups, payment) => {
    const houseId = payment.house?.id;
    if (houseId) {
      if (!groups[houseId]) {
        groups[houseId] = [];
      }
      groups[houseId].push(payment);
    }
    return groups;
  }, {});

  const housePaymentGroups = Object.values(groupedPayments);

  // Fungsi untuk toggle tampilan history
  const toggleHistory = (houseId) => {
    if (expandedHouseIds.includes(houseId)) {
      setExpandedHouseIds(expandedHouseIds.filter(id => id !== houseId));
    } else {
      setExpandedHouseIds([...expandedHouseIds, houseId]);
    }
  };

  if (loading) {
    return (
      <div className="card mb-4">
        <div className="card-header"><h3>Daftar Pembayaran</h3></div>
        <div className="card-body"><p>Loading...</p></div>
      </div>
    );
  }

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3>Daftar Pembayaran</h3>
      </div>
      <div className="card-body">
        {housePaymentGroups.length === 0 ? (
          <p>Tidak ada data pembayaran.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Nomor Rumah</th>
                  <th>Status Pembayaran</th>
                  <th>Total Pembayaran</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {housePaymentGroups.map(group => {
                  // Ambil informasi rumah dari pembayaran pertama
                  const house = group[0].house;
                  // Hitung total pembayaran
                  const total = group.reduce((sum, payment) => sum + Number(payment.amount), 0);
                  // Tentukan status berdasarkan total pembayaran (Rp1.380.000)
                  const paymentStatus = total >= 1380000 ? "Lunas" : "Belum Lunas";
                  const badgeColor = paymentStatus.toLowerCase() === 'lunas' ? 'bg-success' : 'bg-warning';
                  const houseId = house.id;
                  // Urutkan group untuk history berdasarkan tanggal bayar secara descending
                  const sortedGroup = group.slice().sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date));
                  return (
                    <React.Fragment key={houseId}>
                      <tr>
                        <td>{house.house_number}</td>
                        <td>
                          <span className={`badge ${badgeColor}`}>
                            {capitalizeFirst(paymentStatus)}
                          </span>
                        </td>
                        <td>{formatRupiah(total)}</td>
                        <td>
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => toggleHistory(houseId)}
                          >
                            {expandedHouseIds.includes(houseId) ? 'Hide Payment History' : 'See Payment History'}
                          </button>
                        </td>
                      </tr>
                      {expandedHouseIds.includes(houseId) && (
                        <tr>
                          <td colSpan="4">
                            <div className="table-responsive">
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th>No</th>
                                    <th>Penghuni</th>
                                    <th>Jenis Iuran</th>
                                    <th>Jumlah</th>
                                    <th>Tanggal Bayar</th>
                                    <th>Periode Mulai</th>
                                    <th>Periode Selesai</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {sortedGroup.map((payment, idx) => (
                                    <tr key={payment.id}>
                                      <td>{idx + 1}</td>
                                      <td>{payment.resident ? (payment.resident.full_name || payment.resident.name) : '-'}</td>
                                      <td>{capitalizeFirst(payment.fee_type)}</td>
                                      <td>{formatRupiah(payment.amount)}</td>
                                      <td>{payment.payment_date}</td>
                                      <td>{payment.period_start}</td>
                                      <td>{payment.period_end}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentList;