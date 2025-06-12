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

          if (currentHour >= 12) {
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

            // Clear the default date value
            calendarInput.value = '';
            calendarInput.dispatchEvent(new Event('input', { bubbles: true }));

            // Trigger calendar render
            calendarInput.click();

            const interval = setInterval(() => {
              const activeDates = [...document.querySelectorAll('.pika-single td.pika-day:not(.is-disabled):not(.is-empty)')];
              if (activeDates.length >= 2) {
                const firstDate = activeDates[0];
                if (firstDate) {
                  firstDate.classList.add('is-disabled');
                  firstDate.setAttribute('aria-disabled', 'true');
                  firstDate.style.pointerEvents = 'none';
                  firstDate.style.opacity = '0.5';
                  console.log("✅ First active date disabled due to cutoff.");
                }
                clearInterval(interval);
              } else {
                console.log("⏳ Waiting for calendar to render at least 2 selectable days...");
              }
            }, 300);

            setTimeout(() => clearInterval(interval), 5000);
          }
        }
      });
    });
  } else {
    console.log("⏳ Waiting for Ecwid API...");
    setTimeout(waitForEcwid, 200);
  }
})();
