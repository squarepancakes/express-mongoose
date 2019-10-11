const express = require("express");
const router = express.Router();
const Kitten = require("../models/Kitten");

router.get("/", async (req, res, next) => {
	try {
		const litterOfKittens = await Kitten.find();
		res.send(litterOfKittens);
	} catch (err) {
		next(err);
	}
});

router.post("/new", async (req, res, next) => {
	try {
		const newKittenDetails = req.body;
		const newKitten = new Kitten(newKittenDetails);
		await Kitten.init();
		const oneKitten = await newKitten.save();
		res.send(oneKitten);
	} catch (err) {
		if (err.name === "MongoError" && err.code === 11000) {
			err.status = 400;
		}
		if (err.name === "ValidationError") {
			err.status = 400;
		}
		next(err);
	}
});

router.get("/:name", async (req, res, next) => {
	try {
		const nameOfKitten = req.params.name;
		const regex = new RegExp(nameOfKitten, "gi");
		const oneKitten = await Kitten.find({ name: regex });
		res.send(oneKitten);
	} catch (err) {
		next(err);
	}
});

router.get("/", async (req, res, next) => {
	try {
		const kitten = await Kitten.find(req.query);
		res.send(kitten);
	} catch (err) {
		next(err);
	}
});

router.put("/:name", async (req, res, next) => {
	try {
		const nameOfKitten = req.params.name;
		const newDetailsOfKitten = req.body;
		const regex = new RegExp(nameOfKitten, "gi");
		const query = { name: regex };
		const replaceKitten = await Kitten.findOneAndReplace(
			query,
			newDetailsOfKitten,
			{ new: true }
		);
		res.send(replaceKitten);
	} catch (err) {
		next(err);
	}
});

router.patch("/:name", async (req, res, next) => {
	try {
		const nameOfKitten = req.params.name;
		const newDetailsOfKitten = req.body;
		const regex = new RegExp(nameOfKitten, "gi");
		const query = { name: regex };
		const updateKitten = await Kitten.findOneAndUpdate(
			query,
			newDetailsOfKitten,
			{ new: true }
		);
		res.send(updateKitten);
	} catch (err) {
		next(err);
	}
});

// router.delete("/:name", async (req, res, next) => {
// 	try {
// 		const nameOfKitten = req.params.name;
// 		const regex = new RegExp(nameOfKitten, "gi");
// 		const oneKitten = await Kitten.find({ name: regex });
// 		const query = {id: oneKitten.id};
// 		console.log(oneKitten.id);
// 		const deleteKitten = await Kitten.findByIdAndDelete(query);
// 		res.send(deleteKitten);
// 	}
// 	catch (err) {
// 		next(err)
// 	}
// })
router.delete("/:name", async (req, res, next) => {
	try {
		const nameOfKitten = req.params.name;
		const regex = new RegExp(nameOfKitten, "gi");
		const query = { name: regex };
		const deleteKitten = await Kitten.findOneAndDelete(query);
		res.send(deleteKitten);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
