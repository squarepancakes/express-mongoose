const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ownerSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	salutation: { type: String, enum: ["Mr", "Mrs", "Ms", "Miss", "Mdm"] },
	username: { type: String, required: true, minlength: 4, unique: true },
	password: { type: String, required: true, minlength: 7, select: true }
});

ownerSchema.pre("save", async function(next) {
	const rounds = 10;
	const password = this.password;
	this.password = await bcrypt.hash(password, rounds);
	next();
});

// instance method
ownerSchema.virtual("fullName").get(function() {
	return `${this.salutation} ${this.firstName} ${this.lastName}`;
});

const Owner = mongoose.model("Owner", ownerSchema);

module.exports = Owner;
