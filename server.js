// global usage of dotenv file configged
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT'); 
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const credentials = require('./middleware/credentials');
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing -> put in separate file in config folder.
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data
// in other words, form data:  
// ‘content-type: application/x-www-form-urlencoded’
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
// for adding coins to db, and creating similar foreign key relationship as SQL does.
app.use('/coins', require('./routes/coins'));

app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/auth'));
// refreshToken route -> will now receive a cookie and accessToken when user login/auth, can get new accessToken using this route
app.use('/refresh', require('./routes/refresh'));
// delete both the refresh token and the accessToken on logout
app.use('/logout', require('./routes/logout'));

// Place the verifyJWT middleware here as the JWTs won't be created until auth is called, so can't even be used in any routes except for here
app.use(verifyJWT)
app.use('/admins', require('./routes/api/admins'));

// 404 Pages handling
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

// Error Handler code
app.use(errorHandler);

// Listen for mongoDB connection using mongoose.
mongoose.connection.once('open', () => {
    console.log('Connected To MongoDB');
    // Backend port listening of env or 3500
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})