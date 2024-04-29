const taskForm = $('#task-form');
const taskTitleInput = $('#task-title');
const taskDueDate = $('#task-due-date');
const taskDescription = $('#task-description');
const todoCard = $('#todo-cards');



// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || "";



// Todo: create a function to generate a unique task id
function generateTaskId() {
    return Math.floor(Math.random() * 9999)
    // const uid = function (generateTaskId) {
    //     return Date.now().toString(36) + Math.random().toString(36).substr(2);
    // }

    // console.log(uid())
}


// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>')
        .addClass('card task-card draggable my-3')
        .attr('data-task-id', task.id);
    const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
    taskCard.addClass('draggable')
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


// Todo: create a function to render the task list and make cards draggable

function renderTaskList() {
    $('.draggable').draggable({
        opacity: 0.8,
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
}




// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault()
    var task = {
        id: generateTaskId(),
        title: taskTitleInput.val(),
        description: taskDescription.val(),
        dueDate: taskDueDate.val(),
        status: "todo"
    }
    taskList.push(task)
    createTaskCard(task)
    localStorage.setItem("tasks", JSON.stringify(taskList))
    localStorage.setItem("nextId", task.id)
    taskTitleInput.val("")
    taskDescription.val("")
    taskDueDate.val("")
}



// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {

    var taskId = $(this).attr("data-task-id")
    console.log(taskId)
    var taskInfo = taskList.filter(element => element.id != taskId)
    taskList = taskInfo
    $(this).parent().parent().hide()
}




// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    $(taskForm).on("submit", handleAddTask)
}); 
