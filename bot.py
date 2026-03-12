import os
import json
import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton

# ВСТАВЬТЕ СЮДА ВАШ ТОКЕН БОТА ОТ @BotFather
TOKEN = "YOUR_BOT_TOKEN_HERE"

# ID администратора (вставьте ваш ID из @getmyid_bot, чтобы другие не могли менять ссылки)
ADMIN_ID = 0 

bot = telebot.TeleBot(TOKEN)
CONFIG_FILE = "bot_config.json"

def load_config():
    if not os.path.exists(CONFIG_FILE):
        # Создаем базовый конфиг
        default_config = {
            "projects": {
                "fugu": {
                    "name": "🐟 Fugu Casino",
                    "links_file": "links.json", # Путь до файла links.json первого лендинга
                    "categories": [
                        {
                            "name": "--- Основные кнопки ---",
                            "buttons": [
                                {"key": "login", "label": "Вход"},
                                {"key": "register", "label": "Регистрация"},
                                {"key": "play", "label": "Играть (слоты)"},
                                {"key": "bonus", "label": "Получить бонус"},
                                {"key": "allGames", "label": "Все игры"},
                                {"key": "appBanner", "label": "Скачать приложение"}
                            ]
                        },
                        {
                            "name": "--- Вкладки (Tabs) ---",
                            "buttons": [
                                {"key": "tab_Лобби", "label": "Лобби"},
                                {"key": "tab_Слоты", "label": "Слоты"},
                                {"key": "tab_Instant Games", "label": "Instant Games"},
                                {"key": "tab_Для хайроллеров", "label": "Для хайроллеров"},
                                {"key": "tab_Настольные", "label": "Настольные"},
                                {"key": "tab_Multiplier", "label": "Multiplier"},
                                {"key": "tab_Megaways", "label": "Megaways"},
                                {"key": "tab_Hold And Win", "label": "Hold And Win"},
                                {"key": "tab_Только на FUGU", "label": "Только на FUGU"}
                            ]
                        },
                        {
                            "name": "--- Подвал сайта (Footer) ---",
                            "buttons": [
                                {"key": "foot_Правила и условия", "label": "Правила и условия"},
                                {"key": "foot_Ответственная игра", "label": "Ответственная игра"},
                                {"key": "foot_Политика конфиденциальности", "label": "Политика конфиденциальности"},
                                {"key": "foot_Партнёрская программа", "label": "Партнёрская программа"},
                                {"key": "foot_Связаться с нами", "label": "Связаться с нами"}
                            ]
                        }
                    ]
                },
                "example_landing": {
                    "name": "🔥 Другой лендинг",
                    "links_file": "/Users/macbookair/Documents/RiderProjects/example_landing/links.json",
                    "categories": [
                        {
                            "name": "--- Главные ---",
                            "buttons": [
                                {"key": "main_btn", "label": "Главная кнопка"},
                                {"key": "support", "label": "Поддержка"}
                            ]
                        }
                    ]
                }
            }
        }
        with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
            json.dump(default_config, f, ensure_ascii=False, indent=4)
        return default_config
        
    with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def load_links(filepath):
    if not os.path.exists(filepath):
        return {}
    with open(filepath, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except Exception:
            return {}

def save_links(filepath, data):
    # Создаем папку, если она не существует
    os.makedirs(os.path.dirname(os.path.abspath(filepath)), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

# Состояния: { chat_id: {'project': 'fugu', 'key': 'login'} }
user_states = {}

@bot.message_handler(commands=['start', 'admin'])
def send_welcome(message):
    if ADMIN_ID != 0 and message.from_user.id != ADMIN_ID:
        markup = InlineKeyboardMarkup()
        markup.add(InlineKeyboardButton("🎰 ИГРАТЬ", url="https://lb777.xyz/66Ytuv"))
        bot.reply_to(message, "Добро пожаловать в казино! Нажмите кнопку ниже, чтобы начать игру:", reply_markup=markup)
        return
        
    config = load_config()
    projects = config.get("projects", {})
    
    if not projects:
        bot.send_message(message.chat.id, "Нет настроенных проектов в bot_config.json")
        return
        
    markup = InlineKeyboardMarkup(row_width=1)
    for p_id, p_data in projects.items():
        markup.add(InlineKeyboardButton(p_data["name"], callback_data=f"proj_{p_id}"))
        
    bot.send_message(message.chat.id, "👋 <b>Главное меню</b>\n\nВыберите лендинг, ссылки которого хотите редактировать:", reply_markup=markup, parse_mode="HTML")

@bot.callback_query_handler(func=lambda call: call.data.startswith('proj_'))
def handle_project_select(call):
    if ADMIN_ID != 0 and call.from_user.id != ADMIN_ID:
        bot.answer_callback_query(call.id, "Нет доступа")
        return
        
    project_id = call.data.replace('proj_', '')
    show_project_menu(call.message.chat.id, project_id)

def show_project_menu(chat_id, project_id):
    config = load_config()
    project = config["projects"].get(project_id)
    if not project:
        bot.send_message(chat_id, "Проект не найден.")
        return
        
    links_file = project.get("links_file", "links.json")
    links = load_links(links_file)
    
    markup = InlineKeyboardMarkup(row_width=1)
    
    for category in project.get("categories", []):
        markup.add(InlineKeyboardButton(category["name"], callback_data="ignore"))
        
        btn_row = []
        for btn in category.get("buttons", []):
            key = btn["key"]
            label = btn["label"]
            status = '✅' if links.get(key) else '❌'
            # передаем данные в формате: edit_PROJID_KEY
            callback = f"edit_{project_id}_{key}"
            markup.add(InlineKeyboardButton(f"{label} {status}", callback_data=callback))
            
    markup.add(InlineKeyboardButton("🔄 Установить ОДНУ ссылку на ВСЕ кнопки", callback_data=f"setall_{project_id}"))
    markup.add(InlineKeyboardButton("⬅️ Назад к выбору лендинга", callback_data="back_to_main"))
    
    bot.send_message(chat_id, f"🔧 Настройка: <b>{project['name']}</b>\n(✅ - ссылка задана, ❌ - пусто)\n\nВыберите кнопку:", reply_markup=markup, parse_mode="HTML")

@bot.callback_query_handler(func=lambda call: call.data.startswith('setall_'))
def handle_setall(call):
    if ADMIN_ID != 0 and call.from_user.id != ADMIN_ID:
        bot.answer_callback_query(call.id, "Нет доступа")
        return
        
    project_id = call.data.replace('setall_', '')
    config = load_config()
    project = config["projects"].get(project_id)
    
    bot.send_message(call.message.chat.id, f"Проект: <b>{project['name']}</b>\n\nОтправьте ссылку (начиная с http), которая будет установлена на <b>ВСЕ</b> кнопки этого лендинга. /cancel для отмены.", parse_mode="HTML")
    
    user_states[call.message.chat.id] = {'project': project_id, 'key': 'ALL_BUTTONS'}

@bot.callback_query_handler(func=lambda call: call.data == 'back_to_main')
def back_to_main(call):
    if ADMIN_ID != 0 and call.from_user.id != ADMIN_ID:
        return
    bot.delete_message(call.message.chat.id, call.message.message_id)
    send_welcome(call.message)

@bot.callback_query_handler(func=lambda call: call.data.startswith('edit_'))
def handle_edit(call):
    if ADMIN_ID != 0 and call.from_user.id != ADMIN_ID:
        bot.answer_callback_query(call.id, "Нет доступа")
        return
        
    # Парсим edit_PROJID_KEY
    data_parts = call.data.split('_', 2)
    project_id = data_parts[1]
    key = data_parts[2]
    
    config = load_config()
    project = config["projects"].get(project_id)
    
    links = load_links(project["links_file"])
    current_link = links.get(key, "Не задана")
    
    bot.send_message(call.message.chat.id, f"Проект: <b>{project['name']}</b>\nКнопка: <b>{key}</b>\nТекущая ссылка: {current_link}\n\nОтправьте новую ссылку (начинающуюся с http). Отправьте /cancel для отмены.", parse_mode="HTML")
    
    user_states[call.message.chat.id] = {'project': project_id, 'key': key}

@bot.message_handler(func=lambda message: message.chat.id in user_states)
def process_new_link(message):
    chat_id = message.chat.id
    state = user_states[chat_id]
    project_id = state['project']
    key = state['key']
    
    if message.text == '/cancel':
        del user_states[chat_id]
        bot.send_message(chat_id, "Действие отменено.")
        show_project_menu(chat_id, project_id)
        return
        
    if not message.text.startswith('http'):
        bot.send_message(chat_id, "Ошибка! Ссылка должна начинаться с http:// или https://. Отправьте ссылку еще раз или /cancel")
        return
        
    config = load_config()
    project = config["projects"].get(project_id)
    
    links = load_links(project["links_file"])
    
    if key == 'ALL_BUTTONS':
        count = 0
        for category in project.get("categories", []):
            for btn in category.get("buttons", []):
                links[btn["key"]] = message.text
                count += 1
        bot.send_message(chat_id, f"✅ Единая ссылка сохранена для <b>ВСЕХ</b> ({count}) кнопок проекта <b>{project['name']}</b>!\nНовая ссылка: {message.text}", parse_mode="HTML")
    else:
        links[key] = message.text
        bot.send_message(chat_id, f"✅ Ссылка сохранена!\n\nПроект: <b>{project['name']}</b>\nКнопка: <b>{key}</b>\nНовая ссылка: {message.text}", parse_mode="HTML")
        
    save_links(project["links_file"], links)
    
    del user_states[chat_id]
    
    show_project_menu(chat_id, project_id)

print("Универсальный бот-админка запущен! Жду сообщений...")
bot.infinity_polling()
