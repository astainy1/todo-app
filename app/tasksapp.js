// import required modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');	
const router = require('./lib/handler');
const handler = require('./middleware/error.js');
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
//Index routes - Login 
// app.get('/', handler.indexGet);
// app.post('/', handler.indexPost);

//Index routers - register
// app.get('/register', handler.registerGet);
// app.post('/register', handler.registerPost);


// delete routes
// app.post('/delete/:id', handler.delete);
//edit routes
// app.get('/edit/:id?', handler.edit);
// app.post('/edit/:id', handler.update);
//Completed task 
// app.post(handler.completedTask);

//User router
app.use(router);

//Custome 404 response
app.use(handler.notFound);

//Custom 500 response
app.use(handler.serverError);

app.listen(port, () => {
    console.log(`Server is listening on port (http://localhost:${port})
            Press Ctrl+C to quit...`);
});
