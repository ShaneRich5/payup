<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentAccount extends Model
{
    /** @use HasFactory<\Database\Factories\PaymentAccountFactory> */
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'handle',
        'type',
        'name',
        'description',
        'status',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    /**
     * @return BelongsTo<User>
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
