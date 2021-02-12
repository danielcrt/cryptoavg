<?php

namespace App\Http\Controllers;

use App\Jobs\CoingeckoMarketDataJob;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\Coin;

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
            return response()->json([], 500);
        }
    }

    public function retrievePrices(Request $request)
    {
        dispatch(new CoingeckoMarketDataJob());
    }
}
