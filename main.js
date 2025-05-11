// --- FLOATING BACK TO MENU BUTTON ---
Ecwid.OnPageLoaded.add(function (page) {
  if (page.type === 'PRODUCT') {
    if (!document.querySelector('#floating-back-btn')) {
      const btn = document.createElement('a');
      btn.href = '/store'; // Change this to your home or menu link
      btn.textContent = '← Back to Menu';
      btn.id = 'floating-back-btn';

      btn.style.position = 'fixed';
      btn.style.bottom = '20px';
      btn.style.left = '20px';
      btn.style.backgroundColor = 'white';
      btn.style.color = 'black';
      btn.style.border = '1px solid black';
      btn.style.padding = '10px 15px';
      btn.style.fontWeight = 'bold';
      btn.style.borderRadius = '5px';
      btn.style.textDecoration = 'none';
      btn.style.zIndex = '9999';
      btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
      btn.style.transition = 'background-color 0.2s ease';

      btn.onmouseover = () => btn.style.backgroundColor = '#f0f0f0';
      btn.onmouseout = () => btn.style.backgroundColor = 'white';

      document.body.appendChild(btn);
    }
  }
});
