const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const port = 8000;

app.get("/", (req, res) => {
  const firebaseConfig = {
    "apiKey": process.env.REACT_APP_API_KEY,
    "authDomain": process.env.REACT_APP_AUTH_DOMAIN,
    "databaseURL": process.env.REACT_APP_DATABASE_URL,
    "projectId": process.env.REACT_APP_PROJECT_ID,
    "storageBucket": process.env.REACT_APP_STORAGE_BUCKET,
    "messagingSenderId": process.env.REACT_APP_MESSAGING_SENDER_ID,
    "appId": process.env.REACT_APP_APP_ID,
    "measurementId": process.env.REACT_APP_MEASUREMENT_ID
  }

  res.json(firebaseConfig);
});

app.listen(port, function () {
  console.log("server started at port 8000.");
});
