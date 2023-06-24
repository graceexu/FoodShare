const express = require('express');
const axios = require('axios');
const router = express.Router();
const config = require('./config');
const bcrypt = require('bcrypt');
const { Listing, Organization, Recipient } = require('./models');

const GOOGLEMAPSAPI_KEY = config.GOOGLEMAPSAPI_KEY;

// create new listing
router.post('/api/listings/create', async (req, res) => {
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
router.get('/api/listings', async (req, res) => {
  try {
    const listings = await Listing.find();
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving listings' });
  }
});

// get single listing by id
router.get('/api/listings/:id', async (req, res) => {
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

// update listing by id
router.put('/api/listings/:id/update', async (req, res) => {
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

// delete listing by id
router.delete('/api/listings/:id/delete', async (req, res) => {
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

// search listings with filtering
router.get('/api/listings/search', async (req, res) => {
  try {
    const { foodName, expirationDate, pickupLocation, filterByAvailability, userLocation } = req.query;

    const query = {};

    if (foodName) {
      query.foodName = foodName;
    }
    if (expirationDate) {
      query.expirationDate = { $gte: new Date(expirationDate) };
    }
    if (pickupLocation) {
      query.pickupLocation = pickupLocation;
    }

    // filter by availability if requested
    if (filterByAvailability) {
      query.unavailabilities = { $nin: [new Date()] };
    }

    // execute query
    const listings = await Listing.find(query);

    // filter by expiration date
    if (expirationDate) {
      listings = listings.filter(listing => listing.expirationDate >= new Date(expirationDate));
    }

    // calculate distances using google maps api
    if (userLocation) {
      const origins = userLocation;
      const destinations = listings.map(listing => listing.pickupLocation);

      // make a request to google maps distance matrix api
      const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
        params: {
          origins: origins,
          destinations: destinations,
          key: GOOGLEMAPSAPI_KEY
        }
      });

      const { status, rows } = response.data;

      if (status === 'OK' && rows.length > 0) {
        const distances = rows[0].elements.map(element => element.distance.value);

        // assign distances to the listings
        listings.forEach((listing, index) => {
          listing.distance = distances[index];
        });

        // sort listings by distance in ascending order
        listings.sort((a, b) => a.distance - b.distance);
      }
    }

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Error searching listings' });
  }
});

// register new organization
router.post('/api/auth/register/organization', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if the username or email is already registered
    const existingUser = await Organization.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new organization
    const newOrganization = new Organization({ username, email, password: hashedPassword });

    // save organization to the database
    await newOrganization.save();

    res.status(201).json({ message: 'Organization registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering organization' });
  }
});

// register new recipient
router.post('/api/auth/register/recipient', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if the username or email is already registered
    const existingUser = await Recipient.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new recipient
    const newRecipient = new Recipient({ username, email, password: hashedPassword });

    // save recipient to the database
    await newRecipient.save();

    res.status(201).json({ message: 'Recipient registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering recipient' });
  }
});

// user login
router.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password, userType } = req.body;

    let user;
    if (userType === 'organization') {
      user = await Organization.findOne({ username });
    } else if (userType === 'recipient') {
      user = await Recipient.findOne({ username });
    }

    // check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // compare the provided password with the stored password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // user auth successful
    res.status(200).json({ message: 'User login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in user' });
  }
});

// user logout
router.post('/api/auth/logout', async (req, res) => {
  try {
    // clear user session or token. session based auth
    req.session.destroy();

    res.status(200).json({ message: 'User logout successful' });
  } catch (error) {
    res.status(500).json({ error: 'Error logging out user' });
  }
});


// get user by id
router.get('/api/users/:id', async (req, res) => {
  try {
    const { id, userType } = req.params;
    let user;

    if (userType === 'organization') {
      user = await Organization.findById(id);
    } else if (userType === 'recipient') {
      user = await Recipient.findById(id);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving user' });
  }
});

// update user by id
router.put('/api/users/:id/update', async (req, res) => {
  try {
    const { id, userType } = req.params;
    const { username, email, password } = req.body;
    let user;

    if (userType === 'organization') {
      user = await Organization.findByIdAndUpdate(id, { username, email, password }, { new: true });
    } else if (userType === 'recipient') {
      user = await Recipient.findByIdAndUpdate(id, { username, email, password }, { new: true });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: `User with ID ${id} updated successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
});


// router.post('/api/listings/:id/report', async (req, res) => {

// });

// router.get('/api/notifications', async (req, res) => {

// });

// router.put('/api/notifications/:id/mark-read', async (req, res) => {

// });

// router.get('/api/settings', async (req, res) => {

// });

// router.post('/api/auth/resend-verification', async (req, res) => {

// });

module.exports = router;
