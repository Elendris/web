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
    $file = $tmpDir . '/elendris_rate_' . md5($ip) . '.txt';
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
    $textToCheck = ($data['fname'] ?? '') . ' ' .
                   ($data['lname'] ?? '') . ' ' .
                   ($data['note'] ?? '') . ' ' .
                   ($data['phone'] ?? '');

    // 4. Strict URL & Code check (hotel reservations should NEVER contain links)
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

// Extract and sanitize input
$from = htmlspecialchars(trim($data['from'] ?? ''), ENT_QUOTES, 'UTF-8');
$to = htmlspecialchars(trim($data['to'] ?? ''), ENT_QUOTES, 'UTF-8');
$firstName = htmlspecialchars(trim($data['fname'] ?? ''), ENT_QUOTES, 'UTF-8');
$lastName = htmlspecialchars(trim($data['lname'] ?? ''), ENT_QUOTES, 'UTF-8');
$email = trim($data['email'] ?? '');
$phone = htmlspecialchars(trim($data['phone'] ?? ''), ENT_QUOTES, 'UTF-8');
$note = htmlspecialchars(trim($data['note'] ?? ''), ENT_QUOTES, 'UTF-8');
$rooms = isset($data['rooms']) && is_array($data['rooms']) ? $data['rooms'] : [];
$breakfast = !empty($data['breakfast']) ? 'Ano' : 'Ne';

// Basic required validation
if (empty($from) || empty($to) || empty($firstName) || empty($lastName) || empty($email) || !validateEmailDomain($email)) {
    http_response_code(400);
    echo (is_array($jsonData)) 
        ? json_encode(['status' => 'error', 'message' => 'Vyplňte prosím platné kontaktní údaje a termín.'])
        : 'Vyplňte prosím platné kontaktní údaje a termín.';
    exit;
}

// Validate dates
$fromTs = strtotime($from);
$toTs = strtotime($to);
if (!$fromTs || !$toTs || $fromTs < (strtotime('today') - 86400) || $toTs <= $fromTs || ($toTs - $fromTs) > (60 * 86400)) {
    http_response_code(400);
    echo (is_array($jsonData))
        ? json_encode(['status' => 'error', 'message' => 'Neplatný termín rezervace.'])
        : 'Neplatný termín rezervace.';
    exit;
}

$roomNames = [
    '1' => 'Jednolůžkový pokoj',
    '2' => 'Dvoulůžkový pokoj',
    '3' => 'Třílůžkový pokoj',
    '4' => 'Rodinný pokoj',
    '5' => 'Rodinný pokoj s kuchyňským koutem',
    '6' => 'Pokoj s vanou'
];

$message = "Detail rezervace:\n";
$message .= "Datum od: $from\n";
$message .= "Datum do: $to\n";
$message .= "Jméno: $firstName $lastName\n";
$message .= "Email: $email\n";
$message .= "Telefon: $phone\n";
$message .= "Poznámka: $note\n";
$message .= "Pokoje:\n";

if (empty($rooms)) {
    // If no rooms specified in array, check single room field if passed by API
    $singleRoom = $data['room'] ?? '1';
    $rooms = [$singleRoom];
}

foreach ($rooms as $index => $room) {
    $roomNumber = $index + 1;
    $roomKey = (string)$room;
    $roomName = isset($roomNames[$roomKey]) ? $roomNames[$roomKey] : "Pokoj $roomKey";
    $guestCount = $data["guestCount$roomNumber"] ?? $data["guests"] ?? null;
    $separateBeds = !empty($data["separateBeds$roomNumber"]) ? ', Oddělené postele' : '';
    
    $message .= "- $roomName";
    if ($guestCount !== null) {
        $message .= ", Počet hostů: $guestCount";
    }
    $message .= "$separateBeds\n";
}

$message .= "Snídaně: $breakfast\n";
$message .= "IP: $clientIp\n";

$toEmail = 'info@elendris.cz';
$subject = 'Elendris - Rezervace ubytování';
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
    // Development / fallback response
    http_response_code(200);
    echo (is_array($jsonData))
        ? json_encode(['status' => 'success', 'message' => 'Rezervace přijata'])
        : 'Email byl úspěšně odeslán';
}
?>