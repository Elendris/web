<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $from = $_POST['from'];
  $to = $_POST['to'];
  $firstName = $_POST['fname'];
  $lastName = $_POST['lname'];
  $email = $_POST['email'];
  $phone = $_POST['phone'];
  $note = $_POST['note'];
  $rooms = isset($_POST['rooms']) ? $_POST['rooms'] : [];
  $breakfast = isset($_POST['breakfast']) ? 'Ano' : 'Ne';

  $roomNames = [
    '1' => 'Jednolůžkový pokoj',
    '2' => 'Dvoulůžkový pokoj',
    '3' => 'Třílůžkový pokoj',
    '4' => 'Čtyřlůžkový pokoj',
    '5' => 'Rodinný pokoj',
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

  foreach ($rooms as $index => $room) {
    $roomNumber = $index + 1;
    $roomName = isset($roomNames[$room]) ? $roomNames[$room] : "Room $room";
    $guestCount = isset($_POST["guestCount$roomNumber"]) ? $_POST["guestCount$roomNumber"] : null;
    $separateBeds = isset($_POST["separateBeds$roomNumber"]) ? ', Oddělené postele' : '';
    $message .= "$roomName";
    if ($guestCount !== null) {
      $message .= ", Počet hostů: $guestCount";
    }
    $message .= "$separateBeds\n";
  }

  $message .= "Snídaně: $breakfast\n";

  $toEmail = 'info@elendris.cz';
  $subject = 'Nová rezervace z webu elendris.cz';
  $headers = 'From: ' . $email . "\r\n" .
             'Reply-To: ' . $email . "\r\n" .
             'X-Mailer: PHP/' . phpversion() . "\r\n" .
             'MIME-Version: 1.0' . "\r\n" .
             'Content-Type: text/plain; charset=UTF-8';

  if (mail($toEmail, $subject, $message, $headers)) {
    http_response_code(200);
    echo 'Email sent successfully';
  } else {
    http_response_code(500);
    echo 'Failed to send email';
  }
} else {
  http_response_code(405);
  echo 'Invalid request method';
}
?>