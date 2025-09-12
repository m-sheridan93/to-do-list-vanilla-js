const input = document.getElementById('newTodo');
const addBtn = document.getElementById('addBtn');
const list = document.getElementById('list');

const TODO_KEY = 'todos.v1';
let todos = [];

function addToDo(text) {
    if (!text || !text.trim()) return;
    let id = Date.now();

    const item = {id, text: text.trim(), completed: false}

    todos.unshift(item);
    saveTodos();
    render();
}

function saveTodos() {
    try {
        const json = JSON.stringify(todos); // localStorage can only store strings so we convert it
        localStorage.setItem(TODO_KEY, json)
    } catch (e) {
        console.error('could not save todos', e)
    }
}

function loadTodos() {
    try {
        const raw = localStorage.getItem(TODO_KEY);
        // as localStorage only stores strings we need to convert it back to an array
        todos = raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error('could not load todos', e);
        todos = [];
    }
}

function render() {
    list.innerHTML = '';
    if (todos.length === 0) {
        const empty = document.createElement('li')
        empty.className = 'empty';
        empty.textContent = 'No todos yet - add one above';
        list.appendChild(empty); // add the above element to the list html element
        return;
    }

    for (const t of todos) {
        const li = document.createElement('li')
        li.dataset.id = t.id

        // add check box for each item
        const checkBox = document.createElement('input')
        checkBox.type = 'checkbox';
        checkBox.checked = !!t.completed;
        checkBox.setAttribute('aria-label', 'Mark To-Do');

        // add event listener to checkbox
        li.classList.toggle('completed', !!t.completed)

        checkBox.addEventListener('change', () => {
            const todo = todos.find(item => item.id === t.id);
            if (!todo) return;
            todo.completed = checkBox.checked;
            saveTodos();
            render();
        });

        // create a span to hold each todo item
        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = t.text;

        // add a delete button to each element
        const deleteButton = document.createElement('button')
        deleteButton.className = 'delete';
        deleteButton.textContent = 'x';

        deleteButton.addEventListener('click', () => {
            todos = todos.filter(item => item.id !== t.id);
            saveTodos();
            render();
        });

        // edit button and inline edit
        const editButton = document.createElement('button');
        editButton.className = 'edit';
        editButton.textContent = 'Edit';

        editButton.addEventListener('click', () => {
            // guard: don't create a second input if already editing
            if (li.querySelector('.edit-input')) return;

            const textSpan = li.querySelector('.todo-text');
            if (!textSpan) return;

            // create and show the inline input
            const inputEdit = document.createElement('input');
            inputEdit.type = 'text';
            inputEdit.className = 'edit-input';
            inputEdit.value = (textSpan.textContent || t.text || '').trim();

            textSpan.replaceWith(inputEdit);
            inputEdit.focus();
            inputEdit.select();

            // prevent double handling from blur + keydown
            let finished = false;

            // commit and cancel helpers
            function commit() {
                if (finished) return;
                const newText = inputEdit.value.trim();
                if (newText.length > 0) {
                    const todo = todos.find(item => item.id === t.id);
                    if (todo) {
                        todo.text = newText;
                        saveTodos();
                    }
                }
                finished = true;
                render();
            }

            function cancel() {
                if (finished) return;
                finished = true;
                render();
            }

            // keyboard: Enter = commit, Escape = cancel
            inputEdit.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') commit();
                if (e.key === 'Escape') cancel();
            });

            // blur = commit (unless already finished)
            inputEdit.addEventListener('blur', () => {
                if (finished) return;
                commit();
            });
        });

        li.appendChild(checkBox);
        li.appendChild(span);
        li.appendChild(editButton)
        li.appendChild(deleteButton);
        list.appendChild(li);
    }
}

function setupEventListeners() {
    addBtn.addEventListener('click', () => {
        addToDo(input.value)
        input.value = '';
        input.focus();
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addBtn.click();
    });


    inputEdit.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') commit();
        if (e.key === 'Escape') cancel();
    });
}

function init() {
    loadTodos();
    render();
    setupEventListeners();
}

init();