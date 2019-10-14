const mongoose = require("mongoose");
const dbName = "kittens-db";

let dbURL;
if (process.env.NODE_ENV === "development") {
	dbURL = `mongodb://localhost/${dbName}`;
}

if (process.env.NODE.ENV === "production") {
	dbURL = process.env.MONGO_URI;
	console.log("MONGO_URI", process.env.MONGO_URI);
	console.log("dbUrl", dbURL);
}

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

mongoose.connect(dbURL);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function() {
	console.log("Mongoosing on MongoDB");
});

module.exports = db;
