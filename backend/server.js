const express = require('express');
const mongoose = require('mongoose');
const { connectToDatabase } = require('./db');
const apiRoutes = require('./apiRoutes');

const app = express();
const port = 3000;

app.use(express.json());

// connect to the database
connectToDatabase();

// API routes
app.use(apiRoutes);

// start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});