// Array to store todo items
let todoList = [];

// Object to store active filter preferences
let activeFilters = {
    status: 'all',
    date: 'all'
};

// Add click event listener to filter button
document.getElementById('filter-button').addEventListener('click', openFilterModal);

// Function to validate form inputs before adding new todo
function validateForm() {
    const todoInput = document.getElementById('todo-input').value.trim();
    const dateInput = document.getElementById('date-input').value;

    // Check if inputs are empty
    if (todoInput === '' || dateInput === '') {
        alert('Please enter a todo item and a due date.');
    } else {
        // Add the todo item to the list
        addTodo(todoInput, dateInput);
        // Clear the input fields
        document.getElementById('todo-input').value = '';
        document.getElementById('date-input').value = '';
    }
}

// Function to add new todo to the list
function addTodo(todo, date) {
    // Format date as mm/dd/yyyy
    const formattedDate = formatDate(date);
    
    // Create a todo item object
    const todoItem = {
        task: todo,
        date: formattedDate,
        status: 'Pending',
        id: Date.now() // Unique ID for each todo
    };

    // Add the todo item to the todoList array
    todoList.push(todoItem);
    // Display the updated todo list
    displayTodos();
}

// Function to format date string
function formatDate(dateString) {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

// Function to display todos (with filters applied)
function displayTodos() {
    const todoItemsElement = document.getElementById('todo-items');
    const noTasksElement = document.getElementById('no-tasks');

    todoItemsElement.innerHTML = ''; // Clear the list before displaying

    if (todoList.length === 0) {
        noTasksElement.style.display = 'block';
        return;
    }

    noTasksElement.style.display = 'none';

    // Loop through the todoList array and create table rows
    todoList.forEach((item) => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `
            <td class="border p-2">${item.task}</td>
            <td class="border p-2">${item.date}</td>
            <td class="border p-2">
                <span class="px-2 py-1 rounded ${item.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                    ${item.status}
                </span>
            </td>
            <td class="border p-2">
                <button onclick="toggleStatus(${item.id})" class="bg-blue-500 text-white p-1 px-2 rounded mr-2">Toggle</button>
                <button onclick="deleteTodo(${item.id})" class="bg-red-500 text-white p-1 px-2 rounded">Delete</button>
            </td>
        `;
        todoItemsElement.appendChild(row);
    });
}

// Function to filter todos based on active filters
function filterTodos() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day
    
    return todoList.filter(todo => {
        // Check status filter
        const statusMatch = activeFilters.status === 'all' || 
                           todo.status === activeFilters.status;
        
        // Check date filter
        let dateMatch = true;
        if (activeFilters.date !== 'all') {
            const todoDate = new Date(todo.date);
            todoDate.setHours(0, 0, 0, 0); // Set to start of day
            
            if (activeFilters.date === 'today') {
                dateMatch = todoDate.getTime() === today.getTime();
            } else if (activeFilters.date === 'upcoming') {
                dateMatch = todoDate > today;
            } else if (activeFilters.date === 'past') {
                dateMatch = todoDate < today;
            }
        }
        
        return statusMatch && dateMatch;
    });
}

// Function to toggle todo status between Pending/Completed
function toggleStatus(id) {
    const todo = todoList.find(item => item.id === id);
    if (todo) {
        todo.status = todo.status === 'Pending' ? 'Completed' : 'Pending';
        displayTodos();
    }
}

// Function to delete specific todo
function deleteTodo(id) {
    todoList = todoList.filter(item => item.id !== id);
    displayTodos();
}

// Function to clear all todos
function clearTodos() {
    if (confirm('Are you sure you want to delete all tasks?')) {
        todoList = [];
        displayTodos();
    }
}

// Function to open filter modal
function openFilterModal() {
    document.getElementById('filter-modal').classList.remove('hidden');
    // Set dropdown values to current active filters
    document.getElementById('status-filter').value = activeFilters.status;
    document.getElementById('date-filter').value = activeFilters.date;
}

// Function to close filter modal
function closeFilterModal() {
    document.getElementById('filter-modal').classList.add('hidden');
}

// Function to apply selected filters
function applyFilters() {
    // Get selected filter values
    activeFilters.status = document.getElementById('status-filter').value;
    activeFilters.date = document.getElementById('date-filter').value;
    
    // Close modal and refresh display
    closeFilterModal();
    displayTodos();
}

function displayTodos() {
    const todoItemsElement = document.getElementById('todo-items');
    const noTasksElement = document.getElementById('no-tasks');

    todoItemsElement.innerHTML = '';
    
    const filteredTodos = filterTodos();
    
    if (filteredTodos.length === 0) {
        noTasksElement.style.display = 'block';
    } else {
        noTasksElement.style.display = 'none';
        filteredTodos.forEach((item) => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            row.innerHTML = `
                <td class="border p-2">${item.task}</td>
                <td class="border p-2">${item.date}</td>
                <td class="border p-2">
                    <span class="px-2 py-1 rounded ${item.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                        ${item.status}
                    </span>
                </td>
                <td class="border p-2">
                    <button onclick="toggleStatus(${item.id})" class="bg-blue-500 text-white p-1 px-2 rounded mr-2">Toggle</button>
                    <button onclick="deleteTodo(${item.id})" class="bg-red-500 text-white p-1 px-2 rounded">Delete</button>
                </td>
            `;
            todoItemsElement.appendChild(row);
        });
    }
}

// Initialize display
displayTodos();