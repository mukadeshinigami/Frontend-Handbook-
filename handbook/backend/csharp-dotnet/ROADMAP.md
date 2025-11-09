# C# и .NET — Роадмап для изучения

## Текущий прогресс (что пройдено)

_Пока не начато — это начальный роадмап_

---

## Рекомендуемый роадмап (следующие блоки)

### Блок 1: Основы C# и .NET
**Файлы:** `01-csharp-basics.md` + `01-csharp-basics-practice.md`

**Цель:** Написать первую программу на C#, понять основы языка и платформы .NET.

**Темы:**
- Что такое C# и .NET
- .NET Framework vs .NET Core vs .NET 5+ (современный .NET)
- Установка .NET SDK
- Создание Console приложения: `dotnet new console`
- Структура проекта: `.csproj`, Program.cs
- `Main` метод — точка входа
- `Console.WriteLine()`, `Console.ReadLine()`
- Переменные и типы данных: `int`, `double`, `string`, `bool`, `char`
- Операторы: арифметические, логические, сравнения
- Комментарии: `//`, `/* */`, `///`
- `var` ключевое слово

**Практика:**
- Hello World приложение
- Калькулятор простых операций
- Конвертер температуры (Цельсий ↔ Фаренгейт)
- Программа для подсчёта суммы чисел

**Ресурс:** [Microsoft .NET Documentation](https://learn.microsoft.com/dotnet/)

---

### Блок 2: Управление потоком выполнения
**Файлы:** `02-control-flow.md` + `02-control-flow-practice.md`

**Цель:** Научиться использовать условия и циклы.

**Темы:**
- Условные операторы: `if`, `else if`, `else`
- Тернарный оператор: `? :`
- `switch` выражение (C# 8.0+)
- Циклы: `for`, `while`, `do-while`, `foreach`
- `break`, `continue`
- `goto` (редко используется)

**Практика:**
- FizzBuzz
- Проверка чётности/нечётности
- Генератор чисел Фибоначчи
- Таблица умножения

---

### Блок 3: Методы (Methods) и параметры
**Файлы:** `03-methods.md` + `03-methods-practice.md`

**Цель:** Научиться создавать и вызывать методы.

**Темы:**
- Определение методов
- Параметры и возвращаемые значения
- `void` методы
- Параметры по умолчанию
- Named arguments
- `ref`, `out`, `in` параметры
- Перегрузка методов (overloading)
- Рекурсия

**Практика:**
- Метод для вычисления факториала
- Метод для поиска максимума в массиве
- Перегрузка метода для разных типов
- Рекурсивный метод (например, обход дерева)

---

### Блок 4: Массивы и коллекции
**Файлы:** `04-arrays-collections.md` + `04-arrays-collections-practice.md`

**Цель:** Работать с массивами и коллекциями данных.

**Темы:**
- Массивы: объявление, инициализация, доступ к элементам
- Многомерные массивы
- Массивы массивов (jagged arrays)
- `List<T>` — динамический список
- `Dictionary<TKey, TValue>` — словарь (хеш-таблица)
- `HashSet<T>`, `Queue<T>`, `Stack<T>`
- LINQ — введение (подробнее в отдельном блоке)

**Практика:**
- Сортировка массива
- Поиск элемента в списке
- Подсчёт слов в тексте (Dictionary)
- Фильтрация и трансформация данных

---

### Блок 5: ООП — Классы и объекты
**Файлы:** `05-oop-classes.md` + `05-oop-classes-practice.md`

**Цель:** Понять основы объектно-ориентированного программирования.

**Темы:**
- Что такое ООП
- Классы и объекты
- Поля (fields), свойства (properties), методы
- Конструкторы
- `this` ключевое слово
- Модификаторы доступа: `public`, `private`, `protected`, `internal`
- `static` члены
- Properties: auto-properties, get/set
- `readonly` и `const`

**Практика:**
- Класс `Person` с полями и методами
- Класс `BankAccount` с балансом и операциями
- Класс `Rectangle` с вычислением площади
- Класс `Car` с инкапсуляцией данных

---

### Блок 6: ООП — Наследование и полиморфизм
**Файлы:** `06-oop-inheritance.md` + `06-oop-inheritance-practice.md`

**Цель:** Освоить наследование, полиморфизм и абстракцию.

**Темы:**
- Наследование: `class Derived : Base`
- `base` ключевое слово
- Переопределение методов: `virtual`, `override`
- Абстрактные классы: `abstract`
- Интерфейсы: `interface`
- Множественная реализация интерфейсов
- Полиморфизм
- `sealed` классы

**Практика:**
- Иерархия классов: `Animal` → `Dog`, `Cat`
- Геометрические фигуры с интерфейсом `IShape`
- Абстрактный класс `Vehicle` и наследники
- Полиморфизм в действии

---

### Блок 7: ООП — Инкапсуляция и абстракция
**Файлы:** `07-oop-encapsulation.md` + `07-oop-encapsulation-practice.md`

**Цель:** Углубить понимание инкапсуляции и абстракции.

**Темы:**
- Инкапсуляция: скрытие данных
- Геттеры и сеттеры (properties)
- Валидация в свойствах
- Абстракция: скрытие реализации
- Интерфейсы для абстракции
- Dependency Injection — введение

**Практика:**
- Класс с валидацией в свойствах
- Инкапсуляция бизнес-логики
- Интерфейсы для различных реализаций
- Простой DI контейнер (концепция)

---

### Блок 8: SOLID принципы
**Файлы:** `08-solid.md` + `08-solid-practice.md`

**Цель:** Освоить SOLID принципы проектирования (очень важно!).

**Темы:**
- **S — Single Responsibility Principle (SRP)**: один класс — одна ответственность
- **O — Open/Closed Principle (OCP)**: открыт для расширения, закрыт для изменений
- **L — Liskov Substitution Principle (LSP)**: подтипы должны быть заменяемы базовыми типами
- **I — Interface Segregation Principle (ISP)**: много специализированных интерфейсов лучше одного общего
- **D — Dependency Inversion Principle (DIP)**: зависимость от абстракций, а не от конкретных реализаций

**Практика:**
- Рефакторинг кода с нарушениями SRP
- Применение OCP с интерфейсами
- LSP на примере иерархии классов
- ISP: разделение больших интерфейсов
- DIP: внедрение зависимостей

**Ресурс:** [DotNet Tutorials - SOLID Design Principles](https://dotnettutorials.net/course/solid-design-principles/)

---

### Блок 9: Design Patterns (Паттерны проектирования)
**Файлы:** `09-design-patterns.md` + `09-design-patterns-practice.md`

**Цель:** Изучить популярные паттерны проектирования.

**Темы:**
- Зачем нужны паттерны
- **Creational Patterns:**
  - Singleton
  - Factory Method
  - Abstract Factory
  - Builder
- **Structural Patterns:**
  - Adapter
  - Decorator
  - Facade
- **Behavioral Patterns:**
  - Strategy
  - Observer
  - Command
  - Template Method

**Практика:**
- Реализация Singleton
- Factory для создания объектов
- Decorator для расширения функциональности
- Strategy паттерн для различных алгоритмов

---

### Блок 10: Обработка исключений (Exception Handling)
**Файлы:** `10-exceptions.md` + `10-exceptions-practice.md`

**Цель:** Научиться правильно обрабатывать ошибки.

**Темы:**
- `try`, `catch`, `finally`
- Типы исключений: `Exception`, `ArgumentException`, `NullReferenceException` и др.
- Создание кастомных исключений
- `throw` и `throw ex`
- `using` statement для автоматического освобождения ресурсов
- Best practices обработки исключений

**Практика:**
- Обработка деления на ноль
- Чтение файла с обработкой ошибок
- Кастомное исключение для бизнес-логики
- `using` для работы с файлами

---

### Блок 11: Работа с файлами и потоками (File I/O)
**Файлы:** `11-file-io.md` + `11-file-io-practice.md`

**Цель:** Читать и записывать файлы, работать с потоками.

**Темы:**
- Namespace `System.IO`
- `File` класс: `ReadAllText`, `WriteAllText`, `Exists`, `Delete`
- `StreamReader` и `StreamWriter`
- `FileStream`
- `Path` класс для работы с путями
- `Directory` класс
- Async file operations: `ReadAllTextAsync`, `WriteAllTextAsync`

**Практика:**
- Чтение и запись текстового файла
- Копирование файлов
- Логгер в файл
- Парсинг CSV файла

---

### Блок 12: LINQ (Language Integrated Query)
**Файлы:** `12-linq.md` + `12-linq-practice.md`

**Цель:** Освоить LINQ для запросов к коллекциям и базам данных.

**Темы:**
- Что такое LINQ
- Query syntax vs Method syntax
- `Where`, `Select`, `OrderBy`, `GroupBy`
- `First`, `FirstOrDefault`, `Single`, `Any`, `All`
- `Skip`, `Take` — pagination
- `Join`, `GroupJoin`
- Deferred execution (отложенное выполнение)
- LINQ to Objects, LINQ to SQL, LINQ to Entities

**Практика:**
- Фильтрация и трансформация списков
- Группировка данных
- Сортировка и пагинация
- Соединение коллекций (Join)

**Ресурс:** [Microsoft LINQ Documentation](https://learn.microsoft.com/dotnet/csharp/linq/)

---

### Блок 13: Асинхронное программирование (Async/Await)
**Файлы:** `13-async-await.md` + `13-async-await-practice.md`

**Цель:** Писать асинхронный код с async/await.

**Темы:**
- Что такое асинхронность
- `async` и `await` ключевые слова
- `Task` и `Task<T>`
- `Task.Run()`
- Обработка ошибок в async методах
- `Task.WhenAll`, `Task.WhenAny`
- `CancellationToken` для отмены операций
- Async streams: `IAsyncEnumerable<T>`

**Практика:**
- Асинхронное чтение файлов
- Параллельная загрузка данных
- HTTP запросы с `HttpClient`
- Отмена асинхронной операции

---

### Блок 14: ASP.NET Core — Основы веб-разработки
**Файлы:** `14-aspnet-basics.md` + `14-aspnet-basics-practice.md`

**Цель:** Создать первое веб-приложение на ASP.NET Core.

**Темы:**
- Что такое ASP.NET Core
- Создание проекта: `dotnet new web`, `dotnet new mvc`
- Структура проекта
- `Program.cs` и `Startup.cs` (в старых версиях)
- Middleware pipeline
- Routing
- Controllers и Actions
- Views (Razor)
- Model-View-Controller (MVC) паттерн

**Практика:**
- Hello World веб-приложение
- Простой MVC проект
- Контроллер с несколькими action методами
- View с передачей данных из контроллера

**Ресурс:** [Microsoft ASP.NET Core Tutorials](https://learn.microsoft.com/aspnet/core/tutorials/)

---

### Блок 15: ASP.NET Core — Controllers и Views
**Файлы:** `15-aspnet-controllers-views.md` + `15-aspnet-controllers-views-practice.md`

**Цель:** Углубиться в работу с контроллерами и представлениями.

**Темы:**
- Controllers: `Controller` base class
- Action methods и их результаты: `ViewResult`, `JsonResult`, `RedirectResult`
- Route parameters: `[Route("[controller]")]`
- Query parameters и model binding
- Views: Razor синтаксис (`@`, `@model`, `@foreach`)
- Layouts и partial views
- ViewData, ViewBag, TempData
- Tag Helpers

**Практика:**
- CRUD контроллер для управления данными
- Views с Razor синтаксисом
- Layout для всех страниц
- Partial views для переиспользования

---

### Блок 16: ASP.NET Core — Routing
**Файлы:** `16-aspnet-routing.md` + `16-aspnet-routing-practice.md`

**Цель:** Настроить маршрутизацию в ASP.NET Core.

**Темы:**
- Conventional routing vs Attribute routing
- Route templates: `{controller}/{action}/{id?}`
- Attribute routing: `[Route()]`, `[HttpGet]`, `[HttpPost]`
- Route constraints
- Area routing
- Custom route constraints

**Практика:**
- Настройка conventional routing
- Attribute routing для API
- Динамические маршруты
- Custom route constraint

---

### Блок 17: Entity Framework Core — Основы ORM
**Файлы:** `17-ef-core-basics.md` + `17-ef-core-basics-practice.md`

**Цель:** Научиться работать с базой данных через Entity Framework Core.

**Темы:**
- Что такое ORM (Object-Relational Mapping)
- Entity Framework Core
- Database First vs Code First подход (фокус на Code First)
- `DbContext` класс
- `DbSet<T>` — коллекции сущностей
- Entities (модели данных)
- Создание контекста БД
- Connection strings

**Практика:**
- Создание модели данных
- Создание DbContext
- Настройка connection string
- Простой проект с EF Core

**Ресурс:** [Microsoft Entity Framework Documentation](https://learn.microsoft.com/ef/core/)

---

### Блок 18: Entity Framework Core — LINQ запросы и CRUD
**Файлы:** `18-ef-core-linq-crud.md` + `18-ef-core-linq-crud-practice.md`

**Цель:** Выполнять CRUD операции через EF Core и LINQ.

**Темы:**
- LINQ to Entities
- `Add`, `Update`, `Remove` методы
- `SaveChanges()` и `SaveChangesAsync()`
- Запросы: `Where`, `Select`, `OrderBy`, `Include` (eager loading)
- Lazy loading vs Eager loading
- Tracking vs No-tracking queries
- Асинхронные операции: `ToListAsync`, `FirstOrDefaultAsync`

**Практика:**
- CRUD операции для сущностей
- Запросы с фильтрацией и сортировкой
- Eager loading связанных данных
- Асинхронные запросы

---

### Блок 19: Entity Framework Core — Migrations
**Файлы:** `19-ef-core-migrations.md` + `19-ef-core-migrations-practice.md`

**Цель:** Управлять схемой базы данных через миграции.

**Темы:**
- Что такое миграции
- Создание миграции: `dotnet ef migrations add <name>`
- Применение миграции: `dotnet ef database update`
- Откат миграций
- Seed данных
- Fluent API для конфигурации моделей
- Data Annotations vs Fluent API

**Практика:**
- Создание первой миграции
- Добавление новых полей и миграция
- Seed начальных данных
- Конфигурация моделей с Fluent API

---

### Блок 20: ASP.NET Core Web API
**Файлы:** `20-aspnet-webapi.md` + `20-aspnet-webapi-practice.md`

**Цель:** Создать RESTful API с ASP.NET Core.

**Темы:**
- Создание Web API проекта: `dotnet new webapi`
- API Controllers: `[ApiController]`, `ControllerBase`
- HTTP методы: `[HttpGet]`, `[HttpPost]`, `[HttpPut]`, `[HttpDelete]`
- Routing для API
- Model binding и validation: `[Required]`, `[Range]`, ModelState
- Возврат результатов: `Ok()`, `NotFound()`, `BadRequest()`, `CreatedAtAction()`
- Swagger/OpenAPI документация

**Практика:**
- REST API для управления задачами (To-Do List)
- CRUD операции через API endpoints
- Валидация входных данных
- Swagger документация

---

### Блок 21: Dependency Injection в ASP.NET Core
**Файлы:** `21-dependency-injection.md` + `21-dependency-injection-practice.md`

**Цель:** Освоить Dependency Injection (DI) для создания loosely coupled кода.

**Темы:**
- Что такое Dependency Injection
- Встроенный DI контейнер в ASP.NET Core
- Service lifetimes: Transient, Scoped, Singleton
- Регистрация сервисов: `services.AddTransient<>()`, `services.AddScoped<>()`
- Constructor injection
- Interface-based services
- Repository pattern

**Практика:**
- Создание сервиса и его регистрация
- Использование DI в контроллерах
- Repository pattern для доступа к данным
- Scoped vs Singleton vs Transient — разница в практике

---

### Блок 22: Аутентификация и авторизация
**Файлы:** `22-auth.md` + `22-auth-practice.md`

**Цель:** Реализовать систему аутентификации и авторизации.

**Темы:**
- Authentication vs Authorization
- ASP.NET Core Identity
- JWT (JSON Web Tokens)
- Cookie-based authentication
- Role-based authorization: `[Authorize(Roles = "Admin")]`
- Policy-based authorization
- Claims-based authorization
- OAuth 2.0 и OpenID Connect (введение)

**Практика:**
- Регистрация и логин с Identity
- JWT authentication для API
- Role-based доступ к endpoints
- Claims для детализированных прав

---

### Блок 23: Middleware и Filters
**Файлы:** `23-middleware-filters.md` + `23-middleware-filters-practice.md`

**Цель:** Создавать кастомные middleware и filters.

**Темы:**
- Что такое middleware
- Middleware pipeline
- Создание custom middleware
- Action filters
- `IActionFilter`, `IAsyncActionFilter`
- Exception filters
- Authorization filters
- Result filters

**Практика:**
- Custom logging middleware
- Exception handling middleware
- Action filter для логирования
- Authorization filter

---

### Блок 24: Unit Testing с xUnit и Moq
**Файлы:** `24-unit-testing.md` + `24-unit-testing-practice.md`

**Цель:** Писать unit тесты для C# приложений.

**Темы:**
- Тестовые фреймворки: xUnit, NUnit, MSTest
- Создание тестового проекта: `dotnet new xunit`
- Атрибуты: `[Fact]`, `[Theory]`, `[InlineData]`
- Assertions: `Assert.Equal`, `Assert.True`, `Assert.Throws`
- Mocking с Moq
- Test Driven Development (TDD)
- Code coverage

**Практика:**
- Unit тесты для бизнес-логики
- Тестирование контроллеров с Moq
- Mocking DbContext
- TDD подход на примере

---

### Блок 25: Deployment и DevOps
**Файлы:** `25-deployment-devops.md` + `25-deployment-devops-practice.md`

**Цель:** Развернуть приложение в production.

**Темы:**
- Публикация приложения: `dotnet publish`
- IIS hosting (Windows)
- Kestrel server
- Docker и контейнеризация
- Dockerfile для .NET приложения
- Azure App Service deployment
- CI/CD с GitHub Actions / Azure DevOps
- Environment variables и secrets management

**Практика:**
- Публикация приложения локально
- Dockerize .NET приложение
- Deployment на Azure
- Настройка CI/CD pipeline

---

## Рекомендуемый порядок изучения

**Базовый уровень (Блоки 1-7):**
Основы C#, управление потоком, методы, коллекции, ООП (классы, наследование, инкапсуляция).

**Средний уровень (Блоки 8-13):**
SOLID, паттерны проектирования, исключения, файловый ввод-вывод, LINQ, async/await.

**ASP.NET Core (Блоки 14-23):**
Веб-разработка, MVC, routing, Entity Framework Core, Web API, DI, аутентификация, middleware.

**Продвинутый уровень (Блоки 24-25):**
Unit тестирование, deployment, DevOps.

---

## Полезные ресурсы

- [Microsoft .NET Documentation](https://learn.microsoft.com/dotnet/)
- [Microsoft ASP.NET Core Tutorials](https://learn.microsoft.com/aspnet/core/tutorials/)
- [Microsoft Entity Framework Documentation](https://learn.microsoft.com/ef/core/)
- [DotNet Tutorials - SOLID Design Principles](https://dotnettutorials.net/course/solid-design-principles/)
- [C# Programming Guide](https://learn.microsoft.com/dotnet/csharp/programming-guide/)
- [Pluralsight .NET Courses](https://www.pluralsight.com/browse/software-development/microsoft-dotnet)
