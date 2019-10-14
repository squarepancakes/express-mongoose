require("dotenv").config();

const app = require("./app");
// process.env.NODE_ENV = app.get("env")
const env = app.get("env");

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`Listening on ${port} in ${env} mode`);
});
