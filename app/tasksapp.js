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
