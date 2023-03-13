const signupForm = document.querySelector('.signup-box');
signupForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const xhr = new XMLHttpRequest();
  const url = 'http://localhost:5500/library/register';

  xhr.open('POST', url, true);

  // Set the request header
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = function() {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        console.log(response);
        alert('Signup successful!');
        //signupForm.reset();
        window.location.href = 'http://localhost:5500/login';
      } else {
        console.log('Error: ' + xhr.status);
        alert('Signup failed! Please try again.');
      }
  };
  const formData = {
    F_name: document.querySelector('#F_name').value,
    L_name: document.querySelector('#L_name').value,
    Email: document.querySelector('#Email').value,
    Password: document.querySelector('#Password').value,
    Join_date: document.querySelector('#Join_date').value
  };
  console.log(formData)
  // Send the request with the JSON-encoded form data
  xhr.send(JSON.stringify(formData));
});