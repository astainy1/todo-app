document.addEventListener('DOMContentLoaded', () => {

    const addTaskBtn = document.getElementById('add-task-btn');
    const editTaskButtons = document.querySelectorAll('.edit-task-btn');
    const showModal = document.querySelector('.modal');
    const showBackdrop = document.querySelector('.backdrop');
    const taskInput = document.getElementById('task');
    const submitTaskBtn = document.getElementById('submit-btn');
    const modalForm = document.querySelector('.modal');
    const hiddenIdInput = document.getElementById('hidden-task-id'); // Ensure this is queried correctly

    // Show the modal for adding a task
    addTaskBtn.addEventListener('click', () => {
        showModal.classList.add('add-modal');
        showBackdrop.classList.add('add-backdrop');

        // Clear the form for new task
        taskInput.value = '';

        // Ensure hiddenIdInput is available and reset it
        if (hiddenIdInput) {
            hiddenIdInput.value = '';  // Clear the hidden ID for creating a new task
        } else {
            console.error('Hidden input field for ID not found.');
        }

        modalForm.action = '/'; // Set action to the create route
        submitTaskBtn.value = 'Submit';
    });

    // Show the modal for editing a task
    editTaskButtons.forEach(button => {
        button.addEventListener('click', () => {
            const taskId = button.dataset.id;
            const taskName = button.dataset.name;
            const taskDate = button.dataset.date;

            showModal.classList.add('add-modal');
            showBackdrop.classList.add('add-backdrop');

            // Populate the form with the task's details
            taskInput.value = taskName;

            // Ensure hiddenIdInput is available before setting the value
            if (hiddenIdInput) {
                hiddenIdInput.value = taskId;
            } else {
                console.error('Hidden input field for ID not found.');
            }

            modalForm.action = `/edit/${taskId}`; // Set action to the edit route
            submitTaskBtn.value = 'Update';
        });
    });

    // Close the modal when the backdrop is clicked
    showBackdrop.addEventListener('click', () => {
        showModal.classList.remove('add-modal');
        showBackdrop.classList.remove('add-backdrop');
    });
});
