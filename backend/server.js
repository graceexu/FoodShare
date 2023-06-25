const express = require('express');
const session = require('express-session');
const { connectToDatabase } = require('./db');
const config = require('./config');
// const fs = require('fs');
// const tf = require('@tensorflow/tfjs-node');

// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

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

// let model;

// async function loadModel() {
//   try {
//     model = await tf.loadLayersModel('https://teachablemachine.withgoogle.com/models/A4aPprr3H/model.json');
//     console.log('Model loaded successfully');
//   } catch (err) {
//     console.error('Error loading model: ', err);
//   }
// }

// (async () => {
//   await loadModel();

//   // file upload route
//   app.post('/api/upload', upload.single('image'), (req, res) => {
//     if (!req.file) {
//       return res.status(400).send('No image file uploaded');
//     }
    
//     const imageBuffer = fs.readFileSync(req.file.path);
//     const decodedImage = tf.node.decodeImage(imageBuffer);
    
//     // Convert the image to 3 channels if it has 4 channels
//     const imageChannels = decodedImage.shape[2];
//     const image = imageChannels === 4 ? decodedImage.slice([0, 0, 0], [-1, -1, 3]) : decodedImage;
    
//     const [imageHeight, imageWidth] = image.shape;
//     const cropSize = Math.min(imageHeight, imageWidth);
//     const croppedImage = tf.image.cropAndResize(
//       image.expandDims(0),
//       [[0, 0, 1, 1]],
//       [0],
//       [cropSize, cropSize] // Crop to a square shape
//     );
    
//     // Reshape the cropped image to have the desired shape
//     const reshapedImage = tf.reshape(croppedImage, [1, 150528]);
    
//     if (!model) {
//       return res.status(500).send('Image classification model not loaded');
//     }

//     model
//       .predict(reshapedImage)
//       .arrayBuffer()
//       .then(predictionsBuffer => {
//         const predictionsArray = Array.from(new Float32Array(predictionsBuffer));
//         console.log(predictionsArray);
//         const isLegalDocument = checkLegalDocument(predictionsArray);

//         if (isLegalDocument) {
//           fs.unlinkSync(req.file.path);
//           res.redirect('/api/auth/register/recipient');
//         } else {
//           fs.unlinkSync(req.file.path);
//           res.json({ predictions: predictionsArray, isLegalDocument: false });
//         }
//       })
//       .catch(err => {
//         console.error('Error classifying the image: ', err);
//         res.status(500).send('An error occurred while processing the image');
//       });
//   });

//   // helper function to check if document is a legal document
//   function checkLegalDocument(predictions) {
//     // need to put logic based on predictions here
//     return true;
//   }

//   app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/backend/index.html');
//   });

  app.use('/api', require('./apiRoutes'));

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
// })();
