require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/configs/db");
const { PORT } = require("./src/configs/config");
const allRoutes = require("./app");

const app = express();
const port = PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://xenly.vercel.app",
    ],
    credentials: true,
  }),
);

connectDB().catch((err) => {
  console.error("DB INIT FAILED:", err.message);
});


app.get("/", (req, res) =>
  res.send("Xenon Media v2 Connected With Server & MongoDB"),
);
app.use("/api/v2", allRoutes);

app.listen(port, () => {
  console.log(`Mongoose Server running on port ${port}`);
});

module.exports = app;
