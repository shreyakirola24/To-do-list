document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const currentDate = document.getElementById('currentDate');
    const currentTime = document.getElementById('currentTime');
    const sparkles = document.getElementById('sparkles');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let startTime = new Date();

    // Function to display the current date and time
    const updateDateTime = () => {
        const now = new Date();
        currentDate.textContent = `Date: ${now.toDateString()}`;
        currentTime.textContent = `Time: ${now.toLocaleTimeString()}`;
    };

    setInterval(updateDateTime, 1000);

    // Function to calculate elapsed time
    const calculateElapsedTime = (startTime) => {
        const elapsed = Math.floor((new Date() - startTime) / 1000);
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    // Function to render tasks
    const renderTasks = () => {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';
            const elapsedTime = task.completed ? calculateElapsedTime(startTime) : calculateElapsedTime(startTime);
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
                <span>${task.text}</span>
                <span>Time: ${elapsedTime}</span>
                <button class="edit" data-id="${task.id}">Edit</button>
                <button class="delete" data-id="${task.id}">Delete</button>
            `;
            taskList.appendChild(li);
        });

        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', toggleTaskCompletion);
        });
        document.querySelectorAll('.edit').forEach(button => {
            button.addEventListener('click', editTask);
        });
        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', deleteTask);
        });

        if (tasks.every(task => task.completed) && tasks.length > 0) {
            showFireworks();
            alert(`Great! You have completed all tasks in ${calculateElapsedTime(startTime)}`);
        }
    };

    // Function to add a new task
    const addTask = (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText) {
            const newTask = {
                id: Date.now(),
                text: taskText,
                completed: false
            };
            tasks.push(newTask);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            taskInput.value = '';
            renderTasks();
        }
    };

    // Function to toggle task completion
    const toggleTaskCompletion = (e) => {
        const taskId = parseInt(e.target.getAttribute('data-id'));
        const task = tasks.find(task => task.id === taskId);
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    // Function to edit a task
    const editTask = (e) => {
        const taskId = parseInt(e.target.getAttribute('data-id'));
        const task = tasks.find(task => task.id === taskId);
        const newTaskText = prompt('Edit task:', task.text);
        if (newTaskText !== null) {
            task.text = newTaskText.trim();
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        }
    };

    // Function to delete a task
    const deleteTask = (e) => {
        const taskId = parseInt(e.target.getAttribute('data-id'));
        tasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    // Function to show fireworks when all tasks are completed
    const showFireworks = () => {
        for (let i = 0; i < 100; i++) {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = `${Math.random() * 100}vw`;
            firework.style.top = `${Math.random() * 100}vh`;
            firework.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            sparkles.appendChild(firework);
            setTimeout(() => {
                sparkles.removeChild(firework);
            }, 10000);
        }
        sparkles.style.display = 'block';
        setTimeout(() => {
            sparkles.style.display = 'none';
        }, 10000);
    };

    // Event listeners
    form.addEventListener('submit', addTask);

    // Initial rendering of tasks
    renderTasks();
});
