Ecwid.OnPageLoaded.add(function (page) {
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

      // Force Pikaday to open
      calendarInput.click();

      const interval = setInterval(() => {
        const activeDates = [...document.querySelectorAll('.pika-single td.pika-day:not(.is-disabled):not(.is-empty)')];
        if (activeDates.length >= 2) {
          const firstDate = activeDates[0];
          firstDate.classList.add('is-disabled');
          firstDate.setAttribute('aria-disabled', 'true');
          firstDate.style.pointerEvents = 'none';
          firstDate.style.opacity = '0.5';
          console.log("✅ First active date disabled due to cutoff.");
          clearInterval(interval);
        } else {
          console.log("⏳ Waiting for calendar to render at least 2 selectable days...");
        }
      }, 300);

      // Failsafe to prevent infinite loop
      setTimeout(() => clearInterval(interval), 5000);
    }
  }
});
