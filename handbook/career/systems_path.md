# Путь «Линукса Торвальдса»: Системное программирование

> [!TIP]
> Линус Торвальдс изменил мир двумя инструментами: ядром Linux и Git. Этот путь — для тех, кто хочет работать на уровне «железа» и системной архитектуры.

## 1. Фундамент (The Core)
*Где ты находишься сейчас.*

- [x] **C: Быстрый старт** — основы управления памятью, указатели, структуры.
- [ ] [**Data Structures in C**](file:///home/mukadeshinigami/Code/Road-to/handbook/backend/c/CBook/C_Systems_Deep_Dive.md#модуль-1-связные-списки-linked-lists) — реализация связанных списков, хеш-таблиц и деревьев вручную.
- [ ] [**Standard C Library**](file:///home/mukadeshinigami/Code/Road-to/handbook/backend/c/CBook/C_Systems_Deep_Dive.md#модуль-2-управление-процессами-syscalls--fork) — глубокое понимание `libc` и системных вызовов (syscalls).

## 2. Современные системы (The Modern Era)
*Переход на Rust для безопасности памяти.*

- [ ] **Rust Book** — владение концепциями Ownership и Borrowing.
- [ ] **Rust for Systems** — работа с `unsafe`, интеграция с C (FFI).
- [ ] **NAPI-RS** — написание высокопроизводительных модулей для Node.js на Rust.

## 3. Операционные системы (The OS League)
*По стопам Линуса.*

- [ ] **Kernel Development** — написание модулей ядра Linux (LKM).
- [ ] **Architecture** — изучение x86/ARM Assembly, прерывания, планировщики.
- [ ] **Filesystems** — как данные реально хранятся на диске.

## 4. Главная практика: GitFlow Dashboard
*Проект-мост между системным С и современным Web.*

- [ ] **Phase 1: C-Daemon** — работа с сетями, GitHub API (libcurl), кеш в Shared Memory.
- [ ] **Phase 2: TUI Client** — интерфейс в терминале на Ncurses.
- [ ] **Phase 3: Web Dashboard** — React + TS, взаимодействие с C-демоном через сокеты.
- [ ] **Phase 4: IPC & Parallelism** — потоки (pthreads) и межпроцессное взаимодействие.

## 5. Open Source & Git

---

### Твой текущий статус: **Level 1 (Novice C Developer)**
*Следующий шаг:* Реализация структур данных на C или переход к основам Rust для системных задач.
