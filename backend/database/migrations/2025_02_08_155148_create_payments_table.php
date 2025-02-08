<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentsTable extends Migration
{
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('resident_id');
            $table->unsignedBigInteger('house_id')->nullable();
            $table->enum('fee_type', ['satpam', 'kebersihan']);
            $table->decimal('amount', 10, 2);
            $table->date('payment_date');
            $table->date('period_start');
            $table->date('period_end');
            $table->enum('status', ['lunas', 'belum'])->default('belum');
            $table->timestamps();

            $table->foreign('resident_id')
                  ->references('id')->on('residents')
                  ->onDelete('cascade');

            $table->foreign('house_id')
                  ->references('id')->on('houses')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('payments');
    }
}