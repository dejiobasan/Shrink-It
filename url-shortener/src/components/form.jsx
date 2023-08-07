import React, { useState } from "react";
import { nanoid } from "nanoid";
import { getDatabase, child, set, ref, get } from "firebase/database";
import { isWebUri } from "valid-url";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

function Form(props) {
  const [url, setUrl] = useState({
    longURL: "",
    preferedAlias: "",
    generatedURL: "",
    loading: false,
    errors: [],
    errorMessage: {},
    toolTipMessage: "Copy To Clip Board",
  });

  async function handleSubmit(event) {
    event.preventDefault();
    setUrl({
      loading: true,
      generatedURL: "",
    });

    var isFormValid = await this.validateInput();
    if (!isFormValid) {
      return;
    }

    var generatedKey = nanoid(5);
    var generatedURL = "minilinkit.com/" + generatedKey

    if (url.preferedAlias !== '') {
        generatedKey = url.preferedAlias
        generatedURL = "minilinkit.com/" + url.preferedAlias
    }

    const db = getDatabase();
    set(ref(db, "/" + generatedKey), {
        generatedKey: generatedKey,
        longURL: url.longURL,
        preferedAlias: url.preferedAlias,
        generatedURL: generatedURL
    }).then((result) => {
        setUrl({
            generatedURL: generatedURL,
            loading: false
        })
    }).catch((error) => {
        console.log("Error adding document: ", error);
    })
  };

  return (
    <div>
      <h1>Form</h1>
    </div>
  );
}

export default Form;