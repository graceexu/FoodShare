const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const MONGODB_URI = config.MONGODB_URI;

const app = express();
const port = 3000;