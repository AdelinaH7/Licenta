const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes");
const db = require("./config/db");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8080;

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(bodyParser.json({ limit: "10mb" })); // Set the payload size limit to 10 megabytes

app.use(bodyParser.json());

db.authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error: " + err));

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
