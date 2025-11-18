# 09 — Параллельность и TPL

Коротко: Task Parallel Library, Parallel.For/ForEach, Concurrent коллекции, синхронизация.

Пример Parallel:

```csharp
using System.Threading.Tasks;

Parallel.For(0, 100, i => {
  // параллельная работа
  Console.WriteLine(i);
});
```

Task.Run vs long-running Task, использование `ConcurrentQueue<T>` и `SemaphoreSlim` для ограничения параллелизма.

Упражнение:
- Напишите параллельный загрузчик файлов с ограничением одновременных загрузок (SemaphoreSlim).
