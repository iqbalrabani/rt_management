<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expenditure extends Model
{
    use HasFactory;

    protected $fillable = [
        'description',
        'amount',
        'expense_date',
    ];
}