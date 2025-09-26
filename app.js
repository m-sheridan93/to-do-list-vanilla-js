const input    = document.querySelector('.new-todo');
const addBtn   = document.querySelector('.add-btn');
const listEl   = document.querySelector('.list');
const TODO_KEY = 'todos.v1';
let todos = [];

function saveTodos() {
    try {
        localStorage.setItem(TODO_KEY, JSON.stringify(todos));
    } catch (e) {
        console.error('could not save todos', e);
    }
}

function loadTodos() {
    try {
        const raw = localStorage.getItem(TODO_KEY);
        todos = raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error('could not load todos', e);
        todos = [];
    }
}

// ----- Renders entire list -----
function render() {
    listEl.innerHTML = '';
    if (todos.length === 0) {
        const empty = document.createElement('li');
        empty.className = 'empty';
        empty.textContent = 'No todos yet - add one above';
        listEl.appendChild(empty);
        return;
    }

    for (const t of todos) {
        const li = document.createElement('li');
        li.dataset.id = t.id;
        li.classList.toggle('completed', !!t.completed);

        // Checkbox
        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.checked = !!t.completed;
        checkBox.setAttribute('aria-label', 'Mark To-Do as complete');
        checkBox.addEventListener('change', () => {
            t.completed = checkBox.checked;
            saveTodos();
            render();
        });

        // Todo Text or edit input
        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = t.text;

        // Edit Button
        const editButton = document.createElement('button');
        editButton.className = 'edit';
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            if (li.querySelector('.edit-input')) return; // Already editing

            const inputEdit = document.createElement('input');
            inputEdit.type = 'text';
            inputEdit.className = 'edit-input';
            inputEdit.value = t.text;
            span.replaceWith(inputEdit);
            inputEdit.focus();
            inputEdit.select();

            let finished = false;
            function commitEdit() {
                if (finished) return;
                const val = inputEdit.value.trim();
                if (val) {
                    t.text = val;
                    saveTodos();
                }
                finished = true;
                render();
            }
            function cancelEdit() {
                if (finished) return;
                finished = true;
                render();
            }
            inputEdit.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') commitEdit();
                else if (e.key === 'Escape') cancelEdit();
            });
            inputEdit.addEventListener('blur', commitEdit);
        });

        // Delete Button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete';
        deleteButton.textContent = 'x';
        deleteButton.addEventListener('click', () => {
            todos = todos.filter(item => item.id !== t.id);
            saveTodos();
            render();
        });

        li.append(checkBox, span, editButton, deleteButton);
        listEl.appendChild(li);
    }
}

// ----- Add -----
function addToDo(text) {
    const val = text && text.trim();
    if (!val) return;
    const item = { id: Date.now(), text: val, completed: false };
    todos.unshift(item);
    saveTodos();
    render();
}

// ----- Event Listeners -----
addBtn.addEventListener('click', () => {
    addToDo(input.value);
    input.value = '';
    input.focus();
});

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addBtn.click();
});

// ----- Initialization -----
loadTodos();
render();
