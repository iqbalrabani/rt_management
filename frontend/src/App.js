import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';

// Import halaman untuk masing-masing entitas
import ResidentsList from './components/residents/ResidentsList';
import AddResident from './components/residents/AddResident';
import HouseList from './components/houses/HouseList';
import AddHouse from './components/houses/AddHouse';
import PaymentList from './components/payments/PaymentList';
import AddPayment from './components/payments/AddPayment';
import ExpenditureList from './components/expenditures/ExpenditureList';
import AddExpenditure from './components/expenditures/AddExpenditure';
import ReportSummary from './components/reports/ReportSummary';
import ReportDetail from './components/reports/ReportDetail';

function App() {
  return (
    <Router>
      <div className="container my-4">
        <Navigation />
        <Routes>
          {/* Halaman utama (Dashboard) diarahkan ke ResidentsList */}
          <Route path="/" element={<ResidentsList />} />

          {/* Routes untuk Penghuni */}
          <Route path="/residents" element={
            <div>
              <AddResident />
              <ResidentsList />
            </div>
          } />

          {/* Routes untuk Rumah */}
          <Route path="/houses" element={
            <div>
              <AddHouse />
              <HouseList />
            </div>
          } />

          {/* Routes untuk Pembayaran */}
          <Route path="/payments" element={
            <div>
              <AddPayment />
              <PaymentList />
            </div>
          } />

          {/* Routes untuk Pengeluaran */}
          <Route path="/expenditures" element={
            <div>
              <AddExpenditure />
              <ExpenditureList />
            </div>
          } />

          {/* Routes untuk Laporan */}
          <Route path="/reports" element={
            <div>
              <ReportSummary />
              <ReportDetail />
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;