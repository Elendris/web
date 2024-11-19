import { Resend } from 'resend';
import type { APIRoute } from 'astro';

const resend = new Resend("re_2YyVouwz_9LKPhKTAZS9tWbG5e8AeUsxt");

export const sendEmail = async (emailData: {
  from: string;
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> => {
  try {
    await resend.emails.send(emailData);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const post: APIRoute = async ({ request }) => {
  const formData = await request.formData();
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
    from: `${data.email}`,
    to: 'chylik.lukas@gmail.com',
    subject: 'Nová rezervace z webu elendris.cz',
    html: message,
  };

  const success = await sendEmail(emailData);

  if (success) {
    return new Response(null, { status: 200 });
  } else {
    return new Response(null, { status: 500 });
  }
};