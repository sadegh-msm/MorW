const API_URL = "https://api.genderize.io/?name=";

window.addEventListener("DOMContentLoaded", () => {
  // Initialize form values
  let formValues = { name: "", gender: undefined };

  // Get DOM elements
  const elements = {
    nameInput: document.querySelector("#name"),
    form: document.querySelector("#form"),
    saveButton: document.querySelector("#save"),
    genderTxt: document.querySelector("#gender-txt"),
    genderVal: document.querySelector("#gender-val"),
    saved: document.querySelector("#saved-answer"),
    clearButton: document.querySelector("#clear"),
    error: document.querySelector("#error")
  };

  // Update name on input change
  elements.nameInput.addEventListener("input", (event) => {
    formValues.name = event.target.value.trim();
  });

  // Update gender on radio button change
  elements.form.addEventListener("change", () => {
    formValues.gender = document.querySelector('input[name="gender"]:checked')?.value;
  });

  // Handle form submission
  elements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    const lastName = formValues.name;
    displayError(''); // Clear previous errors

    if (!formValues.name) {
      displayError("Please enter a name.");
      return;
    }

    if (!formValues.name.match(/^[a-zA-Z]{1,254}$/)) {
      displayError("Name must only contain letters and be less than 255 characters.");
      return;
    }
    // Show loading text
    elements.genderTxt.textContent = "Loading...";
    elements.genderVal.textContent = "Loading...";

    fetchGender(formValues.name, lastName);
  });

  // Save form data to localStorage
  elements.saveButton.addEventListener("click", () => {
    if (formValues.gender && formValues.name) {
      localStorage.setItem(formValues.name, formValues.gender);
      elements.saved.textContent = `Saved: ${formValues.gender}`;
      displayError('');
    } else {
      displayError("Please complete the form to save.");
    }
  });

  // Clear saved data from localStorage
  elements.clearButton.addEventListener("click", () => {
    const lastName = formValues.name;
    if (localStorage.getItem(lastName)) {
      localStorage.removeItem(lastName);
      elements.saved.textContent = "Cleared";
      displayError('');
    }
  });

  // Function to fetch gender data
  function fetchGender(name, lastName) {
    fetch(`${API_URL}${name}`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (data.name === null) throw new Error("Name not available");
        if (data.probability === 0) displayError(`The name ${name} is not available!`);

        elements.genderTxt.textContent = data.gender || "Not available";
        elements.genderVal.textContent = (data.probability * 100).toFixed(2) + '%' || "0%";
        elements.saved.textContent = localStorage.getItem(lastName) || "No data";
      })
      .catch(error => {
        displayError(`Error: ${error.message}`);
        elements.genderTxt.textContent = "Gender";
        elements.genderVal.textContent = "Probability";
      });
  }

  // Function to display error messages
  function displayError(message) {
    elements.error.textContent = message;
    elements.error.style.display = message ? 'block' : 'none';
  }
});

