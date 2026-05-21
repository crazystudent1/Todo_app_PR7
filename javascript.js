let todos = JSON.parse(localStorage.getItem('todos')) || [];

const listElement = document.getElementById('todo-list');
const itemCountSpan = document.getElementById('item-count');
const uncheckedCountSpan = document.getElementById('unchecked-count');
const newTodoBtn = document.getElementById('new-todo-btn');

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function newTodo() {
    const taskText = prompt('Введіть нове завдання:');
    if (taskText && taskText.trim() !== '') {
        const todo = {
            id: Date.now(),
            text: taskText,
            isChecked: false
        };
        todos.push(todo);
        saveTodos();
        render();
        updateCounter();
        console.log('Поточний масив справ:', todos);
    }
}

function renderTodo(todo) {
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

function render() {
    const htmlMarkup = todos.map(todo => renderTodo(todo)).join('');
    listElement.innerHTML = htmlMarkup;
}

function updateCounter() {
    const totalCount = todos.length;
    const uncheckedCount = todos.filter(todo => todo.isChecked === false).length;
    itemCountSpan.textContent = totalCount;
    uncheckedCountSpan.textContent = uncheckedCount;
}

window.deleteTodo = function(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    render();
    updateCounter();
}

window.checkTodo = function(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.isChecked = !todo.isChecked;
        saveTodos();
        render();
        updateCounter();
    }
}

newTodoBtn.addEventListener('click', newTodo);
render();
updateCounter();
