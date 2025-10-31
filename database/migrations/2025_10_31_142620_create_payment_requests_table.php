<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payment_requests', function (Blueprint $table) {
            $table->id();

            $table->uuid('uuid')->unique();

            $table->foreignId('payment_account_id')->constrained()->cascadeOnDelete();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();

            $table->string('title')->nullable(); // e.g. “Dinner Bill” or “Project Payment”
            $table->text('description')->nullable();

            $table->string('currency', 3)->default('USD');
            $table->decimal('amount', 10, 2);

            $table->string('token', 64)->unique(); // vanity/public link token like “abcd1234”
            $table->string('status')->default('pending'); // e.g. pending, paid, cancelled

            $table->timestamp('expires_at')->nullable();
            $table->timestamp('paid_at')->nullable();

            $table->json('metadata')->nullable(); // optional extra info (e.g. itemized bill later)

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_requests');
    }
};
