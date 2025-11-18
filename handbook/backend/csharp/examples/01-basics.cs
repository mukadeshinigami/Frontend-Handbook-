// Простой пример для урока 01 — basics
using System;

class Program {
  static void Main(string[] args) {
    var name = args.Length > 0 ? args[0] : "World";
    Console.WriteLine($"Hello, {name}!");
  }
}
