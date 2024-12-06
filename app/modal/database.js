const express = require('express');
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./task.db', (err) =>{
    if(err){
        console.error(`Error connecting to database: ${err.message}`);
        return;
    }else{
        console.log(`Successfully connected to database`);
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, task_name VARCHAR(255) NOT NULL, date INTERGER NOT NULL, completed INTEGER DEFAULT 0)`);
});

module.exports = db;
