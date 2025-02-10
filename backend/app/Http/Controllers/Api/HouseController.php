<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\House;
use App\Models\Resident;
use App\Models\HouseResidentHistory;

class HouseController extends Controller
{
    // Menampilkan daftar rumah beserta penghuni dan history-nya
    public function index()
    {
        $houses = House::with('currentResident', 'histories')->get();
        return response()->json($houses);
    }

    // Menambahkan rumah baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'house_number'        => 'required|string|unique:houses,house_number',
            'status'              => 'required|in:dihuni,tidak_dihuni',
            'current_resident_id' => 'nullable|exists:residents,id',
        ]);

        $house = House::create($validated);

        // Jika rumah dihuni dan ada penghuni, buat history
        if ($house->status === 'dihuni' && isset($validated['current_resident_id'])) {
            HouseResidentHistory::create([
                'house_id'    => $house->id,
                'resident_id' => $validated['current_resident_id'],
                'start_date'  => now()->toDateString(),
            ]);
        }

        return response()->json($house, 201);
    }

    // Menampilkan detail rumah
    public function show($id)
    {
        $house = House::with('currentResident', 'histories')->findOrFail($id);
        return response()->json($house);
    }

    // Memperbarui data rumah
    public function update(Request $request, $id)
    {
        $house = House::findOrFail($id);

        $validated = $request->validate([
            'house_number'        => 'sometimes|required|string|unique:houses,house_number,'.$id,
            'status'              => 'sometimes|required|in:dihuni,tidak_dihuni',
            'current_resident_id' => 'nullable|exists:residents,id',
        ]);

        // Jika penghuni berubah, update history
        if (isset($validated['current_resident_id']) && $validated['current_resident_id'] != $house->current_resident_id) {
            // Tandai akhir masa penghuni sebelumnya, jika ada
            if ($house->current_resident_id) {
                $history = HouseResidentHistory::where('house_id', $house->id)
                                               ->where('resident_id', $house->current_resident_id)
                                               ->whereNull('end_date')
                                               ->first();
                if ($history) {
                    $history->update(['end_date' => now()->toDateString()]);
                }
            }
            // Buat history baru jika rumah masih dihuni
            if ($house->status === 'dihuni' && isset($validated['current_resident_id'])) {
                HouseResidentHistory::create([
                    'house_id'    => $house->id,
                    'resident_id' => $validated['current_resident_id'],
                    'start_date'  => now()->toDateString(),
                ]);
            }
        }

        $house->update($validated);
        return response()->json($house);
    }

    // Menghapus data rumah
    public function destroy($id)
    {
        $house = House::findOrFail($id);
        $house->delete();
        return response()->json(['message' => 'House deleted successfully']);
    }
}