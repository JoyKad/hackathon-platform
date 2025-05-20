# 🚀 Hackathon Platform

Интерактивная платформа для регистрации и управления командами участников хакатона. Включает backend на Django + DRF и frontend на React.

---

## 📦 Содержание

- [🧰 Требования](#-требования)
- [⚙️ Установка и запуск бэкенда (Django)](#️-установка-и-запуск-бэкенда-django)
- [🎨 Установка и запуск фронтенда (React)](#-установка-и-запуск-фронтенда-react)
- [📘 Swagger-документация](#-swagger-документация)
- [🛠 Работа с Git и тегами](#-работа-с-git-и-тегами)

---

## 🧰 Требования

- **Python** ≥ 3.8  
- **Node.js** ≥ 14 + **npm**  
- **PostgreSQL** (локально или удалённо)

---

## ⚙️ Установка и запуск бэкенда (Django)

1. **Клонирование проекта**
   ```bash
   git clone https://github.com/YourUser/hackathon-platform.git
   cd hackathon-platform
   ```

2. **Создание и активация виртуального окружения**
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS / Linux:
   source venv/bin/activate
   # bash
   source venv/Scripts/activate
   ```

3. **Установка зависимостей**
   ```bash
   pip install -r requirements.txt
   ```

4. **Настройка базы данных**
   В файле `hackathon_platform/settings.py` настрой блок `DATABASES` под свою PostgreSQL-базу.

5. **Миграции и создание суперпользователя**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```

6. **Запуск сервера**
   ```bash
   python manage.py runserver
   ```
   API будет доступен по адресу: [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/)

---

## 🎨 Установка и запуск фронтенда (React)

1. **Перейти в каталог фронтенда**
   ```bash
   cd frontend
   ```

2. **Установить зависимости**
   ```bash
   npm install
   ```

3. **Запустить dev-сервер**
   ```bash
   npm start
   ```
   Интерфейс будет доступен на [http://localhost:3000](http://localhost:3000)

---

## 📘 Swagger-документация

Документация API доступна по адресу:

👉 [http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/)

> ⚠️ Только для суперпользователя! Войдите через [админку](http://127.0.0.1:8000/admin/) перед открытием `/api/docs/`.

---

## 🛠 Работа с Git и тегами

🔁 **Создание / обновление тега:**
```bash
# Удаление тега
git tag -d v1.1
git push origin --delete v1.1
# Добавление тега
git tag v1.1
git push origin v1.1
```

🪄 **Переключение ветки:**
```bash
git fetch origin
git checkout your-branch
```

> При ошибке `untracked files would be overwritten`, предварительно закоммить или удали конфликтующие файлы.

---

## ✅ Статус

Проект находится в активной разработке. Ожидается интеграция команд, рейтингов, и интерфейса для участников.
