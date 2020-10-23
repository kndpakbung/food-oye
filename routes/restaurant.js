const express = require("express");
const firebase = require("firebase-admin");
const firestore = firebase.firestore();

const router = express.Router();



router.get
	(
		"/checkout",
		(req, res) => {
			res.render("checkout");
		}
	);

router.post("/checkout", (req, res) => {
	const d = new Date()
	const t = d.getTime();
	const orderId = 'Cus' + d + t - 300;
	const newOrder = ({
		name: req.body.name,
		phoneno: req.body.phoneno

	})
	storeData().then(result => {
		const orderRef = firestore.collection('orders').add({
			id: orderId,
			name: newOrder.name,
			phoneno: newOrder.phoneno,
			userDate: d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear(),
			hour: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
			userYear: d.getFullYear(),
		});
		console.log('Added document with ID: ', orderRef.id);
		res.redirect("/");
	}).catch((err) => {
		console.log('Error occured', err);

	}).catch(err => {
		console.log("No data inserted");
		res.redirect("#");
	});
	//Promise
	function storeData() {
		console.log(newOrder);
		return new Promise((resolve, reject) => {
			if (Object.entries(newOrder).length === 0 && newOrder.constructor === Object) {
				reject(null);
			}
			else {
				resolve(newOrder);
			}
		})
	}


});


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