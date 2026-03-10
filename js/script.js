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
