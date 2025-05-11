Ecwid.OnAPILoaded.add(function () {

  // --- FLOATING BACK TO MENU BUTTON ---
  Ecwid.OnPageLoaded.add(function (page) {
    if (page.type === 'PRODUCT') {
      if (!document.querySelector('#floating-back-btn')) {
        const btn = document.createElement('a');
        btn.href = '/store'; // Change to your menu/homepage
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

  // --- SMART ORDER CUTOFF LOGIC WITH SKIP-DAY SUPPORT ---
  Ecwid.OnPageLoaded.add(function (page) {
    if (page.type === 'CHECKOUT') {
      const now = new Date();
      const currentHour = now.getHours();

      if (currentHour >= 12) {
        setTimeout(() => {
          const maxLookaheadDays = 7;
          const formatDate = (d) => {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
          };

          const removeNextAvailable = (selector) => {
            const select = document.querySelector(selector);
            if (!select) return;

            const options = Array.from(select.querySelectorAll('option'));
            let removedDate = null;

            for (let i = 1; i <= maxLookaheadDays; i++) {
              const candidateDate = new Date();
              candidateDate.setDate(candidateDate.getDate() + i);
              const candidateStr = formatDate(candidateDate);

              const match = options.find(opt => opt.value === candidateStr);
              if (match) {
                match.remove();
                removedDate = candidateStr;
                break;
              }
            }

            return removedDate;
          };

          const removedPickup = removeNextAvailable('select[name*="pickupDate"]');
          const removedDelivery = removeNextAvailable('select[name*="deliveryDate"]');

          const notice = document.createElement('div');
          notice.innerHTML = `
            <strong style="color: red;">Heads up!</strong> Orders placed after <strong>12:00 PM</strong> 
            cannot be scheduled for the next day. ${
              removedPickup || removedDelivery
                ? `The earliest available option has been adjusted to reflect our schedule.`
                : ``
            }
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

});
