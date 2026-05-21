// Крок 2. Визначаємо структуру збереження справ (масив об'єктів).
// Завдання 3. Одразу намагаємося завантажити дані з LocalStorage при старті.
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Отримуємо посилання на елементи DOM
const listElement = document.getElementById('todo-list');
const itemCountSpan = document.getElementById('item-count');
const uncheckedCountSpan = document.getElementById('unchecked-count');
const newTodoBtn = document.getElementById('new-todo-btn');

// Завдання 3: Функція для збереження даних
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Крок 3. Запит на введення та збереження нового завдання
function newTodo() {
    const taskText = prompt('Введіть нове завдання:');
    
    // Перевіряємо, чи користувач щось ввів і чи не натиснув "Скасувати"
    if (taskText && taskText.trim() !== '') {
        const todo = {
            id: Date.now(), // Унікальний ідентифікатор
            text: taskText,
            isChecked: false
        };
        
        todos.push(todo); // Додаємо в масив
        saveTodos();      // Зберігаємо в LocalStorage
        render();         // Перемальовуємо список
        updateCounter();  // Оновлюємо лічильники
        
        console.log('Поточний масив справ:', todos); // Перевірка за завданням
    }
}

// Крок 4. Створення розмітки для однієї справи за допомогою шаблонних рядків
function renderTodo(todo) {
    // Якщо справа зроблена, додаємо клас 'done' для закреслення тексту
    const textClass = todo.isChecked ? 'done' : '';
    const checkedAttr = todo.isChecked ? 'checked' : '';

    return `
        <li class="todo-item">
            <label>
                <input type="checkbox" onchange="checkTodo(${todo.id})" ${checkedAttr}>
                <span class="${textClass}">${todo.text}</span>
            </label>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">Видалити</button>
        </li>
    `;
}

// Крок 5. Рендер всього списку справ
function render() {
    // Перетворюємо масив об'єктів на масив рядків HTML і з'єднуємо їх
    const htmlMarkup = todos.map(todo => renderTodo(todo)).join('');
    // Додаємо в DOM
    listElement.innerHTML = htmlMarkup;
}

// Крок 6. Оновлення лічильників
function updateCounter() {
    // Загальна кількість справ — це довжина масиву
    const totalCount = todos.length;
    
    // Кількість незроблених — фільтруємо масив (де isChecked === false)
    const uncheckedCount = todos.filter(todo => todo.isChecked === false).length;
    
    // Оновлюємо текст на сторінці
    itemCountSpan.textContent = totalCount;
    uncheckedCountSpan.textContent = uncheckedCount;
}

// Крок 7. Видалення справи
// Використовуємо window., щоб функція була доступна для inline-обробника onclick
window.deleteTodo = function(id) {
    // Відфільтровуємо масив, залишаючи всі елементи, КРІМ того, що має переданий id
    todos = todos.filter(todo => todo.id !== id);
    
    saveTodos();     // Зберігаємо зміни
    render();        // Перемальовуємо
    updateCounter(); // Оновлюємо лічильники
}

// Крок 8. Відмітка справи (зроблено/незроблено)
window.checkTodo = function(id) {
    // Знаходимо справу за id
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        // Змінюємо стан на протилежний
        todo.isChecked = !todo.isChecked;
        
        saveTodos();
        render();
        updateCounter();
    }
}

// Ініціалізація додатку при завантаженні сторінки
newTodoBtn.addEventListener('click', newTodo);

// Одразу рендеримо дані (якщо вони були завантажені з LocalStorage)
render();
updateCounter();