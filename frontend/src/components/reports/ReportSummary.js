import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ReportSummary() {
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/reports/summary?year=${currentYear}`)
      .then((response) => {
        setSummary(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching report summary:", error);
        setLoading(false);
      });
  }, [currentYear]);

  if (loading) {
    return (
      <div className="card mb-4">
        <div className="card-header">
          <h3>Summary Laporan Bulanan Tahun {currentYear}</h3>
        </div>
        <div className="card-body">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const monthLabels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const incomeData = [];
  const expenseData = [];
  const saldoData = [];
  for (let i = 1; i <= 12; i++) {
    const data = summary[i] || { income: 0, expense: 0, saldo: 0 };
    incomeData.push(data.income);
    expenseData.push(data.expense);
    saldoData.push(data.saldo);
  }

  const chartData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Pemasukan",
        data: incomeData,
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
      {
        label: "Pengeluaran",
        data: expenseData,
        backgroundColor: "rgba(255, 159, 64, 0.7)",
      },
      {
        label: "Saldo",
        data: saldoData,
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Summary Laporan Bulanan Tahun ${currentYear}`,
      },
    },
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3>Summary Laporan Bulanan Tahun {currentYear}</h3>
      </div>
      <div className="card-body">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

export default ReportSummary;