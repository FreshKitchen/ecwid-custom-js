Ecwid.OnPageLoaded.add(function (page) {
  if (page.type && page.type.startsWith('CHECKOUT')) {
    console.log("✅ Cutoff logic page match:", page.type);

    const now = new Date();
    const currentHour = 13; // FORCE for testing

    if (currentHour >= 12) {
      console.log("🕛 Cutoff logic executing due to currentHour =", currentHour);

      setTimeout(() => {
        const pickupField = document.querySelector('input[id^="Pikaday-pickup-date"]');

        if (!pickupField) {
          console.warn("⚠️ Could not find pickup date input field.");
          return;
        }

        console.log("📅 Found pickup date field:", pickupField.id);

        const notice = document.createElement('div');
        notice.innerHTML = `
          <strong style="color: red;">Heads up!</strong> Orders placed after <strong>12:00 PM</strong> 
          cannot be scheduled for the next day. The earliest available pickup time has been adjusted.
        `;
        notice.style.backgroundColor = '#fff5f5';
        notice.style.border = '1px solid #ffcccc';
        notice.style.padding = '10px';
        notice.style.marginBottom = '15px';
        notice.style.fontSize = '14px';
        notice.style.borderRadius = '5px';

        // Insert just before the field, or into its container
        const wrapper = pickupField.closest('.form-control');
        if (wrapper) {
          wrapper.parentNode.insertBefore(notice, wrapper);
          console.log("📌 Notice injected above the date picker.");
        } else {
          console.warn("⚠️ Could not find container to inject warning.");
        }
      }, 1000);
    }
  }
});
