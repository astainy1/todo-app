// import required modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');	
const handler = require('./lib/handler');
// const liveReload = require('livereload');
const port = process.env.PORT || 3000;

//Middleware for parsing form data
app.use(bodyParser.urlencoded({extended: true}));

//middleware for templating
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Middleware for serving static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// const liveReloadServer = liveReload.createServer();
// liveReloadServer.server.once('connection', () => {
//     setTimeout(() => {
//         liveReloadServer.refresh('/');
//     }, 100)
// });

// app.use(connectLiveReload());

//routes
app.get('/', handler.home);
app.post('/', handler.process);
// delete routes
app.post('/delete/:id', handler.delete);
//edit routes
app.get('/edit/:id?', handler.edit);
app.post('/edit/:id', handler.update);
//Completed task 
app.post('/complete/:id', handler.completedTask);


//Custome 404 response
app.use(handler.notFound);

//Custom 500 response
app.use(handler.serverError);

app.listen(port, () => {
    console.log(`Server is listening on port (http://localhost:${port})
            Press Ctrl+C to quit...`);
});
