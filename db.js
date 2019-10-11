const mongoose = require("mongoose");
const dbName = "test";
const dbURL = `mongodb://localhost/${dbName}`

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
