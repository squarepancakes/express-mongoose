const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

if (process.env.NODE_ENV !== "test") {
	// connect to db, not in use
	require("./db");
}

// using cors library
const corsOptions = {
	credentials: true,
	allowedHeaders: "content-type",
	origin: "https://reacting-kittens.netlify.com"
};

app.use(cors(corsOptions));

// cookie parser
app.use(cookieParser());

// body parser
app.use(express.json());

// create routes
const index = require("./routes/index");
app.use("/", index);

const kittens = require("./routes/kittens");
app.use("/kittens", kittens);

const owners = require("./routes/owners");
app.use("/owners", owners);

module.exports = app;
