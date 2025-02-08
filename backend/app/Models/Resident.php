<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resident extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'ktp_photo',
        'status',
        'phone_number',
        'marital_status',
    ];

    // Relasi ke rumah yang sedang dihuni (jika ada)
    public function houses()
    {
        return $this->hasMany(House::class, 'current_resident_id');
    }
}