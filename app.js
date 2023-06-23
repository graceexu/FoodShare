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

// listing schema
const listingSchema = new mongoose.Schema({
    LID: {
        type: String,
        required: true,
    },
    foodName: {
        type: String,
        required: true,
    },
    expirationDate: {
        type: Date,
        required: true,
    },
    pickupLocation: {
        type: String,
        required: true,
    },
    unavailabilities: {
        type: [Date],
        default: [],
    },
});

const Listing = mongoose.model('Listing', listingSchema);

// organization schema
const organizationSchema = new mongoose.Schema({
    OID: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const Organization = mongoose.model('Organization', organizationSchema);

// recipient schema
const recipientSchema = new mongoose.Schema({
    RID: {
        type: String,
        required: true,
    },
    rname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isEligible: {
        type: Boolean,
        default: false,
    },
    incomeStatement: {
        data: Buffer,
        contentType: String,
        required: true,
    },
});

const Recipient = mongoose.model('Recipient', recipientSchema);