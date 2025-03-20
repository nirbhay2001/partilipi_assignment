const { Kafka } = require("kafkajs");
const recommendationProductNotification = require("../producer/recommendationProducer");
const axios = require("axios");

const kafka = new Kafka({
  clientId: "recommendation-service-consumer-sendrecommendation",
  brokers: ["kafka:9092"],
});

const consumer = kafka.consumer({ groupId: "send_recommendation" });

const fetchFakeStoreProducts = async () => {
  try {
    const response = await axios.get("https://fakestoreapi.com/products/");
    return response.data.map((product) => product.title);
  } catch (error) {
    console.error("Error fetching fakeStore products:", error);
    return [];
  }
};
const consumerecommendationProduct = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: "sendProductDetails", fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) {
          console.error("Received message is empty or null");
          return;
        }
        console.log("Received Kafka message:", message.value.toString());
        let parsedMessage;
        try {
          parsedMessage = JSON.parse(message.value.toString());
        } catch (error) {
          console.error("Invalid message format:", message.value.toString());
          return;
        }
        const { userId, email, purchase_history } = parsedMessage;
        if (!userId) {
          return;
        }
        const purchasedTitles = Array.isArray(purchase_history)
          ? purchase_history.map((p) => p.title)
          : [];
        if (purchasedTitles.length === 0) {
          await recommendationProductNotification(userId, email,["Welcome! Browse our products and find your next favorite item."]);
          return;
        }
        const fakeStoreTitles = await fetchFakeStoreProducts();
        const recommendedTitles = fakeStoreTitles.filter((title) => purchasedTitles.includes(title));
        if (recommendedTitles.length > 0) {
          await recommendationProductNotification(userId, email, recommendedTitles);
          console.log(`sent recommendations for user ${userId}:`, recommendedTitles);
        } else {
          await recommendationProductNotification(userId, email, ["We found no similar products, but check out our latest arrivals!"]);
          console.log(`no matching recommendations found for user ${userId}, sent generic message.`);
        }
      },
    });
  } catch (error) {
    console.error("Error in Kafka Consumer:", error);
  }
};

module.exports = { consumerecommendationProduct };
