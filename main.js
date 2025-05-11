// --- FLOATING BACK TO MENU BUTTON ---
Ecwid.OnPageLoaded.add(function (page) {
  if (page.type === 'PRODUCT') {
    if (!document.querySelector('#floating-back-btn')) {
      const btn = document.createElement('a');
      btn.href = '/store'; // Change this to '/' if your homepage
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

// --- ORDER CUTOFF LOGIC FOR DELIVERY & PICKUP ---
Ecwid.OnPageLoaded.add(function (page) {
  if (page.type === 'CHECKOUT') {
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour >= 12) {
      setTimeout(() => {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        const tomorrowStr = `${yyyy}-${mm}-${dd}`;

        const removeTomorrowOption = (selector) => {
          const select = document.querySelector(selector);
          if (select) {
            const options = select.querySelectorAll('option');
            options.forEach((option) => {
              if (option.value === tomorrowStr) {
                option.remove();
              }
            });
          }
        };

        removeTomorrowOption('select[name*="deliveryDate"]');
        removeTomorrowOption('select[name*="pickupDate"]');

        const notice = document.createElement('div');
        notice.innerHTML = `
          <strong style="color: red;">Heads up!</strong> Orders must be placed by <strong>12:00 PM</strong> 
          to qualify for <strong>next-day pickup or delivery</strong>. Since it’s after noon, the earliest available 
          time is the following day.
        `;
        notice.style.backgroundColor = '#fff5f5';
        notice.style.border = '1px solid #ffcccc';
        notice.style.padding = '10px';
        notice.style.marginBottom = '15px';
        notice.style.fontSize = '14px';
        notice.style.borderRadius = '5px';

        const form = document.querySelector('.ecwid-PickupDeliveryForm');
        if (form) {
          form.prepend(notice);
        }
      }, 1000);
    }
  }
});
