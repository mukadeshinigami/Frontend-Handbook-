# 07 — Делегаты, события и лямбды

Коротко: делегаты — типизированные ссылки на методы; события — безопасная обёртка над делегатами.

Пример делегата и события:

```csharp
public delegate void SimpleHandler(string msg);

public class Publisher {
  public event SimpleHandler? OnMessage;

  public void Send(string m) => OnMessage?.Invoke(m);
}

var pub = new Publisher();
pub.OnMessage += msg => Console.WriteLine("Got: " + msg);
pub.Send("Hello");
```

Лямбды и Func/Action:

```csharp
Func<int,int> sq = x => x*x;
Action<string> log = s => Console.WriteLine(s);
```

Упражнение:
- Создайте простой event-driven logger и несколько подписчиков, фильтрующих по уровню.
