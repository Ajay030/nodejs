const form = document.querySelector('.login-box form');
form.addEventListener('submit', (event) => {
	event.preventDefault();

	const xhr = new XMLHttpRequest();
	const url = 'http://localhost:5500/library/login';

	xhr.open('POST', url, true);

	// Set the request header
	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.onreadystatechange = function () {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				const data = JSON.parse(xhr.responseText);
				if (data.result) {
					//console.log("hello" + data.token);
					document.cookie = `TOKEN = ${data.token}`;
					//redirect to member or librarian page based on role
					if (data.ROLE === 'user') {
						window.location.href = 'http://localhost:5500/user';
					} else if (data.ROLE === 'librarian') {
						window.location.href = 'http://localhost:5500/detail';
					} else {
						// handle invalid role
						console.error('Invalid role:', data.ROLE);
					}
				}
				else {
					console.log("hi"+data.msg);
				}
			}
			else {
				console.log('Error: ' + xhr.status);
				alert('Signup failed! Please try again.');
			}
		}
	}

	const formData = {
		Email: document.querySelector('#email').value,
		Password: document.querySelector('#password').value
	};

	xhr.send(JSON.stringify(formData));
});
