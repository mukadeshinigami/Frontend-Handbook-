# 06 — Дженерики (Generics)

Коротко: обобщённые типы для безопасности типов и переиспользования кода.

Пример обобщённого класса:

```csharp
public class Box<T> {
  public T Value { get; }
  public Box(T value) => Value = value;
}

var intBox = new Box<int>(5);
```

Ограничения (where):

```csharp
public T CreateInstance<T>() where T : new() {
  return new T();
}
```

Covariance/Contravariance: `IEnumerable<out T>`, `Action<in T>` — полезно для интерфейсов и делегатов.

Упражнение:
- Реализуйте обобщённую структуру `Pair<T1,T2>` с удобным `Deconstruct`.
