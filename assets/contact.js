const form = document.getElementById('contactForm');
const statusBox = document.getElementById('formStatus');
const endpoint = window.CONTACT_ENDPOINT || '';

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    statusBox.textContent = '';
    statusBox.className = 'status';

    if (!endpoint || endpoint === 'YOUR_GAS_WEB_APP_URL') {
      statusBox.textContent = 'GASのWebアプリURLが未設定です。contact.html 内の CONTACT_ENDPOINT を設定してください。';
      statusBox.classList.add('error');
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = '送信中...';

    const payload = {
      submittedAt: new Date().toISOString(),
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      topic: form.topic.value,
      message: form.message.value.trim(),
      page: window.location.href
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const text = await response.text();
      let data = {};
      try { data = JSON.parse(text); } catch (_) {}

      if (!response.ok && data.result !== 'success') {
        throw new Error('送信に失敗しました');
      }

      window.location.href = 'thanks.html';
    } catch (error) {
      statusBox.textContent = '送信に失敗しました。GASの公開設定、URL、スプレッドシート権限を確認してください。';
      statusBox.classList.add('error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = '送信する';
    }
  });
}
