import os
import json
import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton

# ВСТАВЬТЕ СЮДА ВАШ ТОКЕН БОТА ОТ @BotFather
TOKEN = "YOUR_BOT_TOKEN_HERE"

# ID администратора (вставьте ваш ID из @getmyid_bot, чтобы другие не могли менять ссылки)
# Если 0, то менять могут все (не рекомендуется для продакшена!)
ADMIN_ID = 0 

bot = telebot.TeleBot(TOKEN)
LINKS_FILE = "links.json"

def load_links():
    if not os.path.exists(LINKS_FILE):
        return {}
    with open(LINKS_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_links(data):
    with open(LINKS_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

user_states = {}

@bot.message_handler(commands=['start', 'admin'])
def send_welcome(message):
    if ADMIN_ID != 0 and message.from_user.id != ADMIN_ID:
        bot.reply_to(message, "У вас нет прав доступа к админ панели.")
        return
        
    show_admin_panel(message.chat.id)

def show_admin_panel(chat_id):
    links = load_links()
    
    markup = InlineKeyboardMarkup(row_width=1)
    
    # Группы кнопок
    markup.add(InlineKeyboardButton("--- Основные кнопки ---", callback_data="ignore"))
    markup.add(
        InlineKeyboardButton(f"Вход {'✅' if links.get('login') else '❌'}", callback_data="edit_login"),
        InlineKeyboardButton(f"Регистрация {'✅' if links.get('register') else '❌'}", callback_data="edit_register"),
        InlineKeyboardButton(f"Играть (слоты) {'✅' if links.get('play') else '❌'}", callback_data="edit_play"),
        InlineKeyboardButton(f"Получить бонус {'✅' if links.get('bonus') else '❌'}", callback_data="edit_bonus"),
        InlineKeyboardButton(f"Все игры {'✅' if links.get('allGames') else '❌'}", callback_data="edit_allGames"),
        InlineKeyboardButton(f"Скачать приложение {'✅' if links.get('appBanner') else '❌'}", callback_data="edit_appBanner")
    )
    
    markup.add(InlineKeyboardButton("--- Вкладки (Tabs) ---", callback_data="ignore"))
    for tab in ["Лобби", "Слоты", "Instant Games", "Для хайроллеров", "Настольные", "Multiplier", "Megaways", "Hold And Win", "Только на FUGU"]:
        key = f"tab_{tab}"
        markup.add(InlineKeyboardButton(f"{tab} {'✅' if links.get(key) else '❌'}", callback_data=f"edit_{key}"))
        
    markup.add(InlineKeyboardButton("--- Подвал сайта (Footer) ---", callback_data="ignore"))
    for foot in ["Правила и условия", "Ответственная игра", "Политика конфиденциальности", "Партнёрская программа", "Связаться с нами"]:
        key = f"foot_{foot}"
        markup.add(InlineKeyboardButton(f"{foot} {'✅' if links.get(key) else '❌'}", callback_data=f"edit_{key}"))

    bot.send_message(chat_id, "🔧 <b>Админ-панель управления ссылками</b>\n\nВыберите кнопку, ссылку для которой вы хотите изменить.\n(✅ - ссылка задана, ❌ - пусто, ссылка ведет на заглушку #)", reply_markup=markup, parse_mode="HTML")

@bot.callback_query_handler(func=lambda call: call.data.startswith('edit_'))
def handle_edit(call):
    if ADMIN_ID != 0 and call.from_user.id != ADMIN_ID:
        bot.answer_callback_query(call.id, "Нет доступа")
        return
        
    key = call.data.replace('edit_', '')
    links = load_links()
    current_link = links.get(key, "Не задана")
    
    msg = bot.send_message(call.message.chat.id, f"Вы выбрали: <b>{key}</b>\nТекущая ссылка: {current_link}\n\nОтправьте новую ссылку в чат (начинающуюся с http:// или https://). Отправьте /cancel для отмены.", parse_mode="HTML")
    
    user_states[call.message.chat.id] = key

@bot.message_handler(func=lambda message: message.chat.id in user_states)
def process_new_link(message):
    chat_id = message.chat.id
    
    if message.text == '/cancel':
        del user_states[chat_id]
        bot.send_message(chat_id, "Действие отменено.")
        show_admin_panel(chat_id)
        return
        
    if not message.text.startswith('http'):
        bot.send_message(chat_id, "Ошибка! Ссылка должна начинаться с http:// или https://. Попробуйте снова или отправьте /cancel")
        return
        
    key = user_states[chat_id]
    links = load_links()
    links[key] = message.text
    save_links(links)
    
    del user_states[chat_id]
    
    bot.send_message(chat_id, f"✅ Ссылка для <b>{key}</b> успешно обновлена на {message.text}!\n\nИзменения сразу же отобразятся на лендинге при обновлении страницы.", parse_mode="HTML")
    show_admin_panel(chat_id)

print("Бот запущен! Жду сообщений...")
bot.infinity_polling()
