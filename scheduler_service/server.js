require("dotenv").config();
const express = require("express");

const taskScheduler = require("./routes/schedulerRoute");

const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 9000;

app.use(cors({
  origin: [],
  methods: ['POST', 'GET', 'HEAD', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api", taskScheduler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
