const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT'); 
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3500;
const corsOptions = require('./config/corsOptions');

// custom middleware logger
app.use(logger);

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
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/auth'));
// refreshToken route -> will now receive a cookie and accessToken when user login/auth
app.use('/refresh', require('./routes/refresh'));

// Place the verifyJWT middleware here as the JWTs won't be created until auth is called, so can't even be used in any routes except for here
app.use(verifyJWT)
app.use('/users', require('./routes/api/users'));

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

// Backend port listening of env or 3500
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));