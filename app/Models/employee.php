<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class Employee extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'employees';
    protected $primaryKey = 'id';

    // Adjust fillable fields based on your actual column names
    protected $fillable = [
        'first_name',
        'last_name',
        'Email',
        'Adresse',
        'ccp',
        'Role',
        'hire_date',
        'password'
    ];

    protected $hidden = [
        'password',
    ];

    public function getEmailForPasswordReset()
    {
        return $this->Email; //galk laravel par default endo email wana msmytha Email so t7taj
    }

}
