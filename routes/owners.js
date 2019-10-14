const express = require("express");
const router = express.Router();
const Owner = require("../models/Owner");
const jwt = require("jsonwebtoken");

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
		const decoded = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
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

router.post("/logout", (req, res) => {
	res.clearCookie("token").send("You are now logged out!");
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

		const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

		res.cookie("token", token);
		res.send(owner);
	} catch (err) {
		if (err.message === "Login failed") {
			err.status = 400;
		}
		next(err);
	}
});

const protectedRoute = (req, res, next) => {
	try {
		if (!req.cookies.token) {
			throw new Error("Go away!");
		}
		req.user = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
		next();
	} catch (err) {
		res.status(401).end();
	}
};

router.get("/:name", protectedRoute, async (req, res, next) => {
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
