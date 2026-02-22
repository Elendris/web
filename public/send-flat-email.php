<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
  // Anti-spam honeypot check
  if (!empty($_POST['website'])) {
    // Falešný úspěch pro roboty
    http_response_code(200);
    echo 'Email byl úspěšně odeslán';
    exit;
  }

  $email = $_POST['email'];
  $phone = $_POST['phone'];
  $note = $_POST['message'];

  // Validace
  if (empty($email) || empty($phone) || empty($note)) {
    http_response_code(400);
    echo 'Vyplňte prosím všechna povinná pole.';
    exit;
  }

  $message = "Nový zájemce o pronájem bytu:\n\n";
  $message .= "Email: $email\n";
  $message .= "Telefon: $phone\n\n";
  $message .= "Termín a další požadavky:\n$note\n";

  $toEmail = 'info@elendris.cz';
  $subject = 'Elendris - Poptávka pronájmu bytu';
  $headers = 'From: ' . $email . "\r\n" .
             'Reply-To: ' . $email . "\r\n" .
             'X-Mailer: PHP/' . phpversion() . "\r\n" .
             'MIME-Version: 1.0' . "\r\n" .
             'Content-Type: text/plain; charset=UTF-8';

   if (mail($toEmail, $subject, $message, $headers)) {
    http_response_code(200);
    echo 'Email byl úspěšně odeslán';
  } else {
    http_response_code(500);
    echo 'Nepodařilo se odeslat email';
  }
} else {
  http_response_code(405);
  echo 'Neplatná metoda požadavku';
}
?>
