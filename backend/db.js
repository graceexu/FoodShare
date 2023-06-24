const mongoose = require('mongoose');
const config = require('./config');

const MONGODB_URI = config.MONGODB_URI;

// connect to mongodb
async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // test connection by sending a ping
    const adminDb = mongoose.connection.db.admin();
    const pingResult = await adminDb.ping();
    console.log('Pinged deployment. Successful connection to Mongo.');
  } catch (error) {
    console.error('Error connecting to MongoDB: ', error.message);
  }
}

module.exports = { connectToDatabase };