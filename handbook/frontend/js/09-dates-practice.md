# Практика: Date API

## Календарь и таймер событий

Создайте приложение с календарём текущего месяца и списком событий.

**Функции:**
- Отображение календаря
- Добавление событий на даты
- Обратный отсчёт до событий
- Фильтрация (прошедшие/будущие)

**Время:** 40-50 минут

---

## HTML

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Календарь событий</title>
  <style>
    body { font-family: Arial; max-width: 900px; margin: 50px auto; }
    .calendar { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; margin: 20px 0; }
    .day { padding: 20px; background: #f0f0f0; text-align: center; border-radius: 5px; cursor: pointer; }
    .day.today { background: #667eea; color: white; }
    .day.has-event { border: 3px solid #28a745; }
    .events { margin-top: 30px; }
    .event { padding: 15px; background: #f8f9fa; margin-bottom: 10px; border-radius: 8px; }
    .countdown { font-size: 1.2rem; color: #667eea; font-weight: bold; }
  </style>
</head>
<body>
  <h1>📅 Календарь событий</h1>
  
  <div>
    <button onclick="prevMonth()">← Предыдущий</button>
    <span id="currentMonth"></span>
    <button onclick="nextMonth()">Следующий →</button>
  </div>
  
  <div class="calendar" id="calendar"></div>
  
  <div>
    <input type="text" id="eventTitle" placeholder="Название события">
    <input type="date" id="eventDate">
    <button onclick="addEvent()">Добавить</button>
  </div>
  
  <div class="events" id="eventsList"></div>

  <script>
    let currentDate = new Date();
    let events = JSON.parse(localStorage.getItem('events')) || [];
    
    function renderCalendar() {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      document.getElementById('currentMonth').textContent = 
        currentDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
      
      const calendar = document.getElementById('calendar');
      calendar.innerHTML = '';
      
      // Дни недели
      ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].forEach(day => {
        const div = document.createElement('div');
        div.textContent = day;
        div.style.fontWeight = 'bold';
        calendar.appendChild(div);
      });
      
      // Пустые клетки
      const startDay = firstDay === 0 ? 6 : firstDay - 1;
      for (let i = 0; i < startDay; i++) {
        calendar.appendChild(document.createElement('div'));
      }
      
      // Дни месяца
      const today = new Date();
      for (let day = 1; day <= daysInMonth; day++) {
        const div = document.createElement('div');
        div.className = 'day';
        div.textContent = day;
        
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        if (today.toDateString() === new Date(dateStr).toDateString()) {
          div.classList.add('today');
        }
        
        if (events.some(e => e.date === dateStr)) {
          div.classList.add('has-event');
        }
        
        div.onclick = () => {
          document.getElementById('eventDate').value = dateStr;
        };
        
        calendar.appendChild(div);
      }
    }
    
    function renderEvents() {
      const list = document.getElementById('eventsList');
      const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
      
      list.innerHTML = sorted.map(event => {
        const eventDate = new Date(event.date);
        const now = new Date();
        const diff = eventDate - now;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        
        let countdown = '';
        if (days > 0) {
          countdown = `<div class="countdown">через ${days} дней</div>`;
        } else if (days === 0) {
          countdown = `<div class="countdown">Сегодня!</div>`;
        } else {
          countdown = `<div style="color: #999">Прошло</div>`;
        }
        
        return `
          <div class="event">
            <strong>${event.title}</strong> - ${eventDate.toLocaleDateString('ru-RU')}
            ${countdown}
            <button onclick="deleteEvent('${event.id}')">Удалить</button>
          </div>
        `;
      }).join('');
    }
    
    function addEvent() {
      const title = document.getElementById('eventTitle').value;
      const date = document.getElementById('eventDate').value;
      
      if (!title || !date) {
        alert('Заполните все поля');
        return;
      }
      
      events.push({
        id: Date.now().toString(),
        title,
        date
      });
      
      localStorage.setItem('events', JSON.stringify(events));
      document.getElementById('eventTitle').value = '';
      renderCalendar();
      renderEvents();
    }
    
    function deleteEvent(id) {
      events = events.filter(e => e.id !== id);
      localStorage.setItem('events', JSON.stringify(events));
      renderCalendar();
      renderEvents();
    }
    
    function prevMonth() {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    }
    
    function nextMonth() {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    }
    
    renderCalendar();
    renderEvents();
    setInterval(renderEvents, 60000); // Обновление каждую минуту
  </script>
</body>
</html>
```

---

## Задания

1. Добавьте время к событиям (часы:минуты)
2. Реализуйте категории событий с цветами
3. Добавьте уведомления за день до события
4. Сделайте возможность редактирования событий
5. Добавьте экспорт событий в .ics файл

**Отличная работа!** 🚀
