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
            // Vérifie si la colonne existe avant de la supprimer
            if (Schema::hasColumn('reservations', 'spacial_request')) {
                $table->dropColumn('spacial_request');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            // Si jamais vous voulez restaurer la colonne
            if (!Schema::hasColumn('reservations', 'spacial_request')) {
                $table->text('spacial_request')->nullable();
            }
        });
    }
};