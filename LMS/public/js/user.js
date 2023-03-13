var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://localhost:5500/library/show');
xhr.onload = function () {
	if (xhr.status === 200) {
		var data = JSON.parse(xhr.responseText);
		var bookDetails = document.getElementById('book-details');
		for (var i = 0; i < data.length; i++) {
			var row = document.createElement('tr');
			var name = document.createElement('td');
			var id = document.createElement('td');
			var isbn = document.createElement('td');
			var copies = document.createElement('td');
			var Category = document.createElement('td');
			var action = document.createElement('td');

			name.textContent = data[i].Id;
			id.textContent = data[i].Name;
			isbn.textContent = data[i].ISBN;
			copies.textContent = data[i].Count;
			Category.textContent = data[i].Category;

			row.appendChild(name);
			row.appendChild(id);
			row.appendChild(isbn);
			row.appendChild(copies);
			row.appendChild(Category);
			row.appendChild(action);
			bookDetails.appendChild(row);
		}
	}
	else {
		console.error('Request failed.  Returned status of ' + xhr.status);
	}
};
xhr.send();

