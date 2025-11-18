# 08 — LINQ (Language Integrated Query)

Коротко: декларативные запросы к коллекциям, отложенное выполнение, операторы Select/Where/GroupBy/Join.

Пример:

```csharp
var people = new[] {
  new { Name = "A", Age = 30 },
  new { Name = "B", Age = 20 }
};

var adults = people.Where(p => p.Age >= 21).OrderBy(p => p.Name).Select(p => p.Name);
foreach (var name in adults) Console.WriteLine(name);
```

Особенности:
- IQueryable vs IEnumerable
- Отложенное выполнение и побочные эффекты

Упражнение:
- Используя LINQ, сгруппируйте список транзакций по категории и подсчитайте сумму по каждой.
