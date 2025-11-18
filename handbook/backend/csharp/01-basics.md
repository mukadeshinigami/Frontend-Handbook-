# 01 — Основы C#

Коротко: синтаксис, структура программ, `dotnet` CLI, `Main`, типы, вывод в консоль.

Пример:

```csharp
using System;

class Program {
  static void Main(string[] args) {
    Console.WriteLine("Hello, C# World!");
  }
}
```

Ключевые темы:
- `dotnet new console`
- `dotnet run`, `dotnet build`
- переменные (var vs explicit), типы: int, double, string, bool
- string interpolation: `$"Hello {name}"`

Коротое упражнение:
- Создайте программу, которая читает имя из аргументов и выводит приветствие.
