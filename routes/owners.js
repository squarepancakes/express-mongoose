const express = require("express");
const router = express.Router();
const Owner = require("../models/Owner");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "pies of a family";

router.get("/", async (req, res, next) => {
	try {
		const groupOfOwners = await Owner.find();
		res.send(groupOfOwners);
	} catch (err) {
		next(err);
	}
});

router.get("/secret", async (req, res, next) => {
	try {
		if (!req.cookies.token) {
			throw new Error("Go away!");
		}
		const decoded = jwt.verify(req.cookies.token, SECRET_KEY);
		res.send("username: " + decoded.name);
	} catch (err) {
		err.status = 401;
	}
});

router.post("/new", async (req, res, next) => {
	try {
		const newOwnerDetails = req.body;
		const newOwner = new Owner(newOwnerDetails);

		await Owner.init();
		const oneOwner = await newOwner.save();
		res.send(oneOwner);
	} catch (err) {
		next(err);
	}
});

router.post("/login", async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const owner = await Owner.findOne({ username });
		const bcrypt = require("bcryptjs");
		const result = await bcrypt.compare(password, owner.password);
		if (!result) {
			throw new Error("Login failed");
		}

		const payload = { name: owner.username };

		const token = jwt.sign(payload, SECRET_KEY);

		res.cookie("token", token);
		res.send(owner);
	} catch (err) {
		if (err.message === "Login failed") {
			err.status = 400;
		}
		next(err);
	}
});

router.get("/:name", async (req, res, next) => {
	try {
		const firstName = req.params.name;
		const regex = new RegExp(firstName, "gi");
		const oneOwner = await Owner.find({ firstName: regex });
		const person = {
			fullName: `${oneOwner[0].salutation} ${oneOwner[0].firstName} ${oneOwner[0].lastName}`
		};
		res.send(person);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
