const signupForm = document.querySelector('.box');
signupForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const xhr = new XMLHttpRequest();
  const url = 'http://localhost:5500/library/Del_book';

  xhr.open('DELETE', url, true);

  // Set the request header
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = function() {
      if (xhr.status === 200) {
        alert('Removal successful!');
      } else {
        console.log('Error: ' + xhr.responseText);
        alert('Removal failed! Please try again.');
      }
  };

  const isbn_val = document.querySelector('#isbn').value;
  const cooken = document.cookie.split('=');
  const formData = {
    "ISBN": isbn_val,
    "TOKEN":cooken[1]
  };

  // Send the request with the JSON-encoded form data
  xhr.send(JSON.stringify(formData));
});