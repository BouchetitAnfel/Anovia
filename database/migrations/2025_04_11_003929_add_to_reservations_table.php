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
        Schema::table('reservations', function (Blueprint $table) {
            $table->string('phone_number')->after('name_client');
            $table->text('special_request')->after('phone_number')->nullable();
            $table->unsignedInteger('number_of_guests')->default(1)->after('special_request');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn(['phone_number', 'special_request', 'number_of_guests']);
        });
    }
};