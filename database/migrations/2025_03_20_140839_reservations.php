<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();

            // Client Foreign Key
            $table->unsignedBigInteger('client_id');
            $table->foreign('client_id')->references('id')->on('clients')->onDelete('cascade');

            $table->string('name_client');
            $table->integer('room_number');
            $table->enum('room_type', ['single', 'double', 'suite']);
            $table->date('date_reservation');
            $table->date('date_checkin');
            $table->date('date_checkout');

            // Receptionist Foreign Key
            $table->unsignedBigInteger('receptionist_id')->nullable();
            $table->foreign('receptionist_id')->references('id')->on('employees')->onDelete('set null');

            $table->enum('reservation_status', ['pending', 'confirmed', 'canceled']);
            $table->integer('total_price');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
