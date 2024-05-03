const taskForm = $('#task-form');
const taskTitleInput = $('#task-title');
const taskDueDate = $('#task-due-date');
const taskDescription = $('#task-description');
const todoCard = $('#todo-cards');


// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || "";


//if i have something in the local storage then clear the list, then refill the list with the info from localstorage
newTask = { taskTitleInput, taskDueDate, taskDescription };
taskCard = JSON.parse(localStorage.getItem('tasks')) || [];
taskCard.push(newTask);
localStorage.setItem('tasks', JSON.stringify(taskCard));

function generateTaskId() {
    return Math.floor(Math.random() * 9999);
}

function createTaskCard(task) {
    if(task.id === undefined){
    return;
}
    const taskCard = $('<div>')
        .addClass('card task-card draggable')
        .attr('data-task-id', task.id);
    const cardHeader = $('<div>').addClass('card-header').text(task.title);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
    taskCard.addClass('draggable');
    taskCard.draggable({
          opacity: 0.9,
          zIndex: 100,
          helper: function (e) {
            const original = $(e.target).hasClass('ui-draggable')
              ? $(e.target)
              : $(e.target).closest('.ui-draggable');
            return original.clone().css({
              width: original.outerWidth(),
            });
          },
        });
        
    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .attr('data-task-id', task.id);
    cardDeleteBtn.on('click', handleDeleteTask);

    // due dates and color changes accordingly past due: red, today due: yellow, upcoming due: white.
    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

        if (now.isSame(taskDueDate, 'day')) {
            taskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
            taskCard.addClass('bg-danger text-white');
            cardDeleteBtn.addClass('border-light');
        }
    }

    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);
    todoCard.append(taskCard);

}

function handleDrop(event, ui) {
    const tasks = readProjectsFromStorage();
    const taskId = ui.draggable[0].dataset.taskId;
    const newStatus = event.target.id;

    for (let task of tasks) {
        if (task.id === taskId) {
            console.log(task.status);
            task.status = newStatus;
         
        }
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
    printProjectData();
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    var task = {
        id: generateTaskId(),
        title: taskTitleInput.val(),
        description: taskDescription.val(),
        dueDate: taskDueDate.val(),
        status: "todo"
    }
    taskList.push(task);
    createTaskCard(task);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", task.id);
    taskTitleInput.val("");
    taskDescription.val("");
    taskDueDate.val("");
}

function handleDeleteTask() {
    var taskId = $(this).attr("data-task-id");
    console.log(taskId)
    var taskInfo = taskList.filter(element => element.id != taskId);
    taskList = taskInfo
    $(this).parent().parent().hide();
}

function readProjectsFromStorage() {
    let projects = JSON.parse(localStorage.getItem('tasks'));
    
    if (!projects) {
      projects = [];
    }
  console.log(JSON.stringify(projects));
    return projects;
  }

  
function printProjectData() {
    const tasks = readProjectsFromStorage();
    const todoList = $('#todo-cards');
    todoList.empty();
  
    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();
  
    const doneList = $('#done-cards');
    doneList.empty();

    for (let task of tasks) {
        console.log("task-"+task.status);
      if (task.status === 'to-do') {
        todoList.append(createTaskCard(task));
      } else if (task.status === 'in-progress') {
        inProgressList.append(createTaskCard(task));
      } else if (task.status === 'done') {
        doneList.append(createTaskCard(task));
      }
    }
  }

$(document).ready(function () {
    $(taskForm).on("submit", handleAddTask);
    
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
      });

});
