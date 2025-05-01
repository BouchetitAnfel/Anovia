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
        Schema::table('reservation', function (Blueprint $table) {
            $table->enum('status', ['Available', 'Do not disturb', 'Dirty', 'Clean', 'Reserved', 'Late checkout', 'Out of order', 'Stay over', 'Occupied'])
                ->default('Available');
        });
    }

    /**
     *
     */
    public function down(): void
    {
        Schema::table('reservation', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
