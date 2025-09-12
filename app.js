/*
  Small starter app skeleton.
  Implement features: add, toggle, delete, edit, persist to localStorage.
*/

const TODO_KEY = 'todos.v1';

let todos = [];

// DOM refs
const input = document.getElementById('new-todo');
const addBtn = document.getElementById('add-btn');
const todosContainer = document.getElementById('todos');
const totalEl = document.getElementById('total');
const remainingEl = document.getElementById('remaining');
const completedEl = document.getElementById('completed');

function loadTodos() {
    try {
        const raw = localStorage.getItem(TODO_KEY);
        todos = raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error('Failed to parse todos', e);
        todos = [];
    }
}

function saveTodos() {
    localStorage.setItem(TODO_KEY, JSON.stringify(todos));
}

function render() {
    // simple full re-render for now
    todosContainer.innerHTML = '';
    todos.forEach(todo => {
        const item = document.createElement('div');
        item.className = 'todo-item' + (todo.completed ? ' completed' : '');
        item.dataset.id = todo.id;

        item.innerHTML = `
      <input type="checkbox" class="toggle" ${todo.completed ? 'checked' : ''} />
      <div class="text">${escapeHtml(todo.text)}</div>
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
    `;
        todosContainer.appendChild(item);
    });

    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const remaining = total - completed;
    totalEl.textContent = `Total: ${total}`;
    completedEl.textContent = `Completed: ${completed}`;
    remainingEl.textContent = `Remaining: ${remaining}`;
}

function escapeHtml(s) {
    return (s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function addTodo(text) {
    if (!text || !text.trim()) return;
    const todo = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false,
        createdAt: Date.now()
    };
    todos.unshift(todo);
    saveTodos();
    render();
}

function setupEventListeners() {
    addBtn.addEventListener('click', () => {
        addTodo(input.value);
        input.value = '';
        input.focus();
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addBtn.click();
        }
    });

    // event delegation for toggle/delete/edit
    todosContainer.addEventListener('click', (e) => {
        const item = e.target.closest('.todo-item');
        if (!item) return;
        const id = item.dataset.id;
        if (e.target.classList.contains('delete')) {
            todos = todos.filter(t => t.id !== id);
            saveTodos();
            render();
            return;
        }
        if (e.target.classList.contains('edit')) {
            // implement inline editing: replace text with input, save on Enter or blur
            const textEl = item.querySelector('.text');
            const current = todos.find(t => t.id === id);
            const inputEl = document.createElement('input');
            inputEl.value = current.text;
            inputEl.className = 'edit-input';
            textEl.replaceWith(inputEl);
            inputEl.focus();
            const commit = () => {
                current.text = inputEl.value.trim() || current.text;
                saveTodos();
                render();
            };
            inputEl.addEventListener('keydown', (ev) => {
                if (ev.key === 'Enter') commit();
                if (ev.key === 'Escape') render();
            });
            inputEl.addEventListener('blur', commit);
            return;
        }
        if (e.target.classList.contains('toggle')) {
            const todo = todos.find(t => t.id === id);
            todo.completed = e.target.checked;
            saveTodos();
            render();
            return;
        }
    });
}

function init() {
    loadTodos();
    render();
    setupEventListeners();
}

init();
