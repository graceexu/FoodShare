const express = require('express');
const router = express.Router();
const { Listing, Organization, Recipient } = require('./models');

// create new listing
router.post('/listings', async (req, res) => {
  try {
    const { LID, foodName, expirationDate, pickupLocation, unavailabilities } = req.body;
    const listing = new Listing({ LID, foodName, expirationDate, pickupLocation, unavailabilities });
    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ error: 'Error creating listing' });
  }
});

// get all listings
router.get('/listings', async (req, res) => {
  try {
    const listings = await Listing.find();
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving listings' });
  }
});

// get single listing by LID
router.get('/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving listing' });
  }
});

// update listing
router.put('/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { LID, foodName, expirationDate, pickupLocation, unavailabilities } = req.body;
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { LID, foodName, expirationDate, pickupLocation, unavailabilities },
      { new: true }
    );
    if (!updatedListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.status(200).json(updatedListing);
  } catch (error) {
    res.status(500).json({ error: 'Error updating listing' });
  }
});

// delete listing
router.delete('/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting listing' });
  }
});

// create new organization
router.post('/organizations', async (req, res) => {
  try {
    const { OID, name, email, password } = req.body;
    const organization = new Organization({ OID, name, email, password });
    await organization.save();
    res.status(201).json(organization);
  } catch (error) {
    res.status(500).json({ error: 'Error creating organization' });
  }
});

// create new recipient
router.post('/recipients', async (req, res) => {
  try {
    const { RID, rname, email, password, isEligible, incomeStatement } = req.body;
    const recipient = new Recipient({ RID, rname, email, password, isEligible, incomeStatement });
    await recipient.save();
    res.status(201).json(recipient);
  } catch (error) {
    res.status(500).json({ error: 'Error creating recipient' });
  }
});


module.exports = router;