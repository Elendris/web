export const submitForm = (hideTime: number) => {
  const urlParams = new URLSearchParams(window.location.search);
  const successMessage = document.getElementById('successMessage');

  

  const form = document.getElementById('reservationForm') as HTMLFormElement | null;

  if (form) {
    form.addEventListener('submit', async (event) => {

      const formData = new FormData(form);
      const response = await fetch('http://localhost/send-email.php', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        window.location.href = window.location.pathname + '?reservated=true';
      } else {
        alert('Failed to send email');
      }
    });
  }
}