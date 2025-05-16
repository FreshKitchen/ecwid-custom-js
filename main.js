Ecwid.OnAPILoaded.add(function () {
  console.log("Fresh Kitchen custom JS loaded");

  Ecwid.OnPageLoaded.add(function (page) {
    console.log("Page type:", page.type);

    if (page.type === 'PRODUCT') {
      console.log("Product page detected, injecting 'Back to Menu' button...");

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
          console.log("Button injected successfully.");
        } else {
          console.warn("Could not find checkout button container.");
        }
      }
    }

    /*
    if (page.type === 'CHECKOUT') {
      console.log("Checkout page loaded - Order cutoff logic here.");
    }
    */
  });
});

/*
  // --- [TEMPORARILY DISABLED] SMART ORDER CUTOFF LOGIC WITH SKIP-DAY SUPPORT ---
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
*/
