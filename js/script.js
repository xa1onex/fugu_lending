// script.js – динамический тикер победителей
// Тикер заполняется массивом объектов {user, amount, currency, img}
// Для демонстрации используем несколько записей, которые дублируются для бесконечной прокрутки.

const winners = [
    { user: 'Ded***yan', amount: '12 762', currency: 'RUB', img: 'https://xn----btbm6aeire.xn--p1ai/assets/img/upload/belatra/diggersfortune.webp' },
    { user: 'Diz***uji', amount: '12 299', currency: 'RUB', img: 'https://xn----btbm6aeire.xn--p1ai/assets/img/upload/belatra/diggersfortune.webp' },
    { user: 'Geo***win', amount: '11 845', currency: 'RUB', img: 'https://xn----btbm6aeire.xn--p1ai/assets/img/upload/belatra/diggersfortune.webp' },
    { user: 'Poi***q1326', amount: '7 092', currency: 'RUB', img: 'https://xn----btbm6aeire.xn--p1ai/assets/img/upload/belatra/diggersfortune.webp' },
    { user: 'W**z', amount: '7 169', currency: 'RUB', img: 'https://xn----btbm6aeire.xn--p1ai/assets/img/upload/belatra/diggersfortune.webp' }
];

function createTickerItem(data) {
    const item = document.createElement('div');
    item.className = 'ticker__item';
    const img = document.createElement('img');
    img.className = 'ticker__game-img';
    img.src = data.img;
    img.alt = data.user;
    const info = document.createElement('div');
    info.className = 'ticker__info';
    const user = document.createElement('div');
    user.className = 'ticker__user';
    user.textContent = data.user;
    const sum = document.createElement('div');
    sum.className = 'ticker__sum';
    sum.textContent = `${data.amount} ${data.currency}`;
    info.append(user, sum);
    item.append(img, info);
    return item;
}

function populateTicker() {
    const track = document.getElementById('tickerTrack');
    if (!track) return;
    // Дублируем массив дважды, чтобы анимация выглядела бесконечной
    const extended = winners.concat(winners);
    extended.forEach(w => track.appendChild(createTickerItem(w)));
}

document.addEventListener('DOMContentLoaded', populateTicker);

// ==========================================
// GAMES FILTERING (TABS LOGIC)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.nav-tabs__item');
    const games = document.querySelectorAll('.game-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('nav-tabs__item--active'));
            // Add active class to clicked tab
            tab.classList.add('nav-tabs__item--active');
            
            const filter = tab.getAttribute('data-filter');
            
            games.forEach(game => {
                game.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                game.style.opacity = '0';
                game.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (filter === 'all') {
                        game.style.display = 'block';
                    } else {
                        const categories = game.getAttribute('data-category') || '';
                        if (categories.includes(filter)) {
                            game.style.display = 'block';
                        } else {
                            game.style.display = 'none';
                        }
                    }
                    
                    // Trigger reflow and show
                    requestAnimationFrame(() => {
                        game.style.opacity = '1';
                        game.style.transform = 'scale(1)';
                    });
                }, 300); // Wait for fade out
            });
        });
    });

    // ==========================================
    // LINKS SETTER (From JSON) & FORCE REDIRECT
    // ==========================================
    fetch('links.json?nocache=' + new Date().getTime())
        .then(res => res.json())
        .then(links => {
            console.log("Applied Links from Bot/JSON:", links);
            
            // Получаем первую доступную ссылку из конфига, чтобы использовать её для всех кнопок
            let fallbackLink = Object.values(links)[0];
            if (!fallbackLink) return;

            // Находим все кликабельные элементы (кнопки, ссылки, карточки игр)
            const allBtns = document.querySelectorAll('.btn, .game-card, .footer__nav a, .app-banner__btn, a');
            
            allBtns.forEach(btn => {
                // Пропускаем кнопки типа "Бургер меню" или слайдеров (если нужно)
                if (btn.classList.contains('header__burger')) return;
                
                // Переопределяем клик
                btn.addEventListener('click', (e) => {
                    // Если это вкладка навигации, мы не ломаем фильтр (если только для нее нет спец. ссылки)
                    if (btn.classList.contains('nav-tabs__item')) return;
                    
                    e.preventDefault();
                    window.location.href = fallbackLink;
                });

                // Если это <a> и у него пустой href, меняем визуально
                if (btn.tagName === 'A') {
                    const currentHref = btn.getAttribute('href');
                    if (!currentHref || currentHref === '#' || currentHref.startsWith('#')) {
                        btn.setAttribute('href', fallbackLink);
                    }
                }
            });
        })
        .catch(e => console.error('Error loading links.json', e));
});

