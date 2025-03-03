document.addEventListener('DOMContentLoaded', () => {

    const addTaskBtn = document.getElementById('add-task-btn');
    const editTaskButtons = document.querySelectorAll('.edit-task-btn');
    const showModal = document.querySelector('.modal');
    const showBackdrop = document.querySelector('.backdrop');
    const taskInput = document.getElementById('task');
    const submitTaskBtn = document.getElementById('submit-btn');
    const modalForm = document.querySelector('.modal');
    const hiddenIdInput = document.getElementById('hidden-task-id'); 
    const completedTask = document.querySelectorAll('#checkTask button');
    const taskContainer = document.querySelectorAll('main ul li');
    const checkButtons = document.querySelectorAll('.check-btn button');
    
    // Show the modal for adding a task
    addTaskBtn.addEventListener('click', () => {
        showModal.classList.add('add-modal');
        showBackdrop.classList.add('add-backdrop');

        // Clear the form for new task
        taskInput.value = '';

        if (hiddenIdInput) {
            hiddenIdInput.value = '';  // Clear the hidden ID for creating a new task
        } else {
            console.error('Hidden input field for ID not found.');
        }

        modalForm.action = '/home'; // Set action to the create route
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

    //Complete task button click
    
    taskContainer.forEach((taskList) => {

                completedTask.forEach((taskChecked) => {
                
                console.log(`Task Checked button clicked`);

                taskChecked.addEventListener('click', () => {
                taskList.style.text = 'underline';
                    })
                    
                })
    })

    console.log(taskContainer);
    console.log(completedTask);

   
checkButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const taskId = e.target.closest('button').getAttribute('data-id');
        fetch(`/complete/${taskId}`, {
            method: 'POST'
        
        }).then(() => {
            location.reload(); // Reload the page after marking the task as complete
        });
    });
});

});
