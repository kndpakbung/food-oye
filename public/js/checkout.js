const cartItems = document.querySelector(".cart-items");
const cartTotalPrice = document.querySelector(".cart-total-price");

let dishRows = [];


window.addEventListener
(
	"load",
	async () =>
	{
		const dishes = JSON.parse(sessionStorage.getItem("fo_dishes"));
		if(dishes && dishes.length > 0){
			const response = await fetch
			(
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
			console.log('detail', details)

			for(let i = 0; i < details.dishRestDetails.length; i++)
			{
				dishRows[i] = makeRow(details.dishRestDetails[i]);
				cartItems.appendChild(dishRows[i]);
			}
		}
		
		updateTotalPrice();
	}
);


/* <div class="cart-row" data-dish-price="dvnd">
	<span class="cart-item-title cart-column">pnr pasanda</span>

	<span class="cart-item-title cart-column">Hotel</span>

	<span class="cart-price cart-column">₹190</span>

	<div class="cart-quantity cart-column">
		<input class="cart-quantity-input" type="number" value="1">

		<button class="btn btn-danger" type="button">Remove</button>
	</div>
</div> */


function makeRow(obj)
{
	const rowDiv = createElement("div.cart-row", null, {
		"data-dish-price": obj.price
	});

	createElement("span.cart-item-title.cart-column", rowDiv, {
		innerText: obj.name
	});
	
	createElement("span.cart-item-title.cart-column", rowDiv, {
		innerText: obj.name
	});

	createElement("span.cart-price.cart-column", rowDiv, {
		innerText: "₹" + obj.price
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


function createElement(selector, parent, attributes = {})
{
	let classes = selector.split(".");

	let tagAndId = classes.shift();
	let [tag, id] = tagAndId.split("#");
	
	let element = document.createElement(tag);

	if(id)
		element.id = id;
	if(classes.length)
		element.classList.add(...classes);
	
	if(parent)
		parent.appendChild(element);
	
	for(let k in attributes)
		if(k in element)
			element[k] = attributes[k];
		else
			element.setAttribute(k, attributes[k]);

	return element;
}


function updateTotalPrice()
{
	let totalPrice = 0;

	for(let i = 0; i < dishRows.length; i++)
		totalPrice += dishRows[i].dataset.dishPrice * dishRows[i].querySelector(".cart-quantity-input").value;	

	cartTotalPrice.innerText = "₹" + totalPrice;
}