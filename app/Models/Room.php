<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $table = 'rooms';
    protected $primaryKey = 'id';

    protected $fillable = [
        'room_number',
        'room_type',
        'hors_service',
        'price_per_night',
        'room_state'
    ];

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
