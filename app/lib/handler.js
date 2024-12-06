const { application } = require('express');
const database = require('../modal/database');



exports.home = (req, res) => {
    
    // Retrieve all tasks from the tasks table
    const allTasks = `SELECT * FROM tasks`;
    database.all(allTasks, [], (err, taskList) => {
        if (err) {
            console.error(`Error retrieving tasks from database: ${err.message}`);
            res.status(500).render('500', { title: 'Server Error', message: 'Sorry for the inconvenience, but there seems to be an issue with our server.' });
        } else {
            // Log the tasks for debugging
            taskList.forEach((task) => {
                // console.log(task);
            });

            // Pass the entire taskList array to the template
            res.render('home', { title: 'To-do app', addedTask: taskList, emptyMessage: 'No Task Added Yet!', task: null });
        }

    });

}


// Route for processing the submission of tasks
exports.process = (req, res) => {

    //Create container for months
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 
        'May', 'Jun', 'jul', 'Aug', 
        'Sep','Oct', 'Nov', 'Dec'
    ]

    const date = new Date();
    const fullDay = date.getDate();
    const fullMonth = date.getMonth();
    const fullYear = date.getFullYear();
    
    // console.log(date); 

    // console.log('Month: ' + months[fullMonth]);
    // console.log('Day: ' + fullDay);
    // console.log('Year: ' + fullYear);

    const {id, task} = req.body;
    const fullActualDate = `${months[fullMonth]} ${fullDay}, ${fullYear}`;
    
    // console.log('Task to be completed: ', task);
    // console.log(`The full date is: ${fullActualDate}`);
    
    //Check for duplicate data
    const duplicateTask = `SELECT COUNT(*) AS count FROM tasks WHERE task_name = ? AND date = ?`;

    //Insert data into table
    const newTask = `INSERT INTO tasks(task_name, date) VALUES(?,?)`;
    
    // const taskDB = database.db();
    // console.log(database)//Cheecking to see whether database is accessible

        if(id){
            res.redirect(303, `/edit/${id}`);
        }else{
                database.get(duplicateTask, [task, fullActualDate], (err, row) => {
                    if(err){
                        console.error('Error checking duplicate tasks', err.message);
                        return;
                    }
                    // Check for duplicates
                    if(row.count > 0){
                        console.log('Duplicate tasks found');
                        res.redirect(303, '/');
                    }else{
        
                    // Run the database by inserting values into various columns
                    database.run(newTask, [task, fullActualDate], (err) => {
                        if(err){
                            console.error('Error inserting data into database: ', err.message);
                            return res.status(500).render('500', {title: 'Server error', message: 'Database error. Please try again later.'});
                        }
                        res.redirect(303, '/');
                    })
                }
            })
        }
}

//Delete route
exports.delete = (req, res, next) => {
    // const {id} = req.params;
    const taskID = req.params.id;

    console.log('Task ID: ' + taskID + ' Deleted from task list');

    const getTask = `DELETE FROM tasks WHERE id = ?`;

    database.run(getTask, [taskID], (err) => {
        if(err){
            console.error('Error deleting task: ', err.message);
            res.status(500).render('500', { title: 'Server Error', message: 'Sorry for the inconvenience, but there seems to be an issue with our server.' });
        }else{
            res.redirect(303, '/');
        }
    })
}


//Edit Get route
exports.edit = (req, res) => {

    // Get selected task id
    const editedTaskID = req.params.id;
    console.log('Edited task ID: ' + editedTaskID);

    const getTaskForEdit = `SELECT * FROM tasks WHERE id = ?`;
    
    database.get(getTaskForEdit, [editedTaskID], (err, row) => {
        
        if(err){
            console.error('Error fetching task for edit: ', err.message);
            res.status(500).render('500', { title: 'Server Error', message: 'Sorry for the inconvenience, but there seems to be an issue with our server.' });
        } else {

            console.log(row);

            res.render('home', {title: 'Edit Task', task: row, addedTask: null, emptyMessage: ''});

        }
    })

};

// Edit post route
exports.update = (req, res) => {

        //Create container for months
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 
        'May', 'Jun', 'jul', 'Aug', 
        'Sep','Oct', 'Nov', 'Dec'
    ]

    const date = new Date();
    const fullDay = date.getDate();
    const fullMonth = date.getMonth();
    const fullYear = date.getFullYear();

    const {id} = req.params;// retriving the id of the selected task
    console.log(`Updated task id ${id}`);

    const {task} = req.body;
    const fullActualDate = `${months[fullMonth]} ${fullDay}, ${fullYear}`;
    const updateData =  [task, fullActualDate, id];
    
    //Check for duplicate data
    const duplicateTask = `SELECT COUNT(*) AS count FROM tasks WHERE task_name = ? AND date = ?`;

    //Insert data into table
    const editedTask = `UPDATE tasks SET task_name = ?, date = ? WHERE(id = ?)`;
    
    // const taskDB = database.db();
    // console.log(database)//Cheecking to see whether database is accessible

    // database.get(duplicateTask, updateData, (err, row) => {
            // if(err){
            //     console.error('Error checking duplicate tasks', err.message);
            //     return;
            // }
            // Check for duplicates
            // if(row.count > 0){
            //     console.log(`Tasks with id ${task.id} already exists`);
            //     res.redirect(303, '/');
            // }else{

            // Run the database by inserting values into selected column
            database.run(editedTask, updateData, (err) => {
                if(err){
                    console.error('Error inserting data into database: ', err.message);
                    return res.status(500).render('500', {title: 'Server error', message: 'Database error. Please try again later.'});
                 }

                 console.log(`Tasks with id ${id} updated successfully`);
                 res.redirect(303, '/');
            })
        // }
    // })
    
}

// Custome 404 response middleware

exports.notFound = (req, res, next) => {
    res.status(404);
    res.render('404', {title: '404 - Not Found'});
};

// Custome 500 response middleware
exports.serverError = (err, req, res, next) => {
    if(err){
        console.error(err.message);
    }else{
        res.status(err.status || 500);
        res.render('500', {title: 'Server Error', message: 'Sorry for the inconvenience, but there seems to be an issue with our server.'});
    }
};