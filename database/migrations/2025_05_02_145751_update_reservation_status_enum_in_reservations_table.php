<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        //addinng checked_in and checked out status in reservation_status
        DB::statement("ALTER TABLE reservations MODIFY reservation_status ENUM('pending', 'confirmed', 'canceled', 'checked_in', 'checked_out') NOT NULL");
    }

    public function down()
    {
        DB::statement("ALTER TABLE reservations MODIFY reservation_status ENUM('pending', 'confirmed', 'canceled') NOT NULL");
    }
};
