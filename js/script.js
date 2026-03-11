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
    // BUTTONS INTERACTIVITY
    // ==========================================
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Prevent default if it's a dummy link
            if (btn.getAttribute('href') === '#') {
                e.preventDefault();
                
                // Show simple feedback depending on button text
                const text = btn.textContent.trim();
                
                // create a temporary toast notification instead of alert!
                const toast = document.createElement('div');
                toast.style.position = 'fixed';
                toast.style.bottom = '20px';
                toast.style.right = '20px';
                toast.style.background = 'var(--accent-gold)';
                toast.style.color = '#111';
                toast.style.padding = '12px 24px';
                toast.style.borderRadius = '8px';
                toast.style.fontWeight = 'bold';
                toast.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
                toast.style.zIndex = '9999';
                toast.style.transform = 'translateY(100px)';
                toast.style.opacity = '0';
                toast.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                
                if (text.includes('Играть')) {
                    toast.innerHTML = '🎮 Загрузка игры... Пожалуйста, войдите в аккаунт.';
                } else if (text.includes('Вход') || text.includes('Регистрация')) {
                    toast.innerHTML = '🔒 Открытие формы авторизации...';
                } else if (text.includes('Получить')) {
                    toast.innerHTML = '🎁 Бонус активирован в корзине!';
                } else {
                    toast.innerHTML = '✅ Действие выполнено!';
                }
                
                document.body.appendChild(toast);
                
                requestAnimationFrame(() => {
                    toast.style.transform = 'translateY(0)';
                    toast.style.opacity = '1';
                });
                
                setTimeout(() => {
                    toast.style.transform = 'translateY(100px)';
                    toast.style.opacity = '0';
                    setTimeout(() => toast.remove(), 300);
                }, 3000);
            }
        });
    });

    // ==========================================
    // ==========================================
    // ADMIN LINKS SETTER (From JSON)
    // ==========================================
    fetch('links.json')
        .then(res => res.json())
        .then(links => {
            console.log("Applied Links from Bot/JSON:", links);

            const allBtns = document.querySelectorAll('.btn, .nav-tabs__item, .footer__nav a');
            
            allBtns.forEach(btn => {
                const textOrig = btn.textContent.trim();
                const text = textOrig.toLowerCase();

                // Основные кнопки
                if (text.includes('вход') && links.login) {
                    btn.setAttribute('href', links.login);
                } else if (text.includes('регистрация') && links.register) {
                    btn.setAttribute('href', links.register);
                } else if (text.includes('играть') && links.play) {
                    btn.setAttribute('href', links.play);
                    btn.setAttribute('target', '_blank'); 
                } else if (text.includes('получить') && links.bonus) {
                    btn.setAttribute('href', links.bonus);
                } else if (text.includes('скачать') && links.appBanner) {
                    btn.setAttribute('href', links.appBanner);
                } else if (text.includes('все игры') && links.allGames) {
                    btn.setAttribute('href', links.allGames);
                }
                
                // Вкладки Лобби и другие (по ключу с префиксом tab_)
                if (links['tab_' + textOrig]) {
                    btn.setAttribute('href', links['tab_' + textOrig]);
                    // Переопределяем клик, если это ссылка
                    if (btn.classList.contains('nav-tabs__item')) {
                         btn.addEventListener('click', (e) => {
                             if (links['tab_' + textOrig] !== "#" && links['tab_' + textOrig] !== "") {
                                 window.location.href = links['tab_' + textOrig];
                             }
                         });
                    }
                }
                
                // Футер
                if (links['foot_' + textOrig]) {
                    btn.setAttribute('href', links['foot_' + textOrig]);
                }
            });
        })
        .catch(e => console.error('Error loading links.json', e));
});

