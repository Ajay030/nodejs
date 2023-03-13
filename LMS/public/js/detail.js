var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://localhost:5500/library/show');
xhr.onload = function () {
	if (xhr.status === 200) {
		var data = JSON.parse(xhr.responseText);
		var bookDetails = document.getElementById('book-details');
		const cooken = document.cookie.split('=');
		const formData = {
			"TOKEN": cooken[1]
		};
		xhr.open('POST','http://localhost:5500/library/user-data');
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload=()=>{
			const data_borrowed = xhr.responseText;
			console.log(data_borrowed)
			
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
				action.innerHTML = (data_borrowed.indexOf(data[i].Id) === -1? `<button id="borBut-${data[i].Id}" onClick="borBook('${data[i].Id}')">Borrow</button>`
				:`<button id="retBut-${data[i].Id}" onClick="retBook('${data[i].Id}')">Return</button>`)
	
				row.appendChild(name);
				row.appendChild(id);
				row.appendChild(isbn);
				row.appendChild(copies);
				row.appendChild(Category);
				row.appendChild(action);
				bookDetails.appendChild(row);
			}
		}
		xhr.send(JSON.stringify(formData));
	}
	else {
		console.error('Request failed.  Returned status of ' + xhr.status);
	}
};
xhr.send();


document.getElementById("add").onclick = function () {
	location.href = "http://localhost:5500/book";
};

document.getElementById("rem").onclick = function () {
	location.href = "http://localhost:5500/delete";
};


const borBook = (bookID) => {
	const xhr2 = new XMLHttpRequest();
	const url = 'http://localhost:5500/library/transaction';
	xhr2.open('POST', url, true);
	// Set the request header
	xhr2.setRequestHeader('Content-Type', 'application/json');
	xhr2.onreadystatechange = function () {
		if (xhr2.status === 200) {
			console.log("Transaction Succesfull");
			document.getElementById(`borBut-${bookID}`).remove();
		} else {
			console.log("Transaction Failed")
		}
	}
	const cooken = document.cookie.split('=');
	const formData = {
		"TOKEN": cooken[1],
		"Book_id": bookID,
		"Transaction_type": "borrow"
	}
	xhr2.send(JSON.stringify(formData));
}

const retBook = (bookID) => {
	const xhr2 = new XMLHttpRequest();
	const url = 'http://localhost:5500/library/transaction';
	xhr2.open('POST', url, true);
	// Set the request header
	xhr2.setRequestHeader('Content-Type', 'application/json');
	xhr2.onreadystatechange = function () {
		if (xhr2.status === 200) {
			console.log("Transaction Successful");
			document.getElementById(`retBut-${bookID}`).remove();
		} else {
			console.log("Transaction Failed")
		}
	}
	const cooken = document.cookie.split('=');
	const formData = {
		"TOKEN": cooken[1],
		"Book_id": bookID,
		"Transaction_type": "return"
	}
	xhr2.send(JSON.stringify(formData));
}