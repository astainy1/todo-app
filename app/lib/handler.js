const express = require("express");
const router = express.Router();
const database = require("../modal/database");

//Store user id (Don't care using session);
let userID;

router.get('/', (req, res, next) => {

    return res.render("index", {
        title: "To-do App",
        addedTask: "",
        emptyMessage: "",
        task: '',
      });
}); 

router.post('/', (req, res) => {
    //Get username from the body content
    const username = req.body.username.trim();
    // console.log(username);
    if (username === "") {
      console.log("Please enter username.");
      res.json({ success: false, message: "Please enter a username." });
      return;
    }
    if (username.length < 4 || username === null) {
      console.log("Username must be greater than Four characters.");
      res.json({
        success: false,
        message: "Username must be greater than Four characters.",
      });
      return;
    } else {
      //Check whether user has already registered
      const existingUser = `SELECT * FROM users WHERE username = ?`;
      database.all(existingUser, [username], (err, results) => {
        if (err) {
          console.log("Error getting existing user: ", err.message);
          return res.status(500);
        } else {
  
          if(results.length > 0){
              userID = results[0].id;
              console.log('User has already registered');
              console.log(`User ${username} has successfully logged-in`);
              console.log(results[0].id)
              return res.redirect("/home");
  
          }else{
              console.log('This is a new user');
              //Insert username into users table
              const insertUsername = `INSERT INTO users (username) VALUES(?)`;
              database.run(insertUsername, [username], (err, rows) => {
                  if (err) {
                      console.log(
                          "Error inserting username into user table.",
                          err.stack || err.message
                      );
                      return res.status(500);
                  }
  
                  //Query users again to get new user id
                  const newExistingUser = `SELECT * FROM users WHERE username = ?`;
                  database.all(newExistingUser, [username], (err, row) => {
                      if(err){
                          console.log(
                              "Error quering username from user table.",
                              err.stack || err.message
                          );
                          return res.status(500);
                      }else{
                          userID = row[0].id;
                          // console.log(row);
                          console.log(`New User with ID ${userID} has successfully registered and logged-in`);
                          res.redirect("/home");
                          return;
                      }
                  })
              });
             
          }
        }
      });
    }
  });

//Home route after login
router.get('/home', (req, res) => {
    console.log(userID, 'Has successfully logged in to home page.')
    //Check if user id exist... else redirect to login page

    if(!userID){
        console.log('User is redirected to login page.')
        return res.redirect('/');
    }
  // Retrieve all tasks from the tasks table
  const allTasks = `SELECT * FROM tasks WHERE user_id = ? `;
  database.all(allTasks, [userID], (err, taskList) => {
    if (err) {
      console.error(`Error retrieving tasks from database: ${err.message}`);
      return res
        .status(500)
        .render("500", {
          title: "Server Error",
          message:
            "Sorry for the inconvenience, but there seems to be an issue with our server.",
        });
    } else {

        // console.log('Array of available task: ', taskList)
      // Log the tasks for debugging
      taskList.forEach((task) => {
        // console.log(task);
      });

      // Pass the entire taskList array to the template
      res.render("home", {
        title: "To-do app",
        addedTask: taskList,
        emptyMessage: "No Task Added Yet!",
        task: null,
      });
      return;
    }
  });
});

router.post('/home', (req, res) => {
    //Create container for months
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
  
    const date = new Date();
    const fullDay = date.getDate();
    const fullMonth = date.getMonth();
    const fullYear = date.getFullYear();
  
    // console.log(date);
  
    // console.log('Month: ' + months[fullMonth]);
    // console.log('Day: ' + fullDay);
    // console.log('Year: ' + fullYear);
  
    const { id, task } = req.body;
    const trimedTask = task.trim();
    
    console.log(trimedTask);
    
    const fullActualDate = `${months[fullMonth]} ${fullDay}, ${fullYear}`;
  
    // console.log('Task to be completed: ', task);
    // console.log(`The full date is: ${fullActualDate}`);
  
    //Check for duplicate data
    const duplicateTask = `SELECT COUNT(*) AS count FROM tasks`;
  
    // const taskDB = database.db();
    // console.log(database)//Cheecking to see whether database is accessible
  
    if (id) {
     return res.redirect(303, `/edit/${id}`);
    } else {
      database.get(duplicateTask, [], (err, row) => {
        if (err) {
          console.error("Error checking duplicate tasks", err.message);
          return;
        }
        // Check for duplicates
        if (!row) {
        //   console.log("Duplicate tasks found");
        console.log('Error checking total count of duplicate tasks')
        console.log(row)
          return res.redirect(303, "/home");
        } 
        else {
           if(!trimedTask){
            console.log('Empty task is not allowed');
            res.redirect('/home');
            return;
           }else{
            console.log(row)

            //   //Insert data into table
              const newTask = `INSERT INTO tasks(user_id, task_name, date) VALUES(?,?,?)`;
              // Run the database by inserting values into various columns
              database.run(newTask, [userID, trimedTask, fullActualDate], (err, row) => {
                if (err) {
                  console.error("Error inserting data into database: ", err.message);
                  return res
                    .status(500)
                    .render("500", {
                      title: "Server error",
                      message: "Database error. Please try again later.",
                    });
                }
                return res.redirect(303, "/home");
              });
           }
        }
      });
    }
  }
  )

//Delete route
router.post('/delete/:id', (req, res, next) => {
    // const {id} = req.params;
    const taskID = req.params.id;
  
    console.log("Task ID: " + taskID + " Deleted from task list");
  
    const getTask = `DELETE FROM tasks WHERE id = ?`;
  
    database.run(getTask, [taskID], (err) => {
      if (err) {
        console.error("Error deleting task: ", err.message);
        return res
          .status(500)
          .render("500", {
            title: "Server Error",
            message:
              "Sorry for the inconvenience, but there seems to be an issue with our server.",
          });
      } else {
        return res.redirect(303, "/home");
      }
    });
  });

//Edit Get route
router.get('/edit/:id?', (req, res) => {
    // Get selected task id
    const editedTaskID = req.params.id;
    console.log("Edited task ID: " + editedTaskID);
  
    const getTaskForEdit = `SELECT * FROM tasks WHERE id = ?`;
  
    database.get(getTaskForEdit, [editedTaskID], (err, row) => {
      if (err) {
        console.error("Error fetching task for edit: ", err.message);
        res
          .status(500)
          .render("500", {
            title: "Server Error",
            message:
              "Sorry for the inconvenience, but there seems to be an issue with our server.",
          });
      } else {
        console.log(row);
  
        res.render("home", {
          title: "Edit Task",
          task: row,
          addedTask: null,
          emptyMessage: "",
        });
      }
    });
  })

// Edit post route
router.post('/edit/:id', (req, res) => {
    //Create container for months
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
  
    const date = new Date();
    const fullDay = date.getDate();
    const fullMonth = date.getMonth();
    const fullYear = date.getFullYear();
  
    const { id } = req.params; // retriving the id of the selected task
    console.log(`Updated task id ${id}`);
  
    const { task } = req.body;
    const fullActualDate = `${months[fullMonth]} ${fullDay}, ${fullYear}`;
    const updateData = [task, fullActualDate, id];
  
    //Check for duplicate data
    const duplicateTask = `SELECT COUNT(*) AS count FROM tasks WHERE task_name = ? AND date = ?`;
  
    //Insert data into table
    const editedTask = `UPDATE tasks SET task_name = ?, date = ? WHERE(id = ?)`;
  
    // const taskDB = database.db();
    // console.log(database)//Cheecking to see whether database is accessible
  
    // Run the database by inserting values into selected column
    database.run(editedTask, updateData, (err) => {
      if (err) {
        console.error("Error inserting data into database: ", err.message);
        return res
          .status(500)
          .render("500", {
            title: "Server error",
            message: "Database error. Please try again later.",
          });
      }
  
      console.log(`Tasks with id ${id} updated successfully`);
      res.redirect(303, "/home");
    });
  });


// Retrive task id on click event and update task.

//Route for deleting completed tasks after 10 seconds
router.post('/complete/:id', (req, res) => {
    //Get task id from request params
    const taskId = req.params.id;
    console.log(taskId);
  
    const updateCompletedTask = `UPDATE tasks set completed = 1 WHERE id = ?`;
  
    database.run(updateCompletedTask, [taskId], (err) => {
      if (err) {
        console.error("Error updating completed task: ", err.message);
        return res
          .status(500)
          .render("500", {
            title: "Server Error",
            message:
              "Sorry for the inconvenience, but there seems to be an issue with our server.",
          });
      } else {
        console.log(`Task with id ${taskId} completed`);
        return res.redirect(303, "/home");
      }
    });
    //Delete completed task if
  });


module.exports = router;