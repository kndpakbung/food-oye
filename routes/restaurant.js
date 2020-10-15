const express = require("express");
const firebase = require("firebase-admin");
const firestore = firebase.firestore();

const router = express.Router();




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
			console.log(restDetails.categories);

			res.render("restaurant-home", {restId, restDetails, categories });
		}
	);


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


router.get
	(
		"/checkout",
		(req, res) => {
			res.render("checkout");
		}
	);




module.exports = router;