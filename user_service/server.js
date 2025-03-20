require("dotenv").config();
const express = require("express");
const connectDB = require("./db/conn.js");
const userRoutes = require("./routes/userRoute");
const { consumeOrderUpdate } = require('./consumer/orderStatusUpdateConsumer.js');
const {consumerFetchingProductHistory} = require('./consumer/fetchingProductHistoryConsumer.js')

const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 5000;

connectDB();

setTimeout(()=>{
  consumeOrderUpdate();
  consumerFetchingProductHistory();
},120000)


app.use(cors({
  origin: [],
  methods: ['POST', 'GET', 'HEAD', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


