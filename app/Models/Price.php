<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

/**
 * The Price Model.
 *
 * @author      Daniel Isac <daniel@crosstechit.com>
 * @copyright   2021 CROSS TECHIT .
 */
class Price extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'prices';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'date',
        'price',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'date'    => 'date',
        'price'    => 'float',
        'updated_at'    => 'datetime',
        'created_at'    => 'datetime',
    ];

    /**
     * Get the coin associated with the price.
     */
    public function coin()
    {
        return $this->belongsTo(Coin::class, 'coin_id');
    }
}
