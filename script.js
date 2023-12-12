class RatingWidget extends HTMLElement {
    connectedCallback() {
        const maxStars = parseInt(this.getAttribute('max')) || 5;
        const currentRating = parseInt(this.getAttribute('value')) || 0;

        // Ensure max is between 3 and 10
        const numStars = Math.max(3, Math.min(10, maxStars));

        this.innerHTML = ''; // Clear default content

        for (let i = 1; i <= numStars; i++) {
            const star = document.createElement('span');
            star.className = 'star';
            // star.innerHTML = '&#x1F531'; // Unicode character for a trident
            star.innerHTML = '&#9733;'; // Unicode character for a star

            // Highlight stars up to the current rating
            if (i <= currentRating) {
                star.classList.add('active');
            }

            // Add mouseover event listener to highlight stars on hover
            star.addEventListener('mouseover', () => this.hoverStars(i));

            // Add click event listener to set the rating
            star.addEventListener('click', () => this.setRating(i));

            this.appendChild(star);
        }

        
        this.addEventListener('ratingChange', (event) => {
            const newRating = event.detail;
            this.hoverStars(newRating);

            const goodRating = 0.8 * this.getAttribute('max');
            // Display different messages based on the rating
            if (newRating >= goodRating) {
                console.log(`Thanks for ${newRating} star rating!`);
            } else {
                console.log(`Thanks for your feedback of ${newRating} stars. We'll try to do better!`);
            }
        });
    }

    hoverStars(hoveredStarIndex) {
        const stars = this.querySelectorAll('.star');

        stars.forEach((star, index) => {
            // Remove "hover" class from all stars
            star.classList.remove('hover');

            // Apply "hover" styles to stars to the left of or equal to the hovered star
            if (index < hoveredStarIndex) {
                star.classList.add('hover');
            }
        });
    }

    setRating(rating) {
        // Dispatch a custom event to notify about the rating change
        this.dispatchEvent(new CustomEvent('ratingChange', { detail: rating }));

        // Example: Submit data to a server using fetch
        fetch('https://httpbin.org/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Sent-By': 'JS',
            },
            body: JSON.stringify({
                question: 'How satisfied are you?',
                sentBy: 'JS',
                rating: rating,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);

            // Hide the stars container
            // this.style.display = 'none';

            const goodRating = 0.8 * this.getAttribute('max');
            const message = (rating >= goodRating)
                ? `Thanks for ${rating} star rating!`
                : `Thanks for your feedback of ${rating} stars. We'll try to do better!`;
            
            console.log(message);
            this.showMessage(message);
        })
        .catch(error => console.error('Error:', error));
    }

    showMessage(message) {
        // Hide the stars container
        this.innerHTML = '';

        // Create a message element and append it to the container
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.className = 'message';

        this.appendChild(messageElement);
    }
}

customElements.define('rating-widget', RatingWidget);

// Check if a theme is already set in localStorage
var savedTheme = localStorage.getItem('theme');

if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
// Toggle between light and dark themes
var currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
var newTheme = currentTheme === 'light' ? 'dark' : 'light';

// Update the HTML attribute and localStorage
document.documentElement.setAttribute('data-theme', newTheme);
localStorage.setItem('theme', newTheme);
}

var formErrors = [];

document.getElementById('exampleForm').addEventListener('submit', function(event) {
    // var form = event.target;

    // // Check the validity of each field
    // if (!form.checkValidity()) {
    //     // Prevent form submission if any field is invalid
    //     event.preventDefault();

    //     // Display custom error messages
    //     displayError('name', 'Please enter a valid name.');
    //     displayError('email', 'Please enter a valid email address.');
    //     displayError('comments', 'Please enter valid comments.');
    // }

    // Add form errors to the formErrors array
    formErrors.push({ field: 'name', message: document.getElementById('name').validationMessage });
    formErrors.push({ field: 'email', message: document.getElementById('email').validationMessage });
    formErrors.push({ field: 'comments', message: document.getElementById('comments').validationMessage });

    // Attach the form-errors as a hidden field
    var formErrorsInput = document.createElement('input');
    formErrorsInput.type = 'hidden';
    formErrorsInput.name = 'form-errors';
    formErrorsInput.value = JSON.stringify(formErrors);

    // Append the hidden field to the form
    event.target.appendChild(formErrorsInput);
});

// Function to display custom error messages
function displayError(fieldId, message) {
    var field = document.getElementById(fieldId);
    var errorOutput = document.querySelector('output[for="' + fieldId + '"].error');

    if (!field.checkValidity()) {
        // If field is invalid, set custom error message
        field.setCustomValidity(message);
        form.reportValidity();
    }

    // Display the error message
    errorOutput.textContent = message;

    // Fade out the error message 
    setTimeout(function() {
        errorOutput.textContent = '';
    }, 3);
}

// Function to validate input against the specified pattern
function validateInput(input, fieldId) {
    var pattern = new RegExp(input.pattern);
    var inputValue = input.value;

    if (!pattern.test(inputValue)) {
        // Flash the field and present a message for illegal character
        input.classList.add('error-flash');

        // Display a message in the error message area
        displayError(fieldId, 'Illegal character entered.');

        // Remove the error class and reset the field after a few moments
        setTimeout(function() {
            input.classList.remove('error-flash');
            input.value = inputValue.replace(/[^a-zA-Z0-9.,!? ]+/g, '');
        }, 3); // Adjust the timeout value as needed
    }

    // Update the character countdown in the info message area
    updateCharacterCount(input, fieldId);
}

// Function to update character countdown
function updateCharacterCount(input, fieldId) {
    var infoOutput = document.querySelector('output[for="' + fieldId + '"].info');
    var remainingCharacters = input.maxLength - input.value.length;

    infoOutput.textContent = 'Characters remaining: ' + remainingCharacters;

    // Change style based on the remaining characters
    if (remainingCharacters <= 20) {
        infoOutput.classList.add('warn');
    }

    if (remainingCharacters <= 10) {
        infoOutput.classList.add('error');
    }
}
