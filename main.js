// --- DEBUGGING: SMART ORDER CUTOFF LOGIC WITH SKIP-DAY SUPPORT ---
Ecwid.OnPageLoaded.add(function (page) {
  if (page.type && page.type.startsWith('CHECKOUT')) {
    console.log("✅ Cutoff logic page match:", page.type);

    const now = new Date();
    const currentHour = 13; // 🔧 FORCED to simulate post-12PM

    if (currentHour >= 12) {
      console.log("🕛 Cutoff logic executing due to currentHour =", currentHour);

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
          if (!select) {
            console.warn(`⚠️ Selector not found: ${selector}`);
            return null;
          }

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
              console.log(`🗑️ Removed date from ${selector}:`, removedDate);
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
          console.log("📌 Notice injected into pickup/delivery form.");
        } else {
          console.warn("⚠️ Could not find .ecwid-PickupDeliveryForm to inject notice.");
        }
      }, 1000); // Give Ecwid time to finish rendering
    }
  }
});
