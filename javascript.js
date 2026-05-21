
const FIREBASE_URL = "https://lab7-todo-b34f8-default-rtdb.europe-west1.firebasedatabase.app/todos";

let todos = [];

const listElement = document.getElementById('todo-list');
const itemCountSpan = document.getElementById('item-count');
const uncheckedCountSpan = document.getElementById('unchecked-count');
const newTodoBtn = document.getElementById('new-todo-btn');
const errorEl = document.getElementById('error-message');
const loadingEl = document.getElementById('loading-indicator');

function setLoading(isLoading) {
    loadingEl.style.display = isLoading ? 'block' : 'none';
}

function setError(message) {
    errorEl.textContent = message;
    errorEl.style.display = message ? 'block' : 'none';
}

async function fetchTodos() {
    setLoading(true);
    setError('');
    
    try {
        const response = await fetch(`${FIREBASE_URL}.json`);
        if (!response.ok) throw new Error("Не вдалося завантажити дані з БД");
        
        const data = await response.json();
        
        if (data) {
            todos = Object.keys(data).map(key => {
                return { id: key, ...data[key] };
            });
        } else {
            todos = [];
        }
        
        render();
        updateCounter();
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
}

async function addTodo(taskText) {
    const newTodo = {
        text: taskText,
        isChecked: false
    };

    setLoading(true);
    setError('');

    try {
        const response = await fetch(`${FIREBASE_URL}.json`, {
            method: 'POST',
            body: JSON.stringify(newTodo),
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) throw new Error("Помилка при збереженні в БД");
        
        const data = await response.json();
        
        newTodo.id = data.name;
        todos.push(newTodo);
        
        render();
        updateCounter();
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
}

function newTodo() {
    const taskText = prompt('Введіть нове завдання:');
    if (taskText && taskText.trim() !== '') {
        addTodo(taskText);
    }
}

window.deleteTodo = async function(id) {
    setLoading(true);
    setError('');

    try {
        const response = await fetch(`${FIREBASE_URL}/${id}.json`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error("Помилка при видаленні з БД");

        todos = todos.filter(todo => todo.id !== id);
        render();
        updateCounter();
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
}

window.checkTodo = async function(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const newStatus = !todo.isChecked;
    setLoading(true);
    setError('');

    try {
        const response = await fetch(`${FIREBASE_URL}/${id}.json`, {
            method: 'PATCH',
            body: JSON.stringify({ isChecked: newStatus }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error("Помилка при оновленні в БД");

        todo.isChecked = newStatus;
        render();
        updateCounter();
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
}

function renderTodo(todo) {
    const textClass = todo.isChecked ? 'done' : '';
    const checkedAttr = todo.isChecked ? 'checked' : '';

    return `
        <li class="todo-item">
            <label>
                <input type="checkbox" onchange="checkTodo('${todo.id}')" ${checkedAttr}>
                <span class="${textClass}">${todo.text}</span>
            </label>
            <button class="delete-btn" onclick="deleteTodo('${todo.id}')">Видалити</button>
        </li>
    `;
}

function render() {
    listElement.innerHTML = todos.map(todo => renderTodo(todo)).join('');
}

function updateCounter() {
    itemCountSpan.textContent = todos.length;
    uncheckedCountSpan.textContent = todos.filter(todo => !todo.isChecked).length;
}

newTodoBtn.addEventListener('click', newTodo);
fetchTodos();
