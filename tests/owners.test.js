const app = require("../app");
const Owner = require("../models/Owner");
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken");

describe("owners", () => {
	let mongoServer;

	beforeAll(async () => {
		try {
			mongoServer = new MongoMemoryServer();
			const mongoUri = await mongoServer.getConnectionString();

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
		await Owner.create([
			{ firstName: "Strawberry", username: "strawberry", password: "1234567" },
			{ firstName: "Raspberry", username: "raspberry", password: "1234567" }
		]);
	});

	afterEach(async () => {
		jest.resetAllMocks();
		await Owner.deleteMany();
	});

	describe("POST / owners/new", () => {
		it("should add a new owner", async () => {
			const { body: owner } = await request(app)
				.post("/owners/new")
				.send({ username: "blueberry", password: "1234567" })
				.expect(200);

			expect(owner.username).toBe("blueberry");
			expect(owner.password).not.toBe("1234567");
		});
	});

	describe("POST /owners/login", () => {
		it("should login if password is correct", async () => {
			await request(app)
				.post("/owners/login")
				.send({ username: "strawberry", password: "1234567" })
				.expect(200);
		});

		it("should not login if password is incorrect", async () => {
			await request(app)
				.post("/owners/login")
				.send({ username: "strawberry", password: "banana" })
				.expect(400);
		});
	});

	describe("GET /owners/:name - protected routes", () => {
		it("denies access when owner is not authorized", async () => {
			await request(app)
				.get("/owners/strawberry")
				.expect(401);
			expect(jwt.verify).not.toHaveBeenCalledTimes(1);
		});
		it("denies access when owner is not authorized", async () => {
			jwt.verify.mockImplementation(() => {
				throw new Error();
			});
			await request(app)
				.get("/owners/strawberry")
				.set("Cookie", "token=invalid-token")
				.expect(401);
			expect(jwt.verify).toHaveBeenCalledTimes(1);
		});

		it("grants access when owner is authorized", async () => {
			jwt.verify.mockReturnValueOnce({});
			await request(app)
				.get("/owners/strawberry")
				.set("Cookie", `token=some-token`)
				.expect(200);
			expect(jwt.verify).toHaveBeenCalledTimes(1);
		});
	});

	describe("GET /owners", () => {
		it("GET / should return list of owners", async () => {
			jwt.verify.mockReturnValueOnce({});
			const expectedOwners = [
				{ username: "strawberry" },
				{ username: "raspberry" }
			];

			const { body: actualOwners } = await request(app)
				.get("/owners")
				.set("Cookie", `token=some-token`)
				.expect(200);
			expectedOwners.forEach((owner, index) => {
				expect(actualOwners[index]).toEqual(expect.objectContaining(owner));
			});
		});
	});
});
