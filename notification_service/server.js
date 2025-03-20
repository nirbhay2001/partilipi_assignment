require("dotenv").config();
const express = require("express");
const connectDB = require("./db/conn.js");
const notificationRoutes = require("./routes/notificationRoute");
const { startRegisterConsumer } = require('./consumer/registerConsumer.js');
const {startOrderStatusConsumer} = require('./consumer/orderStatusConsumer.js')
const {startPlacedOrderConsumer} = require("./consumer/placedOrderConsumer.js")
const {startRecommendationProduct} = require('./consumer/recommandProductConsumer.js')
const {startTaskScheduling} = require('./consumer/taskSchedularNotificationConsumer.js')

const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 6000;

connectDB();

setTimeout(()=>{
  startRegisterConsumer();
  startOrderStatusConsumer();
  startPlacedOrderConsumer();
  startRecommendationProduct();
  startTaskScheduling();
},45000)

app.use(cors({
  origin: [],
  methods: ['POST', 'GET', 'HEAD', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api", notificationRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
