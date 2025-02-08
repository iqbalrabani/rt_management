<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHouseResidentHistoriesTable extends Migration
{
    public function up()
    {
        Schema::create('house_resident_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('house_id');
            $table->unsignedBigInteger('resident_id');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->timestamps();

            $table->foreign('house_id')
                  ->references('id')->on('houses')
                  ->onDelete('cascade');

            $table->foreign('resident_id')
                  ->references('id')->on('residents')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('house_resident_histories');
    }
}