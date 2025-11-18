# 10 — Unit-тесты и CI

Коротко: писать тесты с xUnit, организовывать тестовую сборку, базовая интеграция с GitHub Actions.

Пример теста (xUnit):

```csharp
using Xunit;

public class MathTests {
  [Fact]
  public void Add_Works() {
    Assert.Equal(4, 2 + 2);
  }
}
```

Простейший GitHub Actions workflow:

```yaml
name: .NET
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-dotnet@v3
        with: {dotnet-version: '8.0.x'}
      - run: dotnet test --no-build
```

Упражнение:
- Напишите тесты для предыдущих уроков (класс Rectangle, Box<T> и т.д.).
