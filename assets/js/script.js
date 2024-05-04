const taskForm = $('#task-form');
const taskTitleInput = $('#task-title');
const taskDueDate = $('#task-due-date');
const taskDescription = $('#task-description');
const todoCard = $('#todo-cards');


// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || "";


//if i have something in the local storage then clear the list, then refill the list with the info from localstorage
let newTask = { taskTitleInput, taskDueDate, taskDescription, id: generateTaskId() };// might o be needed
let taskCardToBe = JSON.parse(localStorage.getItem('tasks')) || [];
taskCardToBe.push(newTask);
localStorage.setItem('tasks', JSON.stringify(taskCardToBe));

function generateTaskId() {
    return Math.floor(Math.random() * 9999);
}

function createTaskCard(task) {
    if(task.id === undefined){
    return;
}
    let taskCard = $('<div>')
        .addClass('card task-card draggable')
        .attr('data-task-id', task.id);
    let cardHeader = $('<div>').addClass('card-header').text(task.title);
    let cardBody = $('<div>').addClass('card-body');
    let cardDescription = $('<p>').addClass('card-text').text(task.description);
    let cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
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
    return taskCard;

}


function handleDrop(event, ui) {
    let tasks = readProjectsFromStorage();
    let taskId = ui.draggable[0].dataset.taskId;
    let newStatus = event.target.id;
    console.log(newStatus)
    for (let task of tasks) {
        if (task.id.toString() === taskId) {
            console.log(task.status);
            task.status = newStatus;
          console.log(task.status)
        }
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
    printProjectData();
}

// function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    var task = {
        id: generateTaskId(),
        title: taskTitleInput.val(),
        description: taskDescription.val(),
        dueDate: taskDueDate.val(),
        status: "to-do"
    }
    let projects = readProjectsFromStorage();
    projects.push(task);
    localStorage.setItem("tasks", JSON.stringify(projects));
    localStorage.setItem("nextId", task.id);
    printProjectData();
    taskTitleInput.val("");
    taskDescription.val("");
    taskDueDate.val("");
    $('#formModal').modal('toggle');
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
    return projects;
  }

  
function printProjectData() {
    let tasks = readProjectsFromStorage();
    let todoList = $('#todo-cards');
    todoList.empty();
  
    let inProgressList = $('#in-progress-cards');
    inProgressList.empty();
  
    let doneList = $('#done-cards');
    doneList.empty();

    for (let task of tasks) {
        console.log(task.status);
      if (task.status === 'to-do') {
        console.log('to-do')
        todoList.append(createTaskCard(task));
      } else if (task.status === 'in-progress') {
        console.log('in-progress')
        inProgressList.append(createTaskCard(task));
      } else if (task.status === 'done') {
        console.log('done')
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
