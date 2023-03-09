const signupForm = document.querySelector('.signup-box form');

signupForm.addEventListener('submit', e => {
	e.preventDefault();
	// signup logic here

    // Get the form data
	const formData = new FormData(signupForm);
	
	// Log the form data to the console
	for (const [key, value] of formData.entries()) {
		console.log(`${key}: ${value}`);
	}

	// Send a POST request to the API endpoint
	fetch('Localhost:5500/library/registeration', {
		method: 'POST',
		body: formData
	})
	.then(response => response.json())
	.then(data => {
		// Handle the response from the API here
		console.log(data);
	})
	.catch(error => {
		// Handle any errors that occur during the request
		console.error(error);
	});
    
});
