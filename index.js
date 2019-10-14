require("dotenv").config();

const app = require("./app");
// process.env.NODE_ENV = app.get("env")
const env = app.get("env");

let port;
if (app.get("env") === "development") {
	port = 5000;
}

app.listen(port, () => {
	console.log(`Listening on ${port} in ${env} mode`);
});
