const mongoose = require('mongoose');

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

module.exports = {
    Listing,
    Organization,
    Recipient,
};