// EVA Dynamic links loader
fetch('links.json')
  .then(res => res.json())
  .then(links => {
    const allBtns = document.querySelectorAll('button, a');
    allBtns.forEach(btn => {
      let text = btn.textContent.trim().toLowerCase();
      
      if (text.includes('вход') && links.login) {
          if(btn.tagName === 'BUTTON') btn.onclick = () => window.location.href = links.login;
          else btn.setAttribute('href', links.login);
      }
      else if (text.includes('регистрация') && links.register) {
          if(btn.tagName === 'BUTTON') btn.onclick = () => window.location.href = links.register;
          else btn.setAttribute('href', links.register);
      }
      else if (text.includes('получить бонус') && links.bonus) {
          if(btn.tagName === 'BUTTON') btn.onclick = () => window.location.href = links.bonus;
      }
      else if (text.includes('активировать пакет') && links.bonus) {
          if(btn.tagName === 'BUTTON') btn.onclick = () => window.location.href = links.bonus;
      }
    });

    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        if(links.play) card.setAttribute('href', links.play);
    });
  })
  .catch(e => console.error('Error loading links.json:', e));
