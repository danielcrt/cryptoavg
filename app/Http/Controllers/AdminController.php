<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\Coin;
use App\Models\Price;

class AdminController extends Controller
{
    private $coingecko_endpoint = 'https://api.coingecko.com/api/v3/';

    public function retrieveCoins(Request $request)
    {
        try {
            $client = new \GuzzleHttp\Client;
            $res = $client->get($this->coingecko_endpoint . '/coins/list', ['include_platform' => 'false']);
            if ($res->getStatusCode() !== 200) {
                return;
            }
            $coingecko_coins = json_decode($res->getBody(), 1);
            $data = [];
            foreach ($coingecko_coins as $coingecko_coin) {
                array_push(
                    $data,
                    [
                        'coingecko_id' => $coingecko_coin['id'],
                        'symbol' => $coingecko_coin['symbol'],
                        'name' => $coingecko_coin['name'],
                    ]
                );
            }
            // Coin::insert($data);
            Coin::upsert($data, 'coingecko_id');
            return response()->json($coingecko_coins);
        } catch (\Exception $e) {
            Log::error($e);
        }
    }

    public function retrievePrices(Request $request)
    {
        try {
            $coin_id = 'elrond-erd-2';

            $client = new \GuzzleHttp\Client;
            $res = $client->get(
                $this->coingecko_endpoint . '/coins/' . $coin_id . '/market_chart',
                [
                    'query' => [
                        'vs_currency' => 'usd',
                        'days' => 'max',
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
            // Coin::insert($data);
            Price::upsert($data, 'coingecko_coin_id');
            return response()->json();
        } catch (\Exception $e) {
            Log::error($e);
        }
    }
}
