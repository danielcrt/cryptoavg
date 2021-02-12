<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{

    public function store(Request $request)
    {
        try {
            $email = $request->get('email');
            $message = $request->get('message');
            $recaptcha = $request->get('recaptcha');

            $validator = Validator::make([
                'email' => $email,
                'message' => $message,
                'recaptcha' => $recaptcha
            ], [
                'email' => 'required|email',
                'message' => 'required|string|min:10|max:1000',
                'recaptcha' => 'required|string',
            ]);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 400);
            }
            $secret_key = env('RECAPTCHA_SECRET_KEY', '');
            $url = 'https://www.google.com/recaptcha/api/siteverify?secret=' . $secret_key . '&response=' . $recaptcha;
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, $url);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_HEADER, false);
            $data = curl_exec($curl);
            curl_close($curl);
            $responseCaptchaData = json_decode($data);

            if (!$responseCaptchaData->success) {
                return response()->json([
                    'error' => 'Invalid recaptcha'
                ], 400);
            }

            Mail::send(
                'email.contact',
                [
                    'email' => $email,
                    'message_text' => $message
                ],
                function ($message) {
                    $message->from(env('MAIL_FROM_ADDRESS'));
                    $message->to(env('MAIL_TO_ADDRESS'))
                        ->subject('[' . env('APP_NAME') . '] You have a new message');
                }
            );

            return response()->json([]);
        } catch (\Exception $e) {
            Log::error($e);
            return response()->json([], 500);
        }
    }
}
