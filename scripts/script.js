const API_URL = "https://api.genderize.io/?name=";

window.addEventListener("DOMContentLoaded", () => {
  let formValues = {
    name: "",
    gender: undefined,
  };

  let lastName;
  // Get elements from the DOM
  const nameInput = document.querySelector("#name");
  const form = document.querySelector("#form");
  const saveButton = document.querySelector("#save");
  const genderTxt = document.querySelector("#gender-txt");
  const genderVal = document.querySelector("#gender-val");
  const saved = document.querySelector("#saved-answer");
  const clearButton = document.querySelector("#clear");
  const error = document.querySelector("#error");

  // Define event listeners
  nameInput.addEventListener("input", (event) => {
    formValues.name = event.target.value.trim();
  });

  form.addEventListener("change", () => {
    formValues.gender = document.querySelector('input[name="gender"]:checked')?.value;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    lastName = formValues.name;
    displayError(''); // Clear any previous errors

    if (!formValues.name) {
      displayError("Please enter a name.");
      return;
    }

    // Display result from local storage if available
    saved.textContent = localStorage.getItem(lastName) || "No data";

    // Show loading
    genderTxt.textContent = "Loading...";
    genderVal.textContent = "Loading...";

    // Fetch data
    fetch(`${API_URL}${formValues.name}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (data.name === null) {
          throw new Error("Name not available");
        }
        if (data.probability == 0) {
            displayError("the name "+formValues.name+" is not available!")
        }
        genderTxt.textContent = data.gender || "Not available";
        genderVal.textContent = (data.probability * 100).toFixed(2) + '%' || "0%";
      })
      .catch((error) => {
        displayError(`Error: ${error.message}`);
        genderTxt.textContent = "Gender";
        genderVal.textContent = "Probability";
      });
  });
  
    saveButton.addEventListener("click", () => {
    if (formValues.gender !== undefined && formValues.name !== "") {
      localStorage.setItem(formValues.name, formValues.gender);
      saved.textContent = `Saved: ${formValues.gender}`;
      displayError(''); // Clear any previous errors
    }
      //SHOW ERROR TO USER FOR COMPLETING FORM
    else {
      displayError("Please complete the form to save.");
    }
  });

  clearButton.addEventListener("click", () => {
    if (localStorage.getItem(lastName)) {
      localStorage.removeItem(lastName);
      lastName = ""
      saved.innerHTML = "Cleared"
    }
  });

  // Function to display errors
  function displayError(message) {
    error.textContent = message;
    error.style.display = message ? 'block' : 'none';
  }
});

