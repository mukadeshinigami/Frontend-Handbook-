# 04 — Классы, структуры и ООП

Коротко: классы, свойства, методы, конструкторы, наследование, интерфейсы, структуры.

Пример:

```csharp
public class Person {
  public string Name { get; set; }
  public int Age { get; }

  public Person(string name, int age) {
    Name = name;
    Age = age;
  }

  public void Deconstruct(out string name, out int age) {
    name = Name; age = Age;
  }
}

public interface IGreet {
  void Greet();
}
```

Упражнение:
- Создайте класс `Rectangle` с полями `Width`/`Height` и методом `Area()`.
