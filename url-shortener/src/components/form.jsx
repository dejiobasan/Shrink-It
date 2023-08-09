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
    var generatedURL = "minilinkit.com/" + generatedKey;

    if (url.preferedAlias !== "") {
      generatedKey = url.preferedAlias;
      generatedURL = "minilinkit.com/" + url.preferedAlias;
    }

    const db = getDatabase();
    set(ref(db, "/" + generatedKey), {
      generatedKey: generatedKey,
      longURL: url.longURL,
      preferedAlias: url.preferedAlias,
      generatedURL: generatedURL,
    })
      .then((result) => {
        setUrl({
          generatedURL: generatedURL,
          loading: false,
        });
      })
      .catch((error) => {
        console.log("Error adding document: ", error);
      });
  }

  function hasError(key) {
    return url.errors.indexOf(key) !== -1;
  }

  function handleChange(event) {
    const { id, value } = event.target;
    setUrl((prevState) => ({ ...prevState, [id]: value }));
  }

  async function validateInput() {
    var errors = [];
    var errorMessages = url.errorMessage;

    if (url.longURL.length === 0) {
      errors.push("longURL");
      errorMessages["longURL"] = "Please enter your URL!";
    } else if (!isWebUri(url.longURL)) {
      errors.push("longURL");
      errorMessages["longURL"] = "Please a URL in the form of https://www....";
    }

    if (url.preferedAlias !== "") {
      if (url.preferedAlias.length > 7) {
        errors.push("suggestedAlias");
        errorMessages["suggestedAlias"] =
          "Please Enter an Alias less than 7 Characters";
      } else if (url.preferedAlias.indexOf(" ") >= 0) {
        errors.push("suggestedAlias");
        errorMessages["suggestedAlias"] = "Spaces are not allowed in URLS";
      }

      var keyExists = await function checkKeyExists() {
        if (keyExists.exists()) {
          errors.push("suggestedAlias");
          errorMessages["suggestedAlias"] =
            "The Alias you have entered already exists! Please enter another one =-)";
        }
      };
    }

    setUrl({
      errors: errors,
      errorMessages: errorMessages,
      loading: false,
    });

    if (errors.length > 0) {
      return false;
    }

    return true;
  }

  async function checkKeyExists() {
    const dbRef = ref(getDatabase());
    return get(child(dbRef, `/${url.preferedAlias}`)).catch((error) => {
      return false;
    });
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(url.generatedURL);
    setUrl({
      toolTipMessage: "Copied",
    });
  }

  return (
    <div className="container">
      <form autoComplete="off">
        <h3>Shrink it</h3>

        <div className="form-group">
          <label>Enter Your Long URL</label>
          <input
            id="longURL"
            onChange={handleChange}
            value={url.longURL}
            type="url"
            required
            className={
              hasError("longURL")
                ? "form-control is-invalid"
                : "form-control"
            }
            placeholder="https://wwww..."
          />
        </div>
        <div
          className={
            hasError("longURL") ? "text-danger" : "visually-hiddden"
          }
        >
          {url.errorMessage.longURL}
        </div>
        <div className="form-group">
          <label className="basic-url">Your shrinked URL</label>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">minilinkit.com</span>
            </div>
            <input
              id="preferedAlias"
              onChange={handleChange}
              value={url.preferedAlias}
              className={
                hasError("preferedAlias")
                  ? "form-control is-invalid"
                  : "form-control"
              }
              type="text"
              placeholder="eg. 3fwias (optional)"
            />
          </div>
          <div
            className={
              hasError("suggestedAlias")
                ? "text-danger"
                : "visually-hidden"
            }
          >
            {url.errorMessage.suggestedAlias}
          </div>
        </div>
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleSubmit}
        >
          {url.loading ? (
            <div>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            </div>
          ) : (
            <div>
              <span
                className="visually-hidden spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span>Shrink it</span>
            </div>
          )}
        </button>
        {url.generatedURL === "" ? (
          <div></div>
        ) : (
          <div className="generatedurl">
            <span>Your generated URL is: </span>
            <div className="input-group mb-3">
              <input
                disabled
                type="text"
                value={url.generatedURL}
                className="form-control"
                placeholder="Recipient's username"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
              />
              <div className="input-group-append">
                <OverlayTrigger
                  key={"top"}
                  placement={"top"}
                  overlay={
                    <Tooltip id={`tooltip-${"top"}`}>
                      {url.toolTipMessage}
                    </Tooltip>
                  }
                >
                  <button
                    onClick={copyToClipboard}
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Tooltip on top"
                    className="btn btn-outline-secondary"
                    type="button"
                  >
                    Copy
                  </button>
                </OverlayTrigger>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default Form;