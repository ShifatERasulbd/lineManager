<?php

namespace App\Models;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Line extends Model
{
    
    use HasFactory;

    protected $fillable =[
        'line_number',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
