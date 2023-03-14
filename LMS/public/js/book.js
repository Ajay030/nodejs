const signupForm = document.querySelector('.signup-box');
signupForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const xhr = new XMLHttpRequest();
  const url = 'http://localhost:5500/library/insert';

  xhr.open('POST', url, true);

  // Set the request header
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        console.log(response);
        if(response.result)
        {
        alert('Register successful!');
        //signupForm.reset();
        window.location.href = 'http://localhost:5500/detail';
        }
        else
        {
          console.log(result.msg);
        }
      } else {
        console.log('Error: ' + xhr.status);
        alert('Register failed! Please try again.');
      }
    }
  };
  const formData = {
    Name: document.querySelector('#name').value,
    ISBN: document.querySelector('#isbn').value,
    Cat: document.querySelector('#category').value,
    Edition: document.querySelector('#edition').value,
    Shelf_no: document.querySelector('#shelf').value,
	  Row_no: document.querySelector('#row').value,
	  Copies: document.querySelector('#copies').value,
	  Author: document.querySelector('#author').value
  };
  console.log(formData)
  // Send the request with the JSON-encoded form data
  xhr.send(JSON.stringify(formData));
});