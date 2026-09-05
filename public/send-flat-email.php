<?php
// Set CORS headers for AI agents and API clients
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo 'Neplatná metoda požadavku';
    exit;
}

// -------------------------------------------------------------
// Helper: Rate Limiting (max 5 requests per 10 minutes per IP)
// -------------------------------------------------------------
function checkRateLimit($ip) {
    $tmpDir = sys_get_temp_dir();
    $file = $tmpDir . '/elendris_flat_rate_' . md5($ip) . '.txt';
    $now = time();
    $window = 600; // 10 minutes
    $maxHits = 5;
    $history = [];

    if (file_exists($file)) {
        $lines = @file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines) {
            foreach ($lines as $line) {
                $ts = (int)$line;
                if ($now - $ts < $window) {
                    $history[] = $ts;
                }
            }
        }
    }

    if (count($history) >= $maxHits) {
        return false;
    }

    $history[] = $now;
    @file_put_contents($file, implode("\n", $history), LOCK_EX);
    return true;
}

// -------------------------------------------------------------
// Helper: Anti-Spam & Advertising Content Filter
// -------------------------------------------------------------
function isSpamSubmission($data) {
    // 1. Honeypot check
    if (!empty($data['website'])) {
        return true;
    }

    // 2. Time-trap check (submitted under 3 seconds = automated bot)
    if (isset($data['form_ts']) && is_numeric($data['form_ts'])) {
        $timeTaken = time() - (int)$data['form_ts'];
        if ($timeTaken < 3) {
            return true;
        }
    }

    // 3. Collect text fields to inspect
    $textToCheck = ($data['email'] ?? '') . ' ' .
                   ($data['phone'] ?? '') . ' ' .
                   ($data['message'] ?? '') . ' ' .
                   ($data['name'] ?? '');

    // 4. Strict URL & Code check (apartment requests should NEVER contain links)
    $urlPattern = '/\b(https?:\/\/|www\.|ftp:\/\/|[a-z0-9\-\.]+\.(?:com|ru|top|xyz|biz|info|cn|click|shop|online|link|site|vip|pro|icu|work|live|today|monster|download|club|pw|cc|cx)\b|\[url|\[link|<a\s|<script|<iframe|t\.me\/|wa\.me\/|@telegram)/i';
    if (preg_match($urlPattern, $textToCheck)) {
        return true;
    }

    // 5. Cyrillic / Russian spam script detection
    if (preg_match('/[\p{Cyrillic}]/u', $textToCheck)) {
        return true;
    }

    // 6. Known spam & promotional keywords
    $spamKeywords = [
        'casino', 'crypto', 'bitcoin', 'usdt', 'ethereum', 'forex', 'viagra', 'cialis',
        'backlink', 'seo service', 'search ranking', 'guest post', 'essay writer', 'loan offer',
        'porn', 'adult webcam', 'dating site', 'replica watch', 'replica bags', 'cheap flights discount',
        'promotional offer', 'earn money fast', 'telegram channel', 'whatsapp group', 'investment return',
        'marketing proposal', 'dmca notice', 'copyright violation', 'rank your website'
    ];
    $lowerText = mb_strtolower($textToCheck, 'UTF-8');
    foreach ($spamKeywords as $kw) {
        if (strpos($lowerText, $kw) !== false) {
            return true;
        }
    }

    return false;
}

// -------------------------------------------------------------
// Helper: Email domain validation
// -------------------------------------------------------------
function validateEmailDomain($email) {
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return false;
    }
    $domain = substr(strrchr($email, "@"), 1);
    if (!empty($domain) && function_exists('checkdnsrr')) {
        if (!@checkdnsrr($domain, 'MX') && !@checkdnsrr($domain, 'A')) {
            return false;
        }
    }
    return true;
}

// -------------------------------------------------------------
// Main Processing
// -------------------------------------------------------------
$clientIp = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

// Read JSON or POST input
$rawInput = file_get_contents('php://input');
$jsonData = json_decode($rawInput, true);
$data = is_array($jsonData) ? $jsonData : $_POST;

// Silent drop for rate limit exceeded or spam
if (!checkRateLimit($clientIp) || isSpamSubmission($data)) {
    // Fake success response to confuse bots
    http_response_code(200);
    echo (is_array($jsonData)) 
        ? json_encode(['status' => 'success', 'message' => 'Email byl úspěšně odeslán'])
        : 'Email byl úspěšně odeslán';
    exit;
}

$email = trim($data['email'] ?? '');
$phone = htmlspecialchars(trim($data['phone'] ?? ''), ENT_QUOTES, 'UTF-8');
$note = htmlspecialchars(trim($data['message'] ?? $data['note'] ?? ''), ENT_QUOTES, 'UTF-8');
$name = htmlspecialchars(trim($data['name'] ?? ''), ENT_QUOTES, 'UTF-8');

// Validation
if (empty($email) || empty($phone) || empty($note) || !validateEmailDomain($email)) {
    http_response_code(400);
    echo (is_array($jsonData))
        ? json_encode(['status' => 'error', 'message' => 'Vyplňte prosím všechna povinná pole s platnými údaji.'])
        : 'Vyplňte prosím všechna povinná pole.';
    exit;
}

$message = "Nový zájemce o pronájem bytu:\n\n";
if (!empty($name)) {
    $message .= "Jméno: $name\n";
}
$message .= "Email: $email\n";
$message .= "Telefon: $phone\n\n";
$message .= "Termín a další požadavky:\n$note\n";
$message .= "\nIP: $clientIp\n";

$toEmail = 'info@elendris.cz';
$subject = 'Elendris - Poptávka pronájmu bytu';
$headers = 'From: ' . $email . "\r\n" .
           'Reply-To: ' . $email . "\r\n" .
           'X-Mailer: PHP/' . phpversion() . "\r\n" .
           'MIME-Version: 1.0' . "\r\n" .
           'Content-Type: text/plain; charset=UTF-8';

if (@mail($toEmail, $subject, $message, $headers)) {
    http_response_code(200);
    echo (is_array($jsonData))
        ? json_encode(['status' => 'success', 'message' => 'Email byl úspěšně odeslán'])
        : 'Email byl úspěšně odeslán';
} else {
    http_response_code(200);
    echo (is_array($jsonData))
        ? json_encode(['status' => 'success', 'message' => 'Poptávka přijata'])
        : 'Email byl úspěšně odeslán';
}
?>
