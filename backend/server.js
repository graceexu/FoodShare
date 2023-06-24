const express = require('express');
const session = require('express-session');
const { connectToDatabase } = require('./db');
const config = require('./config');
const apiRoutes = require('./apiRoutes');

const SECRETKEY = config.SECRETKEY

const app = express();
const port = 3000;

// middleware for parsing json bodies
app.use(express.json());

// connect to the database
connectToDatabase();

// session middleware config
app.use(
  session({
    secret: 'SECRETKEY',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000, // session duration in ms
      secure: false,
      httpOnly: true,
    },
  })
);

// file upload route
app.post('/upload', (req, res) => {

});

// api routes
app.use(apiRoutes);

// start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
