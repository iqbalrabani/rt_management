<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;

class PaymentController extends Controller
{
    // Menampilkan semua pembayaran
    public function index()
    {
        $payments = Payment::with('resident', 'house')->get();
        return response()->json($payments);
    }

    // Menambahkan data pembayaran baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'resident_id'   => 'required|exists:residents,id',
            'house_id'      => 'nullable|exists:houses,id',
            'fee_type'      => 'required|in:satpam,kebersihan',
            'amount'        => 'required|numeric',
            'payment_date'  => 'required|date',
            'period_start'  => 'required|date',
            'period_end'    => 'required|date|after_or_equal:period_start',
            'status'        => 'required|in:lunas,belum',
        ]);

        $payment = Payment::create($validated);
        return response()->json($payment, 201);
    }

    // Menampilkan detail pembayaran tertentu
    public function show($id)
    {
        $payment = Payment::with('resident', 'house')->findOrFail($id);
        return response()->json($payment);
    }

    // Memperbarui data pembayaran
    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);
        $validated = $request->validate([
            'resident_id'   => 'sometimes|required|exists:residents,id',
            'house_id'      => 'sometimes|nullable|exists:houses,id',
            'fee_type'      => 'sometimes|required|in:satpam,kebersihan',
            'amount'        => 'sometimes|required|numeric',
            'payment_date'  => 'sometimes|required|date',
            'period_start'  => 'sometimes|required|date',
            'period_end'    => 'sometimes|required|date|after_or_equal:period_start',
            'status'        => 'sometimes|required|in:lunas,belum',
        ]);
        $payment->update($validated);
        return response()->json($payment);
    }

    // Menghapus data pembayaran
    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();
        return response()->json(['message' => 'Payment deleted successfully']);
    }
}