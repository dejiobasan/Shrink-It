import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import axios from "axios";

import { initializeApp } from "firebase/app";

axios
  .get("http://localhost:8000/")
  .then((response) => {
    const firebaseConfig = {
      apiKey: response.data.apiKey,
      authDomain: response.data.authDomain,
      databaseURL: response.data.databaseURL,
      projectId: response.data.projectId,
      storageBucket: response.data.storageBucket,
      messagingSenderId: response.data.messagingSenderId,
      appId: response.data.appId,
      measurementId: response.data.measurementId,
    };
    initializeApp(firebaseConfig);
  })
  .catch((error) => {
    console.log(error);
  });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
