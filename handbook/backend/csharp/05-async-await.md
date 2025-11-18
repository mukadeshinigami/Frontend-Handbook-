# 05 — Асинхронность: Task, async/await и отмена

Коротко: `Task`, `Task<T>`, async/await, `ConfigureAwait`, `CancellationToken`, `I/O`.

Пример простого async:

```csharp
using System.Net.Http;

async Task<string> FetchAsync(string url) {
  using var http = new HttpClient();
  var res = await http.GetAsync(url);
  res.EnsureSuccessStatusCode();
  return await res.Content.ReadAsStringAsync();
}
```

Отмена через CancellationToken:

```csharp
async Task<string> FetchWithCancellation(string url, CancellationToken ct) {
  using var http = new HttpClient();
  var res = await http.GetAsync(url, ct);
  return await res.Content.ReadAsStringAsync(ct);
}
```

Параллельное выполнение задач:

```csharp
var t1 = FetchAsync("/a");
var t2 = FetchAsync("/b");
await Task.WhenAll(t1, t2);
var a = await t1; var b = await t2;
```

Упражнение:
- Напишите метод, который получает массив URL и загружает их параллельно, возвращая первые N успешных ответов.
