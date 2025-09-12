/* app.js - minimal starter */

const input = document.getElementById('newTodo');
const addBtn = document.getElementById('addBtn');
const list = document.getElementById('list');

// in-memory array for todos (each todo is { id, text, completed })
let todos = [];

function render() {
    // clear list and re-build from todos
    list.innerHTML = '';
    for (const t of todos) {
        const li = document.createElement('li');
        li.textContent = t.text;
        li.dataset.id = t.id;
        list.appendChild(li);
    }
}

function addTodo(text) {
    if (!text || !text.trim()) return;
    todos.unshift({ id: Date.now().toString(), text: text.trim(), completed: false });
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
