<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHousesTable extends Migration
{
    public function up()
    {
        Schema::create('houses', function (Blueprint $table) {
            $table->id();
            $table->string('house_number');
            $table->enum('status', ['dihuni', 'tidak_dihuni'])->default('tidak_dihuni');
            $table->unsignedBigInteger('current_resident_id')->nullable();
            $table->timestamps();

            $table->foreign('current_resident_id')
                  ->references('id')->on('residents')
                  ->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('houses');
    }
}