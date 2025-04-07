<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Stock extends Model
{
    use HasFactory;
    protected $table = 'stock';

    protected $fillable =[
        'qte',
        'id_product',
        'product_type',
        'qualite',
        'id_manager',
        'date_enter',
        'location'

    ];
}
