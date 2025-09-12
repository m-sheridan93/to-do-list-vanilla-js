/* app.js - minimal starter */

const input = document.getElementById('newTodo');
const addBtn = document.getElementById('addBtn');
const list = document.getElementById('list');

// in-memory array for todos (each todo is { id, text, completed })
let todos = [];

function render() {
    list.innerHTML = '';

    if (todos.length === 0) {
        list.innerHTML = '<li class="empty">Add a To-Do!</li>';
        return;
    }

    for (const t of todos) {
        const li = document.createElement('li');
        li.dataset.id = t.id;

        // text shown for the todo
        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = t.text;

        // delete button
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'delete';
        deleteButton.setAttribute('aria-label', 'Delete To-Do');
        deleteButton.textContent = '×';

        deleteButton.addEventListener('click', () => {
            todos = todos.filter(item => item.id !== t.id);
            render();
        });

        // append elements in the right order
        li.appendChild(span);
        li.appendChild(deleteButton);
        list.appendChild(li);
    }
}


function addTodo(text) {
    if (!text || !text.trim()) return;
    todos.unshift({id: Date.now().toString(), text: text.trim(), completed: false});
    render();
}

addBtn.addEventListener('click', () => {
    addTodo(input.value);
    input.value = '';
    input.focus();
});

// allow pressing Enter to add
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addBtn.click();
});

// initial render
render();
