const express = require("express");
const firebase = require("firebase-admin");
const firestore = firebase.firestore();

const router = express.Router();

router.post
	(
		"/:restaurantId/dishRestDetails",
		async (req, res) => {
			const restId = req.params.restaurantId;
			console.log(restId);
			const dishIdArr = req.body.dishes;

			const restDetail = await firestore
				.collection("restaurants")
				.doc(restId)
				.get()
				.then((querySnapshot) => querySnapshot.data());
			const dishDetails = restDetail.dishes.filter(dish => dishIdArr.indexOf(dish.id) > -1);
			res.status(200).send({ "dishRestDetails": dishDetails });


		}
	);

router.post("/:restaurantId/order", async (req, res) => {
	const restId = req.params.restaurantId;
	console.log(restId);
	const restDishArr = req.body.restDish;
	console.log(restDishArr);

	const cus_name = req.body.cus_name;
	console.log(cus_name);

	const cus_phoneno = req.body.cus_phoneno;
	console.log(cus_phoneno);

	const d = new Date();
	const t = d.getTime();
	const id = t - 300;
	const data = {
		order_id: id,
		cus_name: cus_name,
		cus_phoneno: cus_phoneno,
		order_Date: d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear(),
		order_Time: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
		order_detail: restDishArr
	};
	console.log(data);
	const orderRef = await firestore.collection("orders").add(data);
	console.log('Set: ', orderRef);
	res.redirect('/')

});

module.exports = router;