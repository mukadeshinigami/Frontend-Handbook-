# Блок 9: Даты и время (Date API)

## Введение

Объект **Date** в JavaScript используется для работы с датами и временем.

---

## Создание Date

```javascript
// Текущая дата и время
const now = new Date();
console.log(now); // 2024-01-15T10:30:00.000Z

// Из строки
const date1 = new Date('2024-01-15');
const date2 = new Date('2024-01-15T10:30:00');
const date3 = new Date('January 15, 2024');

// Из компонентов (год, месяц[0-11], день, часы, минуты, секунды, мс)
const date4 = new Date(2024, 0, 15); // 15 января 2024
const date5 = new Date(2024, 0, 15, 10, 30, 0);

// Из timestamp (миллисекунды с 1 января 1970)
const date6 = new Date(1705315800000);
```

**Важно:** Месяцы считаются с 0 (январь = 0, декабрь = 11)

---

## Получение компонентов даты

```javascript
const date = new Date('2024-01-15T10:30:45');

// Локальное время
console.log(date.getFullYear());    // 2024
console.log(date.getMonth());       // 0 (январь)
console.log(date.getDate());        // 15 (день месяца)
console.log(date.getDay());         // 1 (понедельник, 0 = воскресенье)
console.log(date.getHours());       // 10
console.log(date.getMinutes());     // 30
console.log(date.getSeconds());     // 45
console.log(date.getMilliseconds()); // 0

// UTC время
console.log(date.getUTCHours());    // Часы по UTC
console.log(date.getUTCDate());     // День по UTC

// Timestamp
console.log(date.getTime());        // 1705315845000
console.log(Date.now());            // Текущий timestamp
```

---

## Установка компонентов

```javascript
const date = new Date();

date.setFullYear(2025);
date.setMonth(11); // Декабрь
date.setDate(31);
date.setHours(23);
date.setMinutes(59);
date.setSeconds(59);

console.log(date); // 2025-12-31T23:59:59
```

---

## Форматирование

```javascript
const date = new Date('2024-01-15T10:30:00');

// Встроенные методы
console.log(date.toDateString());      // Mon Jan 15 2024
console.log(date.toTimeString());      // 10:30:00 GMT+0300
console.log(date.toLocaleString('ru-RU')); // 15.01.2024, 10:30:00
console.log(date.toLocaleDateString('ru-RU')); // 15.01.2024
console.log(date.toLocaleTimeString('ru-RU')); // 10:30:00

// С опциями
console.log(date.toLocaleDateString('ru-RU', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long'
})); // понедельник, 15 января 2024 г.

console.log(date.toLocaleTimeString('ru-RU', {
  hour: '2-digit',
  minute: '2-digit'
})); // 10:30
```

---

## Арифметика с датами

```javascript
// Добавление дней
const date = new Date('2024-01-15');
date.setDate(date.getDate() + 7); // +7 дней
console.log(date); // 2024-01-22

// Добавление месяцев
date.setMonth(date.getMonth() + 1); // +1 месяц

// Разница между датами
const start = new Date('2024-01-01');
const end = new Date('2024-01-15');
const diff = end - start; // Разница в миллисекундах
const days = Math.floor(diff / (1000 * 60 * 60 * 24));
console.log(`Прошло ${days} дней`); // 14
```

---

## Полезные функции

```javascript
// Получить количество дней в месяце
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

console.log(getDaysInMonth(2024, 1)); // 29 (февраль 2024 високосный)

// Форматирование даты
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

console.log(formatDate(new Date())); // 15.01.2024

// Относительное время
function getRelativeTime(date) {
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return 'только что';
  if (minutes < 60) return `${minutes} мин назад`;
  if (hours < 24) return `${hours} ч назад`;
  if (days < 7) return `${days} д назад`;
  return date.toLocaleDateString('ru-RU');
}

const past = new Date(Date.now() - 3600000); // 1 час назад
console.log(getRelativeTime(past)); // 1 ч назад
```

---

## Сравнение дат

```javascript
const date1 = new Date('2024-01-15');
const date2 = new Date('2024-01-20');

console.log(date1 < date2);  // true
console.log(date1 > date2);  // false
console.log(date1.getTime() === date2.getTime()); // false

// Проверка на одну дату
function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

console.log(isSameDay(new Date(), new Date())); // true
```

---

## Таймзоны

```javascript
const date = new Date();

// Смещение в минутах
console.log(date.getTimezoneOffset()); // -180 (для UTC+3)

// Конвертация в другую таймзону
const options = { timeZone: 'America/New_York' };
console.log(date.toLocaleString('ru-RU', options));
```

---

## Библиотеки

Для сложной работы с датами используйте:
- **date-fns** — модульная, легковесная
- **Day.js** — легковесная альтернатива Moment.js
- **Luxon** — современная, с поддержкой таймзон

```javascript
// Пример с date-fns (установка: npm install date-fns)
import { format, addDays, differenceInDays } from 'date-fns';
import { ru } from 'date-fns/locale';

const date = new Date();
console.log(format(date, 'd MMMM yyyy', { locale: ru }));
console.log(addDays(date, 7));
```

---

## Рекомендации

✅ Используйте `Date.now()` для timestamp  
✅ Храните даты в UTC  
✅ Используйте `toISOString()` для отправки на сервер  
✅ Для сложных операций — библиотеки (date-fns)  

❌ Не используйте `new Date()` без параметров для вычислений  
❌ Не забывайте про месяцы с 0  

**Переходите к практике!** 🚀
