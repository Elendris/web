export const sendEmail = async (formData: FormData): Promise<boolean> => {
  const data: { [key: string]: FormDataEntryValue } = Object.fromEntries(formData.entries());

  // Collect rooms data
  const rooms: string[] = [];
  formData.forEach((value: FormDataEntryValue, key: string) => {
    if (key.startsWith('room')) {
      const roomNumber = key.replace('room', '');
      const guestCount = formData.get(`guestCount${roomNumber}`) as string;
      const separateBeds = formData.get(`separateBeds${roomNumber}`) ? ', Oddělené postele' : '';
      rooms.push(`${value as string}, Počet hostů: ${guestCount}${separateBeds}`);
    }
  });

  const message = `
    Detail rezervace:
    Datum od: ${data.from as string}
    Datum do: ${data.to as string}
    Jméno: ${data.fname as string} ${data.lname as string}
    Email: ${data.email as string}
    Telefon: ${data.phone as string}
    Poznámka: ${data.note as string}
    Pokoje: ${rooms.join('\n')}
    Snídaně: ${data.breakfast ? 'Ano' : 'Ne'}
  `;

  const emailData = {
    personalizations: [{ to: [{ email: "chylik.lukas@gmail.com" }] }],
    from: { email: data.email as string },
    subject: 'Nová rezervace z webu elendris.cz',
    content: [{ type: 'text/plain', value: message }]
  };

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer TODO',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailData)
  });

  return response.ok;
};