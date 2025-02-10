<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HouseResidentHistory;

class HouseResidentHistoryController extends Controller
{
    // Menampilkan semua history
    public function index()
    {
        $histories = HouseResidentHistory::with('house', 'resident')->get();
        return response()->json($histories);
    }

    // Menambahkan data history baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'house_id'    => 'required|exists:houses,id',
            'resident_id' => 'required|exists:residents,id',
            'start_date'  => 'required|date',
            'end_date'    => 'nullable|date|after_or_equal:start_date',
        ]);

        $history = HouseResidentHistory::create($validated);
        return response()->json($history, 201);
    }

    // Menampilkan detail history tertentu
    public function show($id)
    {
        $history = HouseResidentHistory::with('house', 'resident')->findOrFail($id);
        return response()->json($history);
    }

    // Memperbarui data history
    public function update(Request $request, $id)
    {
        $history = HouseResidentHistory::findOrFail($id);

        $validated = $request->validate([
            'house_id'    => 'sometimes|required|exists:houses,id',
            'resident_id' => 'sometimes|required|exists:residents,id',
            'start_date'  => 'sometimes|required|date',
            'end_date'    => 'nullable|date|after_or_equal:start_date',
        ]);

        $history->update($validated);
        return response()->json($history);
    }

    // Menghapus data history
    public function destroy($id)
    {
        $history = HouseResidentHistory::findOrFail($id);
        $history->delete();
        return response()->json(['message' => 'House Resident History deleted successfully']);
    }
}