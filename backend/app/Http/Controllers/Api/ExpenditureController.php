<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Expenditure;

class ExpenditureController extends Controller
{
    // Menampilkan semua pengeluaran
    public function index()
    {
        $expenditures = Expenditure::all();
        return response()->json($expenditures);
    }

    // Menambahkan data pengeluaran baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'description'  => 'required|string',
            'amount'       => 'required|numeric',
            'expense_date' => 'required|date',
        ]);

        $expenditure = Expenditure::create($validated);
        return response()->json($expenditure, 201);
    }

    // Menampilkan detail pengeluaran tertentu
    public function show($id)
    {
        $expenditure = Expenditure::findOrFail($id);
        return response()->json($expenditure);
    }

    // Memperbarui data pengeluaran
    public function update(Request $request, $id)
    {
        $expenditure = Expenditure::findOrFail($id);
        $validated = $request->validate([
            'description'  => 'sometimes|required|string',
            'amount'       => 'sometimes|required|numeric',
            'expense_date' => 'sometimes|required|date',
        ]);
        $expenditure->update($validated);
        return response()->json($expenditure);
    }

    // Menghapus data pengeluaran
    public function destroy($id)
    {
        $expenditure = Expenditure::findOrFail($id);
        $expenditure->delete();
        return response()->json(['message' => 'Expenditure deleted successfully']);
    }
}