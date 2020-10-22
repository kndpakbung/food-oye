const express = require("express");
const firebase = require("firebase-admin");
const firestore = firebase.firestore();

const router = express.Router();




router.post
(	
	"/:restId/dishRestDetails",
	async (req, res) =>
	{
		const restId = req.params.restId;		
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




module.exports = router;