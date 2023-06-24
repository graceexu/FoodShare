const express = require('express');
const session = require('express-session');
const { connectToDatabase } = require('./db');
const config = require('./config');
const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');
const { loadGraphModel } = require('@tensorflow/tfjs-converter');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const SECRETKEY = config.SECRETKEY;

const app = express();
const port = 3000;

app.use(express.json());

connectToDatabase();

// session middleware config
app.use(
  session({
    secret: SECRETKEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000, // session duration in ms
      secure: false,
      httpOnly: true,
    },
  })
);

let model;

async function loadModel() {
  try {
    model = await tf.loadLayersModel('https://teachablemachine.withgoogle.com/models/A4aPprr3H/model.json');
    console.log('Model loaded successfully');
  } catch (err) {
    console.error('Error loading model: ', err);
  }
}

(async () => {
  await loadModel();

  // file upload route
  app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No image file uploaded');
    }

    const imageBuffer = fs.readFileSync(req.file.path);
    const image = tf.node.decodeImage(imageBuffer);

    if (!model) {
      return res.status(500).send('Image classification model not loaded');
    }

    model
      .predict(image)
      .array()
      .then(predictions => {
        const isLegalDocument = checkLegalDocument(predictions);

        if (isLegalDocument) {
          fs.unlinkSync(req.file.path);
          res.redirect('/api/auth/register/recipient');
        } else {
          fs.unlinkSync(req.file.path);
          res.json({ predictions, isLegalDocument: false });
        }
      })
      .catch(err => {
        console.error('Error classifying the image: ', err);
        res.status(500).send('An error occurred while processing the image');
      });
  });

  // helper function to check if document is a legal document
  function checkLegalDocument(predictions) {
    // need to put logic based on predictions here pls help

    return true;
  }

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/backend/index.html');
  });

  app.use('/api', require('./apiRoutes'));

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();
