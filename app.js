const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const MONGODB_URI = config.MONGODB_URI;

const app = express();
const port = 3000;

// connect to mongo
async function connectToDatabase() {
    try {
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  
      console.log('Connection to MongoDB successful.');
  
      // test connection by sending a ping
      const adminDb = mongoose.connection.db.admin();
      const pingResult = await adminDb.ping();
      console.log('Pinged deployment. Successful connection to Mongo.');
    } catch (error) {
      console.error('Error connecting to MongoDB: ', error.message);
    }
}