const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to database");

    }catch(error){
        console.log(error + "Error while connecting the database")
    }
}

module.exports = connectDB;