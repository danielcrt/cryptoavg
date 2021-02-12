<?php

namespace App\Jobs;

use App\Jobs\Job;
use App\Models\Coin;
use App\Models\Price;
use Illuminate\Support\Facades\Log;

class CoingeckoMarketDataJob extends Job
{

    private $coingecko_endpoint = 'https://api.coingecko.com/api/v3/';

    public function __construct()
    {
    }
    /**
     * Execute the job
     *
     * @return void
     */
    public function handle(): void
    {
        try {
            $query_coins = Coin::where('is_available', 1)->get();
            foreach ($query_coins as $coin) {
                $coin_id = $coin->coingecko_id;

                $client = new \GuzzleHttp\Client;
                $res = $client->get(
                    $this->coingecko_endpoint . '/coins/' . $coin_id . '/market_chart',
                    [
                        'query' => [
                            'vs_currency' => 'usd',
                            'days' => '3',
                            'interval' => 'daily'
                        ]
                    ]
                );
                if ($res->getStatusCode() !== 200) {
                    return;
                }
                $coingecko_market_chart = json_decode($res->getBody(), 1);
                $coingecko_prices = $coingecko_market_chart['prices'];
                $data = [];
                foreach ($coingecko_prices as $coingecko_price) {
                    array_push(
                        $data,
                        [
                            'coingecko_coin_id' => $coin_id,
                            'date' => date('Y-m-d', $coingecko_price[0] / 1000), // date comes in ms. We just need days
                            'price' => $coingecko_price[1],
                        ]
                    );
                }
                Price::upsert($data, ['date', 'coingecko_coin_id'], ['price']);
            }
        } catch (\Exception $e) {
            Log::error($e);
        }
    }
}
