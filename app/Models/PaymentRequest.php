<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentRequest extends Model
{
    /** @use HasFactory<\Database\Factories\PaymentRequestFactory> */
    use HasFactory;

    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) \Illuminate\Support\Str::uuid();
            }
            if (empty($model->token)) {
                do {
                    $token = \Illuminate\Support\Str::random(64);
                } while (static::where('token', $token)->exists());
                $model->token = $token;
            }
        });
    }

    protected $fillable = [
        'uuid',
        'payment_account_id',
        'owner_id',
        'title',
        'description',
        'currency',
        'amount',
        'token',
        'status',
        'expires_at',
        'paid_at',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function paymentAccount(): BelongsTo
    {
        return $this->belongsTo(PaymentAccount::class);
    }
}
