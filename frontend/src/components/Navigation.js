import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">Perumahan App</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Dashboard</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/residents">Penghuni</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/houses">Rumah</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/payments">Pembayaran</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/expenditures">Pengeluaran</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/reports">Laporan</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;