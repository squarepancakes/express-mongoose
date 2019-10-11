const app = require("../app");
const Kitten = require("../models/Kitten");
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("Kittens", () => {
	let mongoServer;
	beforeAll(async () => {
		try {
			mongoServer = new MongoMemoryServer();
			const mongoUri = await mongoServer.getConnectionString();
			// connect to server before setting.
			
			mongoose.set("useNewUrlParser", true);
			mongoose.set("useFindAndModify", false);
			mongoose.set("useCreateIndex", true);
			mongoose.set("useUnifiedTopology", true);
			await mongoose.connect(mongoUri);
		} catch (err) {
			console.error(err);
		}
	});
	afterAll(async () => {
		await mongoose.disconnect();
		await mongoServer.stop();
	});

	beforeEach(async () => {
		await Kitten.create([
			{ name: "Fluff", age: 3, sex: "male" },
			{ name: "Duff", age: 3, sex: "female" },
			{ name: "Puff", age: 5, sex: "female" }
		]);
	});

	afterEach(async () => {
		await Kitten.deleteMany();
	});

	describe("GET /kittens", () => {
		it("GET/ get all kittens", async () => {
			const expectedKittens = [
				{ name: "Fluff", age: 3, sex: "male" },
				{ name: "Duff", age: 3, sex: "female" },
				{ name: "Puff", age: 5, sex: "female" }
			];
			const { body: actualKittens } = await request(app)
				.get("/kittens")
				.expect(200);
			expectedKittens.forEach((kitten, index) => {
				expect(actualKittens[index]).toEqual(expect.objectContaining(kitten));
			});
		});
	});

	describe("POST /kittens", () => {
		it("should add a new kitten", async () => {
			const newKitten = { name: "Muff", age: 4, sex: "female" };
			await request(app)
				.post("/kittens/new")
				.send(newKitten)
				.expect(200)
				.expect(({ body: actualKittens }) => {
					expect(actualKittens).toEqual(expect.objectContaining(newKitten));
				});
		});
	});
	describe("PUT /kittens", () => {
		it("should replace a kitten", async () => {
			const newKittenDetails = { name: "Muff", age: 4, sex: "female" };
			await request(app)
				.put("/kittens/fluff")
				.send(newKittenDetails)
				.expect(200)
				.expect(({ body: actualKittens }) => {
					expect(actualKittens).toEqual(
						expect.objectContaining(newKittenDetails)
					);
				});
		});
	});
	
	describe("PATCH /kittens", () => {
		it("should edit a kitten", async () => {
			const newKittenDetails = {age: 5};
			await request(app)
				.patch("/kittens/fluff")
				.send(newKittenDetails)
				.expect(200)
				.expect(({ body: actualKittens }) => {
					expect(actualKittens).toEqual(
						expect.objectContaining({ name: "Fluff", age: 5, sex: "male" })
					);
				});
		});
	});



	describe("DELETE /kittens", () => {
		it("should delete a kitten", async () => {
			const deleteKitten = { name: "Puff", age: 5, sex: "female" };
			await request(app)
				.delete("/kittens/puff")
				.send(deleteKitten)
				.expect(200)
				.expect(({ body: actualKittens }) => {
					expect(actualKittens).toEqual(expect.objectContaining(deleteKitten));
				});
		});
	});
});
