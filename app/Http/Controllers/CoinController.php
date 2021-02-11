<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use App\Models\Coin;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class CoinController extends Controller
{
    public function index(Request $request)
    {
        try {
            $q = $request->get('q');

            $q_coin = Coin::query();
            if ($q) {
                $q_coin = $q_coin->where(DB::raw("CONCAT(`name`, ' ', `symbol`)"), 'LIKE', "%" . $q . "%");
            }
            $coins = $q_coin->limit(10)->get();
            return response()->json($coins);
        } catch (\Exception $e) {
            Log::error($e);
        }
    }
}
