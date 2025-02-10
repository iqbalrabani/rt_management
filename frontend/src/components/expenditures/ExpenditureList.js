import React, { useEffect, useState } from 'react';
import axios from 'axios';

function formatRupiah(angka) {
  return "Rp" + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatPeriod(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
}

const ExpenditureList = () => {
  const [expenditures, setExpenditures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPeriods, setExpandedPeriods] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/expenditures')
      .then(response => {
        setExpenditures(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching expenditures:", error);
        setLoading(false);
      });
  }, []);

  const groupExpendituresByPeriod = (expenditures) => {
    const groups = {};
    expenditures.forEach(exp => {
      const period = formatPeriod(exp.expense_date);
      if (!groups[period]) {
        groups[period] = { period, dateValue: new Date(exp.expense_date), items: [] };
      }
      groups[period].items.push(exp);
    });
    const groupArray = Object.values(groups);
    groupArray.sort((a, b) => b.dateValue - a.dateValue);
    return groupArray;
  };

  const groupedExpenditures = groupExpendituresByPeriod(expenditures);

  const togglePeriod = (period) => {
    if (expandedPeriods.includes(period)) {
      setExpandedPeriods(expandedPeriods.filter(p => p !== period));
    } else {
      setExpandedPeriods([...expandedPeriods, period]);
    }
  };

  if (loading) {
    return (
      <div className="card mb-4">
        <div className="card-header">
          <h3>Daftar Pengeluaran</h3>
        </div>
        <div className="card-body">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3>Daftar Pengeluaran</h3>
      </div>
      <div className="card-body">
        {groupedExpenditures.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Periode Pengeluaran</th>
                  <th>Total Pengeluaran</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {groupedExpenditures.map(group => {
                  const total = group.items.reduce((sum, exp) => sum + Number(exp.amount), 0);
                  return (
                    <React.Fragment key={group.period}>
                      <tr>
                        <td>{group.period}</td>
                        <td>{formatRupiah(total)}</td>
                        <td>
                          <button 
                            className="btn btn-info btn-sm" 
                            onClick={() => togglePeriod(group.period)}
                          >
                            {expandedPeriods.includes(group.period) ? 'Hide History' : 'See History'}
                          </button>
                        </td>
                      </tr>
                      {expandedPeriods.includes(group.period) && (
                        <tr>
                          <td colSpan="3">
                            <div className="table-responsive">
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th>No</th>
                                    <th>Jenis Iuran</th>
                                    <th>Jumlah</th>
                                    <th>Tanggal Pengeluaran</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {group.items.map((exp, idx) => (
                                    <tr key={exp.id}>
                                      <td>{idx + 1}</td>
                                      <td>{exp.description}</td>
                                      <td>{formatRupiah(exp.amount)}</td>
                                      <td>{exp.expense_date}</td>
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

export default ExpenditureList;