const mongoose = require("mongoose");

const kittenSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		index: true,
		unique: true,
		minlength: 3
	},
	age: { type: Number, min: 0, max: 5 },
	sex: { type: String, enum: ["male", "female"] }
});

// creates a model - Kitten
const Kitten = mongoose.model("Kitten", kittenSchema);

module.exports = Kitten;
