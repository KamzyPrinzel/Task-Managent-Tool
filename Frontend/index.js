document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    if (localStorage.getItem('loggedInUser')) {
        showApp();
        loadTasks();
    } else {
        showAuth();
    }
}

// Authentication
function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

function register() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    if (!username || !password) {
        alert('Username and password are required.');
        return;
    }

    if (localStorage.getItem(username)) {
        alert('Username already exists.');
        return;
    }

    localStorage.setItem(username, JSON.stringify({ username, password }));
    alert('Registration successful! You can now log in.');
    showLoginForm();
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    login(); // Call the login function
});    

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const userData = JSON.parse(localStorage.getItem(username));

    if (!userData || userData.password !== password) {
        alert('Invalid username or password.');
        return;
    }

    localStorage.setItem('loggedInUser', username);
    window.location.href = "index.htm";
    showApp();
    loadTasks();
}

function logout() {
    localStorage.removeItem('loggedInUser');
    document.getElementById('userDisplay').textContent = '';
    document.getElementById('tasks').innerHTML = '';
    showAuth();
}

function showApp() {
    const username = localStorage.getItem('loggedInUser');
    document.getElementById('userDisplay').textContent = username;
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('appContainer').style.display = 'block';
}

function showAuth() {
    document.getElementById('authContainer').style.display = 'block';
    document.getElementById('appContainer').style.display = 'none';
}

// Task Management
function addTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const deadline = document.getElementById('taskDeadline').value;
    const priority = document.getElementById('taskPriority').value;

    if (!title) {
        alert("Task title is required.");
        return;
    }

    const task = {
        id: Date.now(),
        title,
        description,
        deadline,
        priority,
        status: 'To-do',
        user: localStorage.getItem('loggedInUser')
    };

    saveTask(task);
    displayTask(task);
    clearTaskForm();
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const username = localStorage.getItem('loggedInUser');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.filter(task => task.user === username).forEach(displayTask);
    checkDeadlines(tasks);
}

function displayTask(task) {
    const taskList = document.getElementById('tasks');

    const li = document.createElement('li');
    li.className = 'task-item';
    li.setAttribute('data-id', task.id);

    li.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p><strong>Deadline:</strong> ${task.deadline || 'No deadline'}</p>
        <p><strong>Priority:</strong> ${task.priority}</p>
        <div class="task-status">
            <span>Status: ${task.status}</span>
            <button class='btn' onclick="updateStatus(${task.id}, 'In-progress')">In Progress</button>
            <button class='btn' onclick="updateStatus(${task.id}, 'Done')">Done</button>
        </div>
    `;

    taskList.appendChild(li);
}

function updateStatus(id, newStatus) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.status = newStatus;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));

    document.getElementById('tasks').innerHTML = '';
    loadTasks();
}

// Check for Deadlines
function checkDeadlines(tasks) {
    const now = new Date();
    tasks.forEach(task => {
        const deadline = new Date(task.deadline);
        const timeDiff = (deadline - now) / (1000 * 60 * 60 * 24);
        
        if (timeDiff < 1 && timeDiff > 0 && task.status !== 'Done') {
            alert(`Reminder: Task "${task.title}" is due soon!`);
        }
    });
}

// Utility
function clearTaskForm() {
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskDeadline').value = '';
    document.getElementById('taskPriority').value = 'Low';
}
