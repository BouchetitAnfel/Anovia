<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'client_id',
        'name_client',
        'room_id',
        'date_reservation',
        'date_checkin',
        'date_checkout',
        'receptionist_id',
        'reservation_status',
        'total_price',
        'room_state'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function receptionist()
    {
        return $this->belongsTo(Employee::class, 'receptionist_id');
    }
}
