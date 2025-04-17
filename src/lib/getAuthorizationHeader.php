<?php

/**
 * Generate an authorization header using JWT-like structure
 * 
 * @param string $timestamp The timestamp to include in the payload
 * @return string The generated authorization header
 */
function getAuthorizationHeader($timestamp) {
    // Load configuration
    $configuration = [
        'id' => getenv('LAYLO_ID'),
        'accessKey' => getenv('LAYLO_ACCESS_KEY'),
        'secretKey' => getenv('LAYLO_SECRET_KEY'),
    ];

    // Create header
    $header = [
        'alg' => 'HS256',
        'typ' => 'JWT',
    ];
    $encodedHeader = base64_encode(json_encode($header));

    // Create payload
    $payload = [
        'timestamp' => $timestamp,
        'userId' => $configuration['id'],
        'accessKey' => $configuration['accessKey'],
    ];
    $encodedPayload = base64_encode(json_encode($payload));

    // Create signature
    $signature = base64_encode(
        hash_hmac(
            'sha256', 
            "{$encodedHeader}.{$encodedPayload}", 
            $configuration['secretKey'], 
            true
        )
    );

    // Combine all parts to form authorization string
    $authorization = "{$encodedHeader}.{$encodedPayload}.{$signature}";

    return $authorization;
}

?>
