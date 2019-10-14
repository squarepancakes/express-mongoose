const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");


// cookie parser
app.use(cookieParser());

// body parser
app.use(express.json());

if (process.env.NODE_ENV !== "test") {
	// connect to db, not in use
	require("./db");
}

// set CORS, usually by a library
app.use((req, res, next) => {
	res.set("Access-Control-Allow-Credentials", true);
	res.set("Access-Control-Allow-Headers", "content-type");
	res.set("Access-Control-Allow-Origin", "http://localhost:3000");
	next();
});

// create routes
const index = require("./routes/index");
app.use("/", index);

const kittens = require("./routes/kittens");
app.use("/kittens", kittens);

const owners = require("./routes/owners");
app.use("/owners", owners);

module.exports = app;
