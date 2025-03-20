const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "user-service-producer-sendProductHistory",
  brokers: ["kafka:9092"],
});

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
};
const sendProductHistory = async (purchaseHistory,userId,email) => {
  try {
    await connectProducer();

    
    const message = {
        userId,
        email,
        purchase_history: purchaseHistory,
    };

    await producer.send({
      topic: "sendProductDetails",
      messages: [
        {
          key: "send_product",
          value: JSON.stringify(message),
        },
      ],
    });
  } catch (err) {
    console.error("error sending message to Kafka:", err);
  }
};

module.exports = sendProductHistory;
