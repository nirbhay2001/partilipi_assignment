const { Kafka } = require("kafkajs");
const axios = require("axios")
const cron = require("node-cron");

const kafka = new Kafka({
  clientId: "user-service-producer-sendProductHistory",
  brokers: ["kafka:9092"],
});

const producer = kafka.producer()
let index = 0

const connectProducer = async()=>{
    await producer.connect()
}

const fetchAndSendProduct = async(id,email)=>{
    try{
        const response = await axios.get("https://fakestoreapi.com/products/")
        const products = response.data
        console.log("response",response)
        console.log("products",products)
        if(!products || products.length === 0){
            console.log("no product")
            return
        }
        if(index >= products.length){
            index = 0
        }
        const product = products[index]
        index++
        console.log("id",id)
        console.log("email",email)
        const message = {
            user: {
                _id: id,
                email: email,
            },
            content: `Check out this products: ${product.title}`,
            timestamp: new Date().toISOString(),
        };
        console.log("product.title",product.title)
        await producer.send({
            topic: "taskSchedular",
            messages: [{key:'promotiontaskschedular',value: JSON.stringify(message)}]
        })

    }catch(error){
        console.error("error fetching and sending to kafka broker:",error)
    }
};
const startSchedular = async (id,email)=>{
    await connectProducer()
    cron.schedule("*/5 * * * *",async()=>{
        console.log("Running cron job for user:", id);
        console.log("Running cron for user")
        await fetchAndSendProduct(id,email)
        console.log("after fetchAndSendProduct")
    })
}
module.exports = {startSchedular}



