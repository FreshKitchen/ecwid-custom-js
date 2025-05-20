Ecwid.OnAPILoaded.add(function () {
  console.log("Fresh Kitchen custom JS loaded");

  Ecwid.OnPageLoaded.add(function (page) {
    console.log("Page type:", page.type);

    if (page.type === 'CHECKOUT_DELIVERY') {
      const now = new Date();
      const currentHour = now.getHours();
      console.log("Cutoff logic executing due to currentHour =", currentHour);

      // Only trigger if it's past 12:00 PM
      if (currentHour >= 12) {
        const interval = setInterval(() => {
          const dateCells = document.querySelectorAll('.pika-single:not(.is-hidden) td.pika-day:not(.is-disabled)');

          if (dateCells.length >= 2) {
            const firstDate = dateCells[0];
            firstDate.classList.add('is-disabled');
            firstDate.setAttribute('aria-disabled', 'true');
            firstDate.style.pointerEvents = 'none';
            firstDate.style.opacity = '0.5';
            console.log("⛔ First available date disabled due to cutoff.");
            clearInterval(interval);
          } else {
            console.log("⏳ Waiting for at least two active dates in Pikaday...");
          }
        }, 300); // Keep checking until Pikaday finishes rendering
        setTimeout(() => clearInterval(interval), 5000); // timeout safety
      }
    }

    if (page.type === 'PRODUCT') {
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
          console.log("🧭 Back to Menu button injected.");
        }
      }
    }
  });
});
