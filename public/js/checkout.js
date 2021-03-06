const cartItems = document.querySelector(".cart-items");
const cartTotalPrice = document.querySelector(".cart-total-price");

let dishRows = [];


window.addEventListener("load", async function onPlace_Order() {

	const dishes = JSON.parse(sessionStorage.getItem("fo_dishes"));

	if (dishes && dishes.length > 0) {
		// const restIdPath = window.location.pathname.split("/");
		// const restId = restIdPath[2];
		// console.log(restId);
		const response = await fetch
			( //เปลี่ยนไอดีร้าน
				`/endpoints/pH1fPqqzh4FVxYNcC3Uk/dishRestDetails`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ dishes })
				}
			);

		const details = await response.json();
		//log Order Details
		console.log('detail', details)

		for (let i = 0; i < details.dishRestDetails.length; i++) {
			dishRows[i] = makeRow(details.dishRestDetails[i]);
			cartItems.appendChild(dishRows[i]);
		}
	}

	updateTotalPrice();
}
);

function makeRow(obj) {
	const rowDiv = createElement("div.cart-row", null, {
		"data-dish-id": obj.id,
		"data-dish-price": obj.price
	});

	createElement("span.cart-item-title.cart-column", rowDiv, {
		innerText: obj.name
	});

	createElement("span.cart-item-title.cart-column", rowDiv, {
		innerText: obj.name
	});

	createElement("span.cart-price.cart-column", rowDiv, {
		innerText: "฿" + obj.price
	});


	const div = createElement("div.cart-quantity.cart-column", rowDiv);

	createElement("input.cart-quantity-input", div, {
		type: "number",
		value: 1,
		min: 1
	}).addEventListener("change", updateTotalPrice);

	createElement("button.btn.btn-danger", div, {
		type: "submit",
		innerText: "Remove"
	}).addEventListener("click", () => {
		rowDiv.remove();

		dishRows = dishRows.filter(e => !rowDiv.isSameNode(e));
		updateTotalPrice();

		const currSessionStorage = JSON.parse(sessionStorage.getItem("fo_dishes"));
		const newSessionStorage = currSessionStorage.filter(id => obj.id != id);
		sessionStorage.setItem("fo_dishes", JSON.stringify(newSessionStorage));
	});

	return rowDiv;
}


function createElement(selector, parent, attributes = {}) {
	let classes = selector.split(".");

	let tagAndId = classes.shift();
	let [tag, id] = tagAndId.split("#");

	let element = document.createElement(tag);

	if (id)
		element.id = id;
	if (classes.length)
		element.classList.add(...classes);

	if (parent)
		parent.appendChild(element);

	for (let k in attributes)
		if (k in element)
			element[k] = attributes[k];
		else
			element.setAttribute(k, attributes[k]);

	return element;
}


function updateTotalPrice() {
	let totalPrice = 0;
	let serviceCharge = 5;

	for (let i = 0; i < dishRows.length; i++) {
		totalPrice += dishRows[i].dataset.dishPrice * dishRows[i].querySelector(".cart-quantity-input").value + serviceCharge;
	}
	cartTotalPrice.innerText = "฿" + totalPrice;
}

async function onPlace_Order() {
	const cus_name = document.getElementById('name').value;
	const cus_phoneno = document.getElementById('phoneno').value;
	const d = new Date();
	const t = d.getTime();

	let restDish = []

	for (let i = 0; i < dishRows.length; i++) {
		restDish.push({
			id: dishRows[i].dataset.dishId,
			qty: dishRows[i].querySelector(".cart-quantity-input").value || 1
		})
	}

	console.log(restDish);
	console.log(cus_name);
	console.log(cus_phoneno);

	const response = await fetch
		( //เปลี่ยนไอดีร้าน
			`/endpoints/pH1fPqqzh4FVxYNcC3Uk/order`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ restDish,cus_name,cus_phoneno })
			}
		);

	console.log('response :',response);
}



