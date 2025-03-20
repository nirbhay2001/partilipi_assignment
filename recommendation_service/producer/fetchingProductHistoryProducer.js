const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "recommendation-service-produceId",
  brokers: ["kafka:9092"],
});

const producer = kafka.producer();

const ProduceIdForDetailsFetching = async (userId) => {
  try {
    await producer.connect();
    const message = JSON.stringify({ userId });
    await producer.send({
      topic: "fetch_product_details",
      messages: [{ key: "fetch_product", value: message }],
    });
    await producer.disconnect();
  } catch (error) {
    console.error("error in orderUpdateStatus:", error);
    throw error;
  }
};

module.exports = ProduceIdForDetailsFetching;
