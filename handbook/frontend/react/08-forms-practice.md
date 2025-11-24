# Практика — Блок 8: Forms

Задачи:
- Форма регистрации с валидацией (имя, email, пароль).
- Динамическая форма: добавление дополнительных полей.
- File upload элемент и предварительный просмотр файлов.
- Использование React Hook Form для упрощения валидации.

Шаги выполнения (пример формы):

1. Создайте controlled форму (имя, email, пароль). Проверьте поля на пустоту и корректность email.

2. Добавьте динамическое поле (например, дополнительный телефон), которое можно добавлять/удалять.

3. Для file upload создайте предпросмотр (FileReader) и отобразите превью картинки до загрузки.

4. Опционально: перепишите форму с использованием React Hook Form для сравнения удобства.

Пример простого превью файла:

```jsx
function ImagePreview() {
  const [src, setSrc] = React.useState(null);
  const handle = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setSrc(reader.result);
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <input type="file" onChange={handle} />
      {src && <img src={src} alt="preview" style={{ width: 200 }} />}
    </div>
  );
}
```
