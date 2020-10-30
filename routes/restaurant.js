const express = require("express");
const firebase = require("firebase-admin");
const firestore = firebase.firestore();
const router = express.Router();

router.get("/checkout", async (req, res) => {
	res.render("checkout");
}
);

router.get
	(
		"/:restaurantId",
		async (req, res) => {
			let restId = req.params.restaurantId;
			
			
			const restDetails = await firestore
				.collection("restaurants")
				.doc(restId)
				.get()
				.then((querySnapshot) => querySnapshot.data());

			const categories = restDetails.categories;
			console.log(categories);
			console.log(restDetails.categories);
			

			res.render("restaurant-home", { restId, restDetails, categories });
		}
	);

router.post("/checkout", async (req, res) => {
	const d = new Date();
	const t = d.getTime();
	const id = t - 300;
	const dishes = req.session
	const data = {
		order_id: id,
		cus_name: req.body.name,
		cus_phoneno: req.body.phoneno,
		order_Date: d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear(),
		order_Time: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
		// order: dishes

	};
	const orderRef = await firestore.collection("orders").add(data);
	console.log('Set: ', orderRef);
	res.redirect('/')

});


router.get
	(
		"/:restaurantId/dishes/:categoryId",
		async (req, res) => {
			let restId = req.params.restaurantId;
			const categoryId = req.params.categoryId;

			console.log(restId);
			console.log(categoryId);

			const restDetails = await firestore
				.collection("restaurants")
				.doc(restId)
				.get()
				.then(e => e.data());

			const category = restDetails.categories.filter((item) => item.category == categoryId)
			const dishes = restDetails.dishes.filter((item) => item.category == categoryId)

			console.log(category);
			console.log(dishes);


			res.render("dishes", { restDetails, category, dishes });
		}
	);

module.exports = router;