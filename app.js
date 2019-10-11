const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');

// cookie parser
app.use(cookieParser());


// const cookieMonster = (req, res, next) => {
// 	//"returns fruit=orange"
// 	if (req.headers.cookie) {
// 		const theCookie = req.headers.cookie.split("=");
// 		newCookie += `{"${theCookie[0]}":"${theCookie[1]}"}`;
// 		let jsoncookie = JSON.parse(newCookie);
// 		req.cookies = jsoncookie;
// 	}
// 	next();
// };

// app.use(cookieMonster());

// body parser
app.use(express.json());

if (process.env.NODE_ENV !== "test") {
	// connect to db, not in use
	require("./db");
}

// create routes
const index = require("./routes/index");
app.use("/", index);

const kittens = require("./routes/kittens");
app.use("/kittens", kittens);

const owners = require("./routes/owners");
app.use("/owners", owners);

module.exports = app;
