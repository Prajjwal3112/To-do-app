function addTask() {
    let taskTitleInput = document.getElementById('task-title');
    let taskDescInput = document.getElementById('task-desc');
    let taskDueDateInput = document.getElementById('task-due-date');
    let taskTitle = taskTitleInput.value;
    let taskDesc = taskDescInput.value;
    let taskDueDate = taskDueDateInput.value;

    if (taskTitle === '') return;

    let task = document.createElement('div');
    task.className = 'task';
    task.draggable = true;
    task.ondragstart = drag;
    task.id = 'task-' + Date.now(); // Unique ID

    let taskContent = document.createElement('div');
    let taskTitleElem = document.createElement('strong');
    taskTitleElem.innerText = taskTitle;
    taskContent.appendChild(taskTitleElem);

    if (taskDesc !== '') {
        let taskDescElem = document.createElement('p');
        taskDescElem.innerText = taskDesc;
        taskContent.appendChild(taskDescElem);
    }

    if (taskDueDate !== '') {
        let taskDueDateElem = document.createElement('p');
        taskDueDateElem.innerText = `Due: ${taskDueDate}`;
        taskDueDateElem.className = 'task-due-date';
        taskContent.appendChild(taskDueDateElem);
        checkDueDate(task, taskDueDate);
    }

    let startButton = document.createElement('button');
    startButton.innerText = 'Start';
    startButton.onclick = () => moveToInProgress(task);

    task.appendChild(taskContent);
    task.appendChild(startButton);

    document.getElementById('pending').appendChild(task);
    taskTitleInput.value = '';
    taskDescInput.value = '';
    taskDueDateInput.value = '';
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData('text', event.target.id);
}

function drop(event) {
    event.preventDefault();
    let data = event.dataTransfer.getData('text');
    let task = document.getElementById(data);
    if (event.target.className.includes('section')) {
        event.target.appendChild(task);
    } else if (event.target.parentElement.className.includes('section')) {
        event.target.parentElement.appendChild(task);
    }
    if (event.target.id === 'completed') {
        moveToCompleted(task);
    } else {
        updateTaskButton(task, event.target.id);
    }
}


function updateTaskButton(task, sectionId) {
    let button = task.querySelector('button');
    if (sectionId === 'in-progress') {
        button.innerText = 'Complete';
        button.onclick = () => moveToCompleted(task);
    } else if (sectionId === 'completed') {
        button.remove();
        let timestamp = document.createElement('div');
        timestamp.className = 'timestamp';
        let now = new Date();
        let formattedDate = now.toLocaleDateString('en-GB') + ', ' + now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        timestamp.innerText = formattedDate;
        task.appendChild(timestamp);
    } else {
        button.innerText = 'Start';
        button.onclick = () => moveToInProgress(task);
    }
}

function moveToInProgress(task) {
    document.getElementById('in-progress').appendChild(task);
    updateTaskButton(task, 'in-progress');
}

function moveToCompleted(task) {
    let now = new Date();
    let dueDate = new Date(task.querySelector('.task-due-date').innerText.split(' ')[1]); // Extract due date from the task
    if (now <= dueDate) {
        alert(`You completed the task before time! Great job!`);
    } else {
        alert(`You completed the task late! Procrastination is never a good habit, but at least you completed it.`);
    }
    document.getElementById('completed').appendChild(task);
    updateTaskButton(task, 'completed');
}


function checkDueDate(task, dueDate) {
    let now = new Date();
    let dueDateTime = new Date(dueDate).getTime();
    let timeDiff = dueDateTime - now.getTime();

    if (timeDiff <= 0) {
        alert(`Task "${task.querySelector('strong').innerText}" is due now or overdue!`);
    } else {
        setTimeout(() => {
            alert(`Task "${task.querySelector('strong').innerText}" is due now!`);
        }, timeDiff);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    let taskContainers = document.querySelectorAll('.section');
    taskContainers.forEach(container => {
        container.addEventListener('dragover', allowDrop);
        container.addEventListener('drop', drop);
    });

    let tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        task.addEventListener('dragstart', drag);
    });
});
