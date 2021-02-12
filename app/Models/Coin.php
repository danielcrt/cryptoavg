<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * The Coin Model.
 *
 * @author      Daniel Isac <daniel@crosstechit.com>
 * @copyright   2021 CROSS TECHIT
 */
class Coin extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'coins';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'coingecko_id',
        'symbol',
        'name',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'updated_at'    => 'datetime',
        'created_at'    => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['full_name'];


    /**
     * Get the coin's full name.
     *
     * @return string
     */
    public function getFullNameAttribute(): string
    {
        return trim($this->name . ' (' . strtoupper($this->symbol) . ')');
    }

    /**
     * Get the prices associated with the coin.
     */
    public function prices()
    {
        return $this->hasMany(Price::class, 'coin_id');
    }
}
