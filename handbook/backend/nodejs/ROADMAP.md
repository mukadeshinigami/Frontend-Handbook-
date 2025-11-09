# Node.js — Роадмап для изучения

## Текущий прогресс (что пройдено)

_Пока не начато — это начальный роадмап_

---

## Рекомендуемый роадмап (следующие блоки)

### Блок 1: Основы Node.js и первая программа
**Файлы:** `01-basics.md` + `01-basics-practice.md`

**Цель:** Написать первую программу на Node.js, понять базовые концепции платформы.

**Темы:**
- Установка Node.js (nvm, npm, npx)
- Что такое Node.js и V8 Engine
- REPL (Read-Eval-Print Loop)
- Запуск JS файлов: `node script.js`
- `console.log()`, `console.error()`, `console.table()`
- Глобальные объекты: `global`, `process`, `__dirname`, `__filename`
- `process.argv` — аргументы командной строки
- `process.env` — переменные окружения
- Модули CommonJS: `require()`, `module.exports`
- ES Modules: `import`, `export` (с флагом `--experimental-modules` или package.json type: "module")

**Практика:**
- Hello World программа
- CLI калькулятор с аргументами командной строки
- Программа для вывода информации о системе (ОС, версия Node, память)
- Простой модуль с экспортом функций

---

### Блок 2: Работа с файловой системой (fs)
**Файлы:** `02-filesystem.md` + `02-filesystem-practice.md`

**Цель:** Научиться читать, писать и управлять файлами/директориями.

**Темы:**
- Модуль `fs` (File System)
- Синхронные vs асинхронные операции
- Чтение файлов: `fs.readFile()`, `fs.readFileSync()`
- Запись файлов: `fs.writeFile()`, `fs.writeFileSync()`
- Append: `fs.appendFile()`
- Удаление файлов: `fs.unlink()`
- Работа с директориями: `fs.mkdir()`, `fs.readdir()`, `fs.rmdir()`
- Проверка существования: `fs.existsSync()`, `fs.stat()`
- Promises API: `fs.promises`
- Streams для работы с большими файлами

**Практика:**
- Программа для чтения и вывода содержимого файла
- Логгер, который записывает сообщения в файл
- Утилита для копирования файлов
- Рекурсивный обход директорий с подсчётом файлов

---

### Блок 3: Асинхронность (Callbacks, Promises, Async/Await)
**Файлы:** `03-async.md` + `03-async-practice.md`

**Цель:** Понять асинхронную природу Node.js и научиться управлять асинхронным кодом.

**Темы:**
- Event Loop — как работает Node.js
- Call Stack, Task Queue, Microtask Queue
- Callback функции
- Callback Hell (Pyramid of Doom)
- Promises: `new Promise()`, `.then()`, `.catch()`, `.finally()`
- `Promise.all()`, `Promise.race()`, `Promise.allSettled()`
- Async/Await синтаксис
- Обработка ошибок: `try/catch` с async/await
- `util.promisify()` для конвертации callback в Promise

**Практика:**
- Последовательное чтение нескольких файлов (callbacks → promises → async/await)
- Параллельная загрузка данных с Promise.all()
- Таймер с промисами (setTimeout wrapped)
- Retry механизм для асинхронных операций

---

### Блок 4: HTTP и создание веб-сервера
**Файлы:** `04-http-server.md` + `04-http-server-practice.md`

**Цель:** Создать простой HTTP сервер и понять основы веб-разработки на Node.js.

**Темы:**
- Модуль `http` и `https`
- `http.createServer()` — создание сервера
- Request объект: `req.url`, `req.method`, `req.headers`
- Response объект: `res.statusCode`, `res.setHeader()`, `res.write()`, `res.end()`
- Роутинг (простой)
- Парсинг query параметров
- Обработка POST запросов и body
- Serving статических файлов
- CORS headers

**Практика:**
- Hello World HTTP сервер
- REST API с CRUD операциями (in-memory данные)
- Сервер для отдачи статических HTML/CSS/JS файлов
- JSON API с роутингом

---

### Блок 5: Express.js — веб-фреймворк
**Файлы:** `05-express.md` + `05-express-practice.md`

**Цель:** Освоить самый популярный веб-фреймворк для Node.js.

**Темы:**
- Установка Express: `npm install express`
- Создание приложения: `express()`
- Роутинг: `app.get()`, `app.post()`, `app.put()`, `app.delete()`
- Route parameters: `/users/:id`
- Query parameters: `req.query`
- Middleware концепция
- `app.use()` для подключения middleware
- Body parsers: `express.json()`, `express.urlencoded()`
- Статические файлы: `express.static()`
- Error handling middleware
- Router: `express.Router()`

**Практика:**
- REST API для управления списком задач (To-Do List)
- CRUD приложение с роутерами
- Middleware для логирования запросов
- Обработка ошибок с кастомным error handler

---

### Блок 6: Работа с базами данных
**Файлы:** `06-databases.md` + `06-databases-practice.md`

**Цель:** Научиться подключаться к базам данных и выполнять CRUD операции.

**Темы:**
- SQL vs NoSQL
- MongoDB и Mongoose ODM
  - Установка MongoDB
  - Подключение: `mongoose.connect()`
  - Схемы и модели: `Schema`, `model()`
  - CRUD операции: `create()`, `find()`, `findById()`, `updateOne()`, `deleteOne()`
  - Валидация данных
- PostgreSQL и pg библиотека (альтернативно)
  - Подключение к PostgreSQL
  - Выполнение SQL запросов
  - Prepared statements
  - Connection pooling

**Практика:**
- API для блога с MongoDB (посты, комментарии)
- CRUD операции с Mongoose
- Схемы с валидацией и relationships
- Миграции и seed данных

---

### Блок 7: Аутентификация и авторизация
**Файлы:** `07-auth.md` + `07-auth-practice.md`

**Цель:** Реализовать безопасную систему регистрации и входа пользователей.

**Темы:**
- Хеширование паролей: `bcrypt`
- JWT (JSON Web Tokens): `jsonwebtoken`
- Создание и верификация токенов
- Middleware для проверки аутентификации
- Sessions vs Tokens
- Refresh tokens
- OAuth 2.0 (базово)
- Passport.js стратегии
- HTTPS и безопасность

**Практика:**
- Регистрация и логин пользователей с JWT
- Protected routes (middleware для проверки токена)
- Refresh token механизм
- OAuth логин через Google/GitHub (базовая интеграция)

---

### Блок 8: Валидация и обработка ошибок
**Файлы:** `08-validation-errors.md` + `08-validation-errors-practice.md`

**Цель:** Научиться валидировать входящие данные и правильно обрабатывать ошибки.

**Темы:**
- Валидация с Joi / Yup / express-validator
- Schema validation
- Кастомные валидаторы
- Error handling best practices
- Централизованная обработка ошибок
- HTTP статус коды
- Кастомные Error классы
- Логирование ошибок
- Winston / Morgan для логов

**Практика:**
- Валидация регистрационных данных
- Централизованный error handler middleware
- Кастомные Error классы для разных типов ошибок
- Логирование с Winston

---

### Блок 9: Тестирование
**Файлы:** `09-testing.md` + `09-testing-practice.md`

**Цель:** Написать unit и integration тесты для Node.js приложений.

**Темы:**
- Тестовые фреймворки: Jest, Mocha, Chai
- Unit тесты функций
- Integration тесты API endpoints
- Mocking и stubs: `sinon`, `jest.mock()`
- Supertest для тестирования HTTP endpoints
- Test coverage: `jest --coverage`
- TDD (Test-Driven Development) подход
- CI/CD интеграция тестов

**Практика:**
- Unit тесты для утилитных функций
- Integration тесты для REST API
- Тестирование endpoints с Supertest
- Mocking базы данных

---

### Блок 10: Streams и Buffers
**Файлы:** `10-streams-buffers.md` + `10-streams-buffers-practice.md`

**Цель:** Эффективно работать с большими объёмами данных через streams.

**Темы:**
- Что такое Buffer
- Создание и работа с Buffer
- Readable streams
- Writable streams
- Transform streams
- Duplex streams
- Piping: `.pipe()`
- `stream.pipeline()`
- Backpressure
- Обработка больших файлов

**Практика:**
- Копирование больших файлов через streams
- CSV парсер с Transform stream
- Сжатие файлов (gzip) через streams
- Upload файлов на сервер через streams

---

### Блок 11: События (Events)
**Файлы:** `11-events.md` + `11-events-practice.md`

**Цель:** Понять event-driven архитектуру Node.js.

**Темы:**
- EventEmitter класс
- `.on()` — подписка на события
- `.emit()` — генерация событий
- `.once()` — одноразовая подписка
- `.removeListener()`, `.removeAllListeners()`
- Кастомные EventEmitter классы
- Error события
- Event-driven архитектура паттерны

**Практика:**
- Кастомный EventEmitter класс
- Логгер на основе событий
- Pub/Sub паттерн для микросервисов
- Chat приложение с событиями

---

### Блок 12: Работа с сетью (Networking)
**Файлы:** `12-networking.md` + `12-networking-practice.md`

**Цель:** Создавать TCP/UDP серверы и клиенты.

**Темы:**
- Модуль `net` — TCP
- Создание TCP сервера: `net.createServer()`
- TCP клиент: `net.connect()`
- Модуль `dgram` — UDP
- DNS модуль: `dns.lookup()`, `dns.resolve()`
- URL модуль: parsing URLs
- WebSockets (ws библиотека)
- Socket.IO для real-time коммуникации

**Практика:**
- TCP чат сервер
- UDP ping-pong приложение
- WebSocket сервер для real-time данных
- Chat приложение с Socket.IO

---

### Блок 13: Child Processes и Worker Threads
**Файлы:** `13-processes-threads.md` + `13-processes-threads-practice.md`

**Цель:** Запускать внешние процессы и использовать многопоточность.

**Темы:**
- Child Processes: `child_process.spawn()`, `.exec()`, `.fork()`
- Общение между процессами (IPC)
- Worker Threads модуль
- Создание worker: `new Worker()`
- `parentPort`, `workerData`
- Shared memory: `SharedArrayBuffer`
- Когда использовать child processes vs worker threads
- CPU-intensive задачи

**Практика:**
- Запуск shell команд из Node.js
- Параллельная обработка данных с Worker Threads
- Image processing в отдельных воркерах
- Кластеризация Node.js приложения

---

### Блок 14: Безопасность (Security)
**Файлы:** `14-security.md` + `14-security-practice.md`

**Цель:** Защитить приложение от распространённых уязвимостей.

**Темы:**
- OWASP Top 10
- SQL Injection защита (prepared statements)
- XSS (Cross-Site Scripting) защита
- CSRF (Cross-Site Request Forgery) защита: `csurf`
- Helmet.js — security headers
- Rate limiting: `express-rate-limit`
- Input sanitization
- Secure cookies: httpOnly, secure flags
- Environment variables и secrets management
- Dependency vulnerabilities: `npm audit`

**Практика:**
- Настройка Helmet.js
- Rate limiting для API endpoints
- CSRF protection
- Аудит зависимостей и исправление уязвимостей

---

### Блок 15: RESTful API Best Practices
**Файлы:** `15-rest-api.md` + `15-rest-api-practice.md`

**Цель:** Проектировать и реализовывать качественные REST API.

**Темы:**
- REST принципы и ограничения
- HTTP методы: GET, POST, PUT, PATCH, DELETE
- Статус коды и их значение
- Versioning API: `/api/v1/`
- Pagination: limit, offset, cursor-based
- Filtering, sorting, searching
- HATEOAS (опционально)
- API документация: Swagger/OpenAPI
- Postman коллекции
- GraphQL vs REST (введение)

**Практика:**
- REST API для e-commerce системы
- Pagination и filtering реализация
- Swagger документация для API
- Versioning API

---

### Блок 16: Микросервисы и архитектура
**Файлы:** `16-microservices.md` + `16-microservices-practice.md`

**Цель:** Понять архитектуру микросервисов и способы их организации.

**Темы:**
- Монолит vs Микросервисы
- Service discovery
- API Gateway паттерн
- Message brokers: RabbitMQ, Redis Pub/Sub
- gRPC для коммуникации между сервисами
- Docker и контейнеризация
- Docker Compose для multi-service приложений
- Kubernetes (введение)
- Monitoring и logging в distributed systems

**Практика:**
- Разделение монолитного приложения на микросервисы
- API Gateway с Express
- Message queue с RabbitMQ
- Dockerize Node.js приложение

---

### Блок 17: Performance и оптимизация
**Файлы:** `17-performance.md` + `17-performance-practice.md`

**Цель:** Оптимизировать производительность Node.js приложений.

**Темы:**
- Profiling: `node --inspect`, Chrome DevTools
- Memory leaks обнаружение
- Heap snapshots
- Clustering для использования всех CPU cores
- Load balancing: PM2, Nginx
- Caching стратегии: Redis, in-memory cache
- Database query optimization
- Compression: gzip middleware
- CDN для статических файлов
- Benchmarking: Apache Bench, wrk

**Практика:**
- Profiling и оптимизация медленных endpoints
- Настройка clustering с PM2
- Redis caching для часто запрашиваемых данных
- Load testing с Apache Bench

---

### Блок 18: Deployment и DevOps
**Файлы:** `18-deployment.md` + `18-deployment-practice.md`

**Цель:** Развернуть Node.js приложение в production.

**Темы:**
- Environment переменные и конфигурация
- Process managers: PM2, forever
- Reverse proxy: Nginx
- SSL/TLS сертификаты: Let's Encrypt
- Платформы для деплоя: Heroku, Vercel, AWS, DigitalOcean
- AWS EC2, S3, RDS
- CI/CD: GitHub Actions, GitLab CI, Jenkins
- Monitoring: New Relic, Datadog, PM2 monitoring
- Logging в production: Winston, Loggly
- Zero-downtime deployments

**Практика:**
- Деплой на Heroku
- Настройка Nginx reverse proxy
- SSL сертификат с Let's Encrypt
- CI/CD pipeline с GitHub Actions
- Мониторинг production приложения

---

## Дополнительные темы (продвинутые)

### WebSockets и Real-Time приложения
- Socket.IO advanced patterns
- Scaling WebSocket servers
- Real-time notifications

### GraphQL
- Apollo Server
- Schema definition
- Resolvers
- Subscriptions

### TypeScript с Node.js
- Настройка TypeScript проекта
- tsconfig.json
- Type definitions для npm пакетов
- Строгая типизация для API

### Serverless
- AWS Lambda с Node.js
- Serverless Framework
- Cold starts и оптимизация

### Message Queues
- RabbitMQ, Apache Kafka
- Bull (Redis-based queue)
- Job scheduling

---

## Полезные ресурсы

- Официальная документация: [nodejs.org](https://nodejs.org/docs/)
- Node.js Best Practices: [goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices)
- Express.js документация: [expressjs.com](https://expressjs.com/)
- MDN JavaScript: [developer.mozilla.org](https://developer.mozilla.org/)

---

**Примечание:** Этот роадмап можно адаптировать под свои нужды. Рекомендуется двигаться последовательно, закрепляя каждый блок практикой перед переходом к следующему.
