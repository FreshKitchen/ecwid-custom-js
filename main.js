(function waitForEcwid() {
  if (typeof Ecwid !== 'undefined' && Ecwid.OnAPILoaded) {
    Ecwid.OnAPILoaded.add(function () {
      console.log("✅ Fresh Kitchen custom JS loaded");

      Ecwid.OnPageLoaded.add(function (page) {
        console.log("Page type:", page.type);

        // --- BACK TO MENU BUTTON ON PRODUCT PAGE ---
        if (page.type === 'PRODUCT') {
          console.log("Injecting Back to Menu button...");
          if (!document.querySelector('#floating-back-btn')) {
            const btn = document.createElement('a');
            btn.href = 'https://www.yourfreshkitchen.com/products/FULL-MENU-c177145888';
            btn.textContent = '← Back to Menu';
            btn.id = 'floating-back-btn';

            Object.assign(btn.style, {
              display: 'inline-block',
              marginTop: '15px',
              padding: '10px 15px',
              backgroundColor: 'white',
              color: 'black',
              border: '1px solid black',
              fontWeight: 'bold',
              borderRadius: '5px',
              textDecoration: 'none',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              transition: 'background-color 0.2s ease'
            });

            btn.onmouseover = () => btn.style.backgroundColor = '#f0f0f0';
            btn.onmouseout = () => btn.style.backgroundColor = 'white';

            const purchaseBlock = document.querySelector('.details-product-purchase');
            if (purchaseBlock) {
              purchaseBlock.appendChild(btn);
              console.log("✅ Back to Menu button added.");
            } else {
              console.warn("⚠️ Could not find the purchase block container.");
            }
          }
        }

        // --- CUTOFF LOGIC ON CHECKOUT DELIVERY PAGE ---
        if (page.type === 'CHECKOUT_DELIVERY') {
          const now = new Date();
          const currentHour = now.getHours();
          console.log("Cutoff logic executing due to currentHour =", currentHour);

          const calendarInput = document.querySelector('input.form-control__text[readonly]');
          if (!calendarInput) {
            console.warn("⛔ Could not find the calendar input field.");
            return;
          }

          // Show cutoff warning
          const notice = document.createElement('div');
          notice.innerHTML = `
            <strong style="color: red;">Heads up!</strong> Orders placed after <strong>12:00 PM</strong> 
            cannot be scheduled for the next day. The earliest available pickup time has been adjusted.
          `;
          Object.assign(notice.style, {
            backgroundColor: '#fff5f5',
            border: '1px solid #ffcccc',
            padding: '10px',
            marginBottom: '15px',
            fontSize: '14px',
            borderRadius: '5px'
          });

          const formBlock = calendarInput.closest('.ec-form');
          if (formBlock && !formBlock.querySelector('.cutoff-warning')) {
            notice.classList.add('cutoff-warning');
            formBlock.prepend(notice);
          }

          // Clear the default date
          calendarInput.value = '';
          calendarInput.click();

          const deliveryDays = [1, 3, 5]; // example: Mon, Wed, Fri
          const interval = setInterval(() => {
            const today = new Date();
            const currentHour = today.getHours();
            let minValidDate = new Date(today);
            if (currentHour >= 12) minValidDate.setDate(today.getDate() + 1);

            let validFound = 0;
            const candidates = [...document.querySelectorAll('.pika-single td.pika-day:not(.is-empty)')];
            for (const td of candidates) {
              const dayText = td.textContent.trim();
              const cal = document.querySelector('.pika-single .pika-title select');
              if (!dayText || !cal) continue;
              const visibleMonth = parseInt(cal.value); // 0-based
              const visibleYear = parseInt(document.querySelector('.pika-single .pika-label-year').textContent);
              const date = new Date(visibleYear, visibleMonth, parseInt(dayText));
              if (date < minValidDate) {
                td.classList.add('is-disabled');
                td.setAttribute('aria-disabled', 'true');
                td.style.pointerEvents = 'none';
                td.style.opacity = '0.5';
              } else {
                validFound++;
              }
            }

            if (validFound >= 1) {
              clearInterval(interval);
              console.log("✅ Past-date blocking complete.");
            } else {
              console.log("⏳ Waiting for calendar to stabilize...");
            }
          }, 300);

          setTimeout(() => clearInterval(interval), 5000);
        }
      });
    });
  } else {
    console.log("⏳ Waiting for Ecwid API...");
    setTimeout(waitForEcwid, 200);
  }
})();
