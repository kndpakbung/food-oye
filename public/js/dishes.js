const button = document.querySelectorAll(".get-data");
const dishCount = document.querySelector("#dish-count");

let dishCounter = 0

let dishes = JSON.parse(sessionStorage.getItem("fo_dishes"));
let dishesLength = 0;
if(dishes != null)
	dishesLength = dishes.length;
else
	dishes = [];

for(let i = 0; i < button.length; i++)
{
	button[i].addEventListener
	(
		"click",
		() =>
		{
			let dishId = button[i].value;

			if(button[i].innerText === "ADD TO CART")
			{
				dishes.push(dishId);
				sessionStorage.setItem("fo_dishes", JSON.stringify(dishes));

				dishCounter++;
				dishCount.innerText = dishCounter;

				button[i].innerText="ADDED";
			}
			else
			{
				dishes = dishes.filter(dish => dishId != dish);
				sessionStorage.setItem("fo_dishes", JSON.stringify(dishes));

				dishCounter--;
				dishCount.innerText = dishCounter;

				button[i].innerText="ADD TO CART";
			}
		}
	);
}

window.addEventListener
(
	"load",
	() =>
	{
		const dishesArr = JSON.parse(sessionStorage.getItem("fo_dishes"));

		if(dishesArr && dishesArr.length > 0)
		{
			for(let i = 0; i < button.length; i++)
			{
				for(let j = 0; j < dishesArr.length; j++)
				{
					if(dishesArr[j] === button[i].value)
					{
						button[i].innerHTML = "ADDED";
						dishCounter++;
					}
				}
			}

			dishCount.innerText = dishCounter;
		}
	}	
);