<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class House extends Model
{
    use HasFactory;

    protected $fillable = [
        'house_number',
        'status',
        'current_resident_id',
    ];

    // Hubungan dengan penghuni saat ini
    public function currentResident()
    {
        return $this->belongsTo(Resident::class, 'current_resident_id');
    }

    // Riwayat penghuni rumah
    public function histories()
    {
        return $this->hasMany(HouseResidentHistory::class);
    }
}