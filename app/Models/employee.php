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


    public function handledReservations()
    {
        return $this->hasMany(Reservation::class, 'receptionist_id');
    }

}
