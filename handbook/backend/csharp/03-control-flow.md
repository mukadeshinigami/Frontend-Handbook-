# 03 — Управление потоком (if, switch, циклы и pattern matching)

Коротко: условные операторы, циклы, switch, pattern matching в новых версиях C#.

Примеры:

```csharp
int x = 5;
if (x > 0) Console.WriteLine("positive");

switch (x) {
  case 0: Console.WriteLine("zero"); break;
  case int n when (n > 0): Console.WriteLine("positive"); break;
}

for (int i = 0; i < 5; i++) Console.WriteLine(i);
foreach (var item in new[] {1,2,3}) Console.WriteLine(item);
```

Упражнение:
- Реализуйте функцию, которая получает число и возвращает строку с описанием (negative/zero/positive) с использованием pattern matching.
