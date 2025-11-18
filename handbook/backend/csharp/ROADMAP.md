
# C# — Роадмап и структура курса

Ниже — доработанный роадмап для `handbook/backend/csharp/`, приведённый в формат, совместимый с остальными разделами проекта: блоки с целями, файлами, ключевыми темами и практикой. Я постарался сохранить имена файлов, которые уже созданы в папке `handbook/backend/csharp/`.

## Текущий прогресс

- Созданы базовые уроки и примеры (01–10). Этот файл приведён к единому формату с другими роадмапами.

---

## Рекомендуемый роадмап (блоки и файлы)

### Блок 01 — Основы (файл: `01-basics.md`)
Цель: познакомиться со средой .NET и написать первое консольное приложение.

Темы:
- Установка .NET SDK (рекомендуется LTS)
- `dotnet new console`, структура проекта (`.csproj`, Program.cs)
- `dotnet run`, `dotnet build`
- Переменные, типы, string interpolation

Практика:
- Hello World, обработка аргументов командной строки

---

### Блок 02 — Типы и переменные (файл: `02-types-and-variables.md`)
Цель: понять примитивы и ссылочные типы, nullable, преобразования типов.

Темы:
- value vs reference types, boxing/unboxing
- nullable types, оператор `??`
- `var` и явная типизация, `const`, `readonly`

Практика:
- Безопасный парсинг строк в числа, примеры с Nullable

---

### Блок 03 — Управление потоком (файл: `03-control-flow.md`)
Цель: освоить условные операторы, циклы и pattern matching.

Темы:
- `if/else`, `switch` выражения (C# 8+), циклы `for/while/foreach`
- pattern matching (`is`, `switch` with `when`)

Практика:
- FizzBuzz, функции категоризации чисел с использованием pattern matching

---

### Блок 04 — Классы и ООП (файл: `04-classes-and-objects.md`)
Цель: основы ООП — классы, свойства, методы, интерфейсы.

Темы:
- классы/структуры, свойства (auto-properties), конструкторы
- интерфейсы, `this`, модификаторы доступа

Практика:
- Создать `Rectangle`, `Person`, примеры deconstruction

---

### Блок 05 — Асинхронность (файл: `05-async-await.md`)
Цель: писать неблокирующий код с `Task`, `async/await`, управлять отменой.

Темы:
- `Task` / `Task<T>`, `async`/`await`, `ConfigureAwait`
- `CancellationToken`, `Task.WhenAll` / `Task.WhenAny`
- `IAsyncEnumerable<T>` (async streams)

Практика:
- Асинхронная загрузка URL, параллельное выполнение и отмена

---

### Блок 06 — Дженерики (файл: `06-generics.md`)
Цель: обобщённое программирование для безопасных коллекций и API.

Темы:
- обобщённые классы и методы, `where` ограничения
- covariance/contravariance

Практика:
- `Box<T>`, `Pair<T1,T2>`, generic factories

---

### Блок 07 — Делегаты и события (файл: `07-delegates-events.md`)
Цель: понять паттерн обратных вызовов, лямбды, `Func`/`Action`.

Темы:
- делегаты, события, лямбды
- `Func<T>`, `Action<T>`, событие как безопасная обёртка

Практика:
- Простой pub/sub, подписчики с фильтрацией по уровню

---

### Блок 08 — LINQ (файл: `08-linq.md`)
Цель: декларативная работа с коллекциями, deferred execution.

Темы:
- Method vs Query syntax, `Where/Select/GroupBy/Join`
- `IEnumerable` vs `IQueryable`, deferred execution

Практика:
- Группировка и агрегация транзакций, фильтрация коллекций

---

### Блок 09 — Параллельность и TPL (файл: `09-parallel-tpl.md`)
Цель: использовать Task Parallel Library и безопасные concurrent‑коллекции.

Темы:
- `Task.Run`, `Parallel.For`, `SemaphoreSlim`, `ConcurrentQueue<T>`

Практика:
- Параллельный загрузчик с ограничением параллелизма

---

### Блок 10 — Тесты и CI (файл: `10-testing-and-ci.md`)
Цель: покрыть код unit‑тестами и настроить простую CI‑сборку.

Темы:
- xUnit, тестовые фикстуры, мокинг (Moq)
- GitHub Actions workflow для `dotnet test`

Практика:
- Тесты для `Rectangle`, `Box<T>`, тестовый pipeline в GitHub Actions

---

## Ресурсы и окружение

- Официальная документация: https://learn.microsoft.com/dotnet/
- Установите .NET SDK (LTS), используйте `dotnet` CLI: `dotnet new`, `dotnet run`, `dotnet test`
- Рекомендуемые инструменты: VS Code + C# extension или Visual Studio (Windows)

---

## Как адаптировать курс

- Каждому блоку соответствует пара файлов: `NN-topic.md` (теория) и `NN-topic-practice.md` (упражнения). Для продвинутых тем (ASP.NET, EF Core) добавлять отдельные mini‑проекты.
- Предложение: продолжить и добавить блоки 11–14 (DI/Architecture, ASP.NET Core, EF Core, Performance & Memory) если нужно — могу добавить их сейчас.

---

Если хотите, я обновлю:
- файл‑ссылки внутри README/index
- добавлю practice файлы для каждого блока
- соберу примеры проектов (template `dotnet new` + README)

