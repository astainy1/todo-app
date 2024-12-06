//Testing script connection
// alert('Connecting to script file');

//Get HTML elements
const addTaskBtn = document.getElementById('add-task-btn');
const showModal = document.querySelector('.modal');
const showBackdrop = document.querySelector('.backdrop');
const taskInput = document.getElementById('task');
const submitTaskBtn = document.getElementById('submit-btn');
const initialText = document.getElementById('empty-task');
const scrollContainer = document.querySelector('.task-main-container');
const scrollBox = document.getElementById('glow-box');

//Show pop for edit
const editTask = document.getElementById('edit-task');
// variable for added tasks
const listItem = document.getElementsByClassName('li');

const addClass = 'empty-task-div'
document.addEventListener('DOMContentLoaded', () => {

    addTaskBtn.addEventListener('click', () => {
        // console.log(showModal)
        showModal.classList.add('add-modal');
        scrollBox.classList.remove('empty-task-div');
        showBackdrop.classList.add('add-backdrop');

    })

    //disable task submit button
    submitTaskBtn.style.cursor = 'not-allowed';
    submitTaskBtn.disabled = true;

    //set conditions for input fields
    taskInput.onkeyup = () => {
        if(taskInput.value.length > 0) {
        submitTaskBtn.style.cursor = 'pointer';
        submitTaskBtn.disabled = false

        submitTaskBtn.onclick = () => {
            console.log('Task is added!')
            showModal.classList.remove('add-modal');
            showBackdrop.classList.remove('add-backdrop');
            taskInput.trim();
            taskInput.reset();

        };

    }else{
        submitTaskBtn.style.cursor = 'not-allowed';
        submitTaskBtn.disabled = true;

    }}

    showBackdrop.addEventListener('click', () => {
        console.log('Backdrop clicked')
        showBackdrop.classList.remove('add-backdrop');
        showModal.classList.remove('add-modal');
        
        if(listItem.length > 3){
            console.log('Task is greater than three');
            scrollBox.classList.add('empty-task-div');
        }else{
            console.log('Task is not greater than three');
            scrollBox.classList.remove('empty-task-div');
        }

        taskInput.reset();
        // taskInput.trim();
    })

    console.log(listItem);
    if(listItem.length > 3){
        console.log('Task is greater than three');
        scrollBox.classList.add('empty-task-div');
    }else{
        console.log('Task is not greater than three');
        scrollBox.classList.remove('empty-task-div');
    }

    editTask.addEventListener('click', function(e){
        showModal.classList.add('add-modal');
        scrollBox.classList.remove('empty-task-div');
        showBackdrop.classList.add('add-backdrop');
    })
})