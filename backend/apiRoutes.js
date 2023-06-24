const express = require('express');
const axios = require('axios');
const router = express.Router();
const config = require('./config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Listing, Organization, Recipient } = require('./models');

const GOOGLEMAPSAPI_KEY = config.GOOGLEMAPSAPI_KEY;
const JWT_SECRET = config.JWT_SECRET;
const JWT_EXPIRATION = config.JWT_EXPIRATION;

// helper function to generate jwt token
const generateToken = (user) => {
  const payload = {
    id: user._id,
    userType: user.constructor.modelName,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

// middleware to check token expiration
const checkTokenExpiration = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        // token is expired or invalid -> generate a new token
        const user = getUserFromDecodedToken(decoded);
        const newToken = generateToken(user);
        req.headers.authorization = newToken;
      }
    });
  }

  next();
};

// create new listing
router.post('/api/listings/create', checkTokenExpiration, checkTokenExpiration, async (req, res) => {
  try {
    const { LID, foodName, expirationDate, pickupLocation, unavailabilities } = req.body;
    const listing = new Listing({ LID, foodName, expirationDate, pickupLocation, unavailabilities });
    await listing.save();
    res.status(201).json({ data: listing });
  } catch (error) {
    res.status(500).json({ errors: [{ title: 'Error creating listing' }] });
  }
});

// get all listings
router.get('/api/listings', checkTokenExpiration, checkTokenExpiration, async (req, res) => {
  try {
    const listings = await Listing.find();
    res.status(200).json({ data: listings });
  } catch (error) {
    res.status(500).json({ errors: [{ title: 'Error retrieving listings' }] });
  }
});

// get single listing by id
router.get('/api/listings/:id', checkTokenExpiration, async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ errors: [{ title: 'Listing not found' }] });
    }
    res.status(200).json({ data: listing });
  } catch (error) {
    res.status(500).json({ errors: [{ title: 'Error retrieving listing' }] });
  }
});

// update listing by id
router.put('/api/listings/:id/update', checkTokenExpiration, async (req, res) => {
  try {
    const { id } = req.params;
    const { LID, foodName, expirationDate, pickupLocation, unavailabilities } = req.body;
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { LID, foodName, expirationDate, pickupLocation, unavailabilities },
      { new: true }
    );
    if (!updatedListing) {
      return res.status(404).json({ errors: [{ title: 'Listing not found' }] });
    }
    res.status(200).json({ data: updatedListing });
  } catch (error) {
    res.status(500).json({ errors: [{ title: 'Error updating listing' }] });
  }
});

// delete listing by id
router.delete('/api/listings/:id/delete', checkTokenExpiration, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
      return res.status(404).json({ errors: [{ title: 'Listing not found' }] });
    }
    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ errors: [{ title: 'Error deleting listing' }] });
  }
});

// search listings with filtering
router.get('/api/listings/search', checkTokenExpiration, async (req, res) => {
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
      listings = listings.filter((listing) => listing.expirationDate >= new Date(expirationDate));
    }

    // calculate distances using google maps api
    if (userLocation) {
      const origins = userLocation;
      const destinations = listings.map((listing) => listing.pickupLocation);

      // make a request to google maps distance matrix api
      const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
        params: {
          origins: origins,
          destinations: destinations,
          key: GOOGLEMAPSAPI_KEY,
        },
      });

      const { status, rows } = response.data;

      if (status === 'OK' && rows.length > 0) {
        const distances = rows[0].elements.map((element) => element.distance.value);

        // assign distances to the listings
        listings.forEach((listing, index) => {
          listing.distance = distances[index];
        });

        // sort listings by distance in ascending order
        listings.sort((a, b) => a.distance - b.distance);
      }
    }

    res.status(200).json({ data: listings });
  } catch (error) {
    res.status(500).json({ errors: [{ title: 'Error searching listings' }] });
  }
});

// register new organization
router.post('/api/auth/register/organization', checkTokenExpiration, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if the username or email is already registered
    const existingUser = await Organization.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ errors: [{ title: 'Username or email already exists' }] });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new organization
    const newOrganization = new Organization({ username, email, password: hashedPassword });

    // save organization to the database
    await newOrganization.save();

    const token = generateToken(newOrganization);

    res.status(201).json({ data: { message: 'Organization registered successfully', token } });
  } catch (error) {
    res.status(500).json({ errors: [{ title: 'Error registering organization' }] });
  }
});

// register new recipient
router.post('/api/auth/register/recipient', checkTokenExpiration, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if the username or email is already registered
    const existingUser = await Recipient.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ errors: [{ title: 'Username or email already exists' }] });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new recipient
    const newRecipient = new Recipient({ username, email, password: hashedPassword });

    // save recipient to the database
    await newRecipient.save();

    const token = generateToken(newRecipient);

    res.status(201).json({ data: { message: 'Recipient registered successfully', token } });
  } catch (error) {
    res.status(500).json({ errors: [{ title: 'Error registering recipient' }] });
  }
});

// user login
router.post('/api/auth/login', checkTokenExpiration, async (req, res) => {
  try {
    const { username, password, userType } = req.body;

    let user;
    if (userType === 'organization') {
      user = await Organization.findOne({ username });
    } else if (userType === 'recipient') {
      user = await Recipient.findOne({ username });
    }

    // check if user exists
    if (!user) {
      return res.status(404).json({ errors: [{ title: 'User not found' }] });
    }

    // compare provided password w stored password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ errors: [{ title: 'Invalid password' }] });
    }

    // generate and send token in response
    const token = generateToken(user);

    res.status(200).json({ data: { message: 'User login successful', token } });
  } catch (error) {
    res.status(500).json({ errors: [{ title: 'Error logging in user' }] });
  }
});

// user logout
router.post('/api/auth/logout', checkTokenExpiration, async (req, res) => {
  try {
    // clear user session or token. session based auth
    // ... implement token-based authentication, clear the token from client-side instead
    // ... or handle token expiration on the client-side

    res.status(200).json({ data: { message: 'User logout successful' } });
  } catch (error) {
    res.status(500).json({ errors: [{ title: 'Error logging out user' }] });
  }
});


// get user by id
router.get('/api/users/:id', checkTokenExpiration, async (req, res) => {
  try {
    const { id, userType } = req.params;
    let user;

    if (userType === 'organization') {
      user = await Organization.findById(id);
    } else if (userType === 'recipient') {
      user = await Recipient.findById(id);
    }

    if (!user) {
      return res.status(404).json({ errors: [{ title: 'User not found' }] });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ errors: [{ title: 'Error retrieving user' }] });
  }
});

// update user by id
router.put('/api/users/:id/update', checkTokenExpiration, async (req, res) => {
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
      return res.status(404).json({ errors: [{ title: 'User not found' }] });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ errors: [{ title: 'Error updating user' }] });
  }
});

// delete user by id
router.delete('/api/users/:id/delete', checkTokenExpiration, async (req, res) => {
  try {
    const { id, userType } = req.params;
    let user;

    if (userType === 'organization') {
      user = await Organization.findByIdAndDelete(id);
    } else if (userType === 'recipient') {
      user = await Recipient.findByIdAndDelete(id);
    }

    if (!user) {
      return res.status(404).json({ errors: [{ title: 'User not found' }] });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ errors: [{ title: 'Error deleting user' }] });
  }
});

module.exports = router;