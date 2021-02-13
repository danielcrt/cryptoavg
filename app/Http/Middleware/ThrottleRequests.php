<?php

namespace App\Http\Middleware;

use Closure;
use Core\Exceptions\AppException;
use Core\Exceptions\AppExceptionType;
use Illuminate\Cache\RateLimiter;
use Illuminate\Http\Request;
use Illuminate\Support\InteractsWithTime;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

/**
 * Transforms Request.
 *
 * @author      Ben Carey <bdmc@sinemacula.co.uk>
 * @copyright   2021 Sine Macula Limited.
 */
class ThrottleRequests
{
    use InteractsWithTime;

    /**
     * The rate limiter instance.
     *
     * @var \Illuminate\Cache\RateLimiter
     */
    protected $limiter;

    /**
     * Create a new request throttler.
     *
     * @param \Illuminate\Cache\RateLimiter  $limiter
     */
    public function __construct(RateLimiter $limiter)
    {
        $this->limiter = $limiter;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  int|string  $max_attempts
     * @param  float|int  $decay_minutes
     * @param  string  $prefix
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, $max_attempts = 60, $decay_minutes = 1, $prefix = ''): Response
    {
        $key = $prefix . $this->resolveRequestSignature($request);

        $max_attempts = $this->resolveMaxAttempts($request, $max_attempts);

        if ($this->limiter->tooManyAttempts($key, $max_attempts)) {
            return $this->buildException($request, $key, $max_attempts);
        }

        $this->limiter->hit($key, $decay_minutes * 60);

        $response = $next($request);

        return $this->addHeaders(
            $response,
            $max_attempts,
            $this->calculateRemainingAttempts($key, $max_attempts)
        );
    }

    /**
     * Resolve the number of attempts if the user is authenticated or not.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int|string  $max_attempts
     * @return int
     */
    protected function resolveMaxAttempts(Request $request, int $max_attempts): int
    {
        if (Str::contains($max_attempts, '|')) {
            $max_attempts = explode('|', $max_attempts, 2)[$request->user() ? 1 : 0];
        }

        if (!is_numeric($max_attempts) && $request->user()) {
            $max_attempts = $request->user()->{$max_attempts};
        }

        return (int) $max_attempts;
    }

    /**
     * Resolve request signature.
     *
     * @param  \Illuminate\Http\Request  $request
     * @throws \RuntimeException
     * @return string
     */
    protected function resolveRequestSignature(Request $request): string
    {
        if (!$route = $request->route()) {
            throw new \RuntimeException('Unable to generate fingerprint. Route unavailable.');
        }

        $mix = $request->header('Authorization') ?? $request->ip();

        return sha1(
            $request->method() .
                '|' . $request->server('SERVER_NAME') .
                '|' . $request->path() .
                '|' . $request->ip() .
                $mix
        );
    }

    /**
     * Create a 'too many attempts' exception.
     *
     * @param  string  $key
     * @param  int  $max_attempts
     */
    protected function buildException(Request $request, string $key, int $max_attempts)
    {
        $retry_after = $this->getTimeUntilNextRetry($key);

        $headers = $this->getHeaders(
            $max_attempts,
            $this->calculateRemainingAttempts($key, $max_attempts, $retry_after),
            $retry_after
        );

        // Build the error response based on the exception object
        $data = [
            'error' => [
                'status' => 429,
            ],
        ];

        // Return the exception as JSON with its corresponding HTTP code
        if ($request->get('pretty')) {
            return response()->json($data, 429, $headers, JSON_PRETTY_PRINT);
        } else {
            return response()->json($data, 429, $headers);
        }

        // return new \Exception('Too many attempts', null, $headers);
        return new \Exception('Too many attempts');
    }

    /**
     * Get the number of seconds until the next retry.
     *
     * @param  string  $key
     * @return int
     */
    protected function getTimeUntilNextRetry(string $key): int
    {
        return $this->limiter->availableIn($key);
    }

    /**
     * Add the limit header information to the given response.
     *
     * @param  \Symfony\Component\HttpFoundation\Response  $response
     * @param  int  $max_attempts
     * @param  int  $remaining_attempts
     * @param  int|null  $retry_after
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected function addHeaders(Response $response, int $max_attempts, int $remaining_attempts, int $retry_after = null): Response
    {
        $response->headers->add(
            $this->getHeaders($max_attempts, $remaining_attempts, $retry_after)
        );

        return $response;
    }

    /**
     * Get the limit headers information.
     *
     * @param  int  $max_attempts
     * @param  int  $remaining_attempts
     * @param  int|null  $retry_after
     * @return array
     */
    protected function getHeaders(int $max_attempts, int $remaining_attempts, int $retry_after = null): array
    {
        $headers = [
            'X-RateLimit-Limit' => $max_attempts,
            'X-RateLimit-Remaining' => $remaining_attempts,
        ];

        if (!is_null($retry_after)) {
            $headers['Retry-After'] = $retry_after;
            $headers['X-RateLimit-Reset'] = $this->availableAt($retry_after);
        }

        return $headers;
    }

    /**
     * Calculate the number of remaining attempts.
     *
     * @param  string  $key
     * @param  int  $max_attempts
     * @param  int|null  $retry_after
     * @return int
     */
    protected function calculateRemainingAttempts(string $key, int $max_attempts, int $retry_after = null): int
    {
        if (is_null($retry_after)) {
            return $this->limiter->retriesLeft($key, $max_attempts);
        }

        return 0;
    }
}
