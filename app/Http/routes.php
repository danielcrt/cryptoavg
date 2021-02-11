<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('default');
});


Route::group(['prefix' => 'api'], function () {
    Route::post('compute', 'CalculatorController@compute');
    Route::get('coins', 'CoinController@index');
});
// Route::get('/coins', 'AdminController@retrieveCoins');
// Route::get('/prices', 'AdminController@retrievePrices');
