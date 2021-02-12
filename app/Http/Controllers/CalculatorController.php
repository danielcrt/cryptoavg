<?php

namespace App\Http\Controllers;

use App\Models\Price;
use DateInterval;
use DatePeriod;
use DateTime;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CalculatorController extends Controller
{
    public function compute(Request $request)
    {
        try {
            $start_date = $request->get('start_date');
            $end_date = $request->get('end_date');
            $coin_id = $request->get('coin_id');
            $investment_interval = $request->get('investment_interval');
            $investment_amount = $request->get('investment_amount');
            $transaction_fee = $request->get('transaction_fee');

            $start_date_time = DateTime::createFromFormat('Y-m-d', $start_date);
            $end_date_time = DateTime::createFromFormat('Y-m-d', $end_date);

            $validator = Validator::make([
                'start_date' => $start_date,
                'end_date' => $end_date,
                'coin_id' => $coin_id,
                'investment_interval' => $investment_interval,
                'investment_amount' => $investment_amount,
                'transaction_fee' => $transaction_fee,
            ], [
                'start_date' => 'required|date_format:Y-m-d',
                'end_date' => 'required|date_format:Y-m-d',
                'coin_id' => 'required|string|exists:coins,coingecko_id',
                'investment_interval' => 'required|string|in:daily,weekly,biweekly,monthly',
                'investment_amount' => 'required|numeric|min:1',
                'transaction_fee' => 'required|numeric|min:0|max:100',
            ]);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 400);
            }
            $round_precision = 2;
            $interval = new DateInterval('P1D');
            switch ($investment_interval) {
                case 'daily':
                    $interval = new DateInterval('P1D');
                    break;
                case 'weekly':
                    $interval = new DateInterval('P7D');
                    break;
                case 'biweekly':
                    $interval = new DateInterval('P14D');
                    break;
                case 'monthly':
                    $interval = new DateInterval('P1M');
                    break;
                default:
                    break;
            }
            $period = new DatePeriod($start_date_time, $interval, $end_date_time);
            $query_dates = [];
            $result = [];
            foreach ($period as $current_date_time) {
                $current_date = $current_date_time->format('Y-m-d');
                array_push($query_dates, $current_date);
            }
            $prices = Price::where('coingecko_coin_id', $coin_id)->whereIn('date', $query_dates)->select('price', 'date')->orderBy('date', 'asc')->get()->keyBy('date');
            $start_price = 0;
            $index = 0;
            foreach ($period as $current_date_time) {
                $current_date_time->setTime(0, 0, 0);
                $prices_index = $current_date_time->format('Y-m-d H:i:s');
                if (!isset($prices[$prices_index])) {
                    continue;
                }
                $price = $prices[$prices_index]['price'];

                $percent_change = 0;
                $total_investment = $investment_amount; // this is the initial balance
                $balance = $investment_amount - ($transaction_fee / 100) * $investment_amount; // this is the initial balance
                $profit_percent = 0;
                $profit = 0;
                if ($index > 0) {
                    $percent_change = ($price - $prices[$result[$index - 1]['date']]['price']) / $prices[$result[$index - 1]['date']]['price'] * 100;
                    $total_investment = $result[$index - 1]['total_investment'] + $investment_amount;
                    $balance = $percent_change / 100 * $result[$index - 1]['balance'] + $result[$index - 1]['balance'] + $investment_amount - ($transaction_fee / 100) * $investment_amount;
                    $profit = $balance - $total_investment;
                    $profit_percent = $profit / $total_investment * 100;
                }
                if ($index === 0) {
                    $start_price = $price;
                }

                array_push($result, [
                    'date' => $prices_index,
                    'price' => round($price, $round_precision),
                    'change_percent' => round($percent_change, $round_precision),
                    'change_from_start_percent' => round(($price - $start_price) / $start_price * 100, $round_precision),
                    'total_investment' => round($total_investment, $round_precision),
                    'balance' => round($balance, $round_precision),
                    'profit' => round($profit, $round_precision),
                    'profit_percent' => round($profit_percent, $round_precision),
                ]);
                $index++;
            }

            return response()->json($result);
        } catch (\Exception $e) {
            Log::error($e);
        }
    }
}
