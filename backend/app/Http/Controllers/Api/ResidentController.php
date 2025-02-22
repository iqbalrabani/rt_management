<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Resident;

class ResidentController extends Controller
{
    // Menampilkan daftar penghuni
    public function index()
    {
        return response()->json(Resident::all());
    }

    // Menambahkan penghuni baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string',
            'ktp_photo' => 'required|file|mimes:jpeg,png,jpg|max:2048',
            'status' => 'required|in:tetap,kontrak',
            'phone_number' => 'required|string',
            'marital_status' => 'required|in:belum,menikah',
        ]);

        // Proses upload foto KTP
        if ($request->hasFile('ktp_photo')) {
            $file = $request->file('ktp_photo');
            $path = $file->store('ktp_photos', 'public');
            $validated['ktp_photo'] = $path;
        }

        $resident = Resident::create($validated);
        return response()->json($resident, 201);
    }

    // Mengubah data penghuni
    public function update(Request $request, $id)
    {
        $resident = Resident::findOrFail($id);
        $validated = $request->validate([
            'full_name'      => 'sometimes|required|string',
            'ktp_photo'      => 'sometimes|image',
            'status'         => 'sometimes|required|in:Tetap,Kontrak',
            'phone_number'   => 'sometimes|required|string',
            'marital_status' => 'sometimes|required|in:Menikah,Belum',
        ]);

        if ($request->hasFile('ktp_photo')) {
            $file = $request->file('ktp_photo');
            $path = $file->store('ktp_photos', 'public');
            $validated['ktp_photo'] = $path;
        }

        $resident->update($validated);
        return response()->json($resident);
    }
    // Tambahkan method show() dan destroy() bila diperlukan.
}