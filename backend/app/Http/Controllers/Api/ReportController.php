<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    // Mengembalikan summary bulanan (pemasukan, pengeluaran, saldo) selama 1 tahun
    public function monthlySummary(Request $request)
    {
        $year = $request->input('year', date('Y'));

        $payments = DB::table('payments')
                      ->select(DB::raw('MONTH(payment_date) as month'), DB::raw('SUM(amount) as total_income'))
                      ->whereYear('payment_date', $year)
                      ->groupBy('month')
                      ->get();

        $expenditures = DB::table('expenditures')
                          ->select(DB::raw('MONTH(expense_date) as month'), DB::raw('SUM(amount) as total_expense'))
                          ->whereYear('expense_date', $year)
                          ->groupBy('month')
                          ->get();

        $summary = [];
        for ($i = 1; $i <= 12; $i++) {
            $income = $payments->firstWhere('month', $i);
            $expense = $expenditures->firstWhere('month', $i);
            $summary[$i] = [
                'income'  => $income ? $income->total_income : 0,
                'expense' => $expense ? $expense->total_expense : 0,
                'saldo'   => ($income ? $income->total_income : 0) - ($expense ? $expense->total_expense : 0),
            ];
        }
        return response()->json($summary);
    }

    // Mengembalikan detail laporan untuk bulan dan tahun tertentu
    public function monthlyDetail($year, $month)
    {
        $payments = DB::table('payments')
                      ->whereMonth('payment_date', $month)
                      ->whereYear('payment_date', $year)
                      ->get();

        $expenditures = DB::table('expenditures')
                          ->whereMonth('expense_date', $month)
                          ->whereYear('expense_date', $year)
                          ->get();

        return response()->json([
            'payments'     => $payments,
            'expenditures' => $expenditures,
        ]);
    }
}