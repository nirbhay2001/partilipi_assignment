const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "recommendation-service-send_product",
  brokers: ["kafka:9092"],
});

const producer = kafka.producer();
const recommendationProductNotification = async (
  userId,
  email,
  recommendedTitles
) => {
  try {
    await producer.connect();

    if (!userId || recommendedTitles.length === 0) {
      console.log("No recommendations available for user:", userId);
      return;
    }
    const message = {
      user: {
        _id: userId,
        email: email,
      },
      content: `based on your previous purchases, you might also like: ${recommendedTitles.join(
        ", "
      )}`,
      timestamp: new Date().toISOString(),
    };

    await producer.send({
      topic: "send_product_recommendation",
      messages: [
        {
          key: "send_product_recommendation_history",
          value: JSON.stringify(message),
        },
      ],
    });
    await producer.disconnect();
  } catch (error) {
    console.error("error in recommendationProductNotification:", error);
    throw error;
  }
};

module.exports = recommendationProductNotification;
