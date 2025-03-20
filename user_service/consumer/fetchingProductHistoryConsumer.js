const { Kafka } = require('kafkajs');
const User = require('../models/userModel');
const sendProductHistory = require("../producer/sendProductHistoryProducer");

const kafka = new Kafka({
  clientId: 'user-service-consumer-sendProductHistory',
  brokers: ['kafka:9092'],
});
const consumer = kafka.consumer({ groupId: 'user_service_group_sendProductHistory' });
const consumerFetchingProductHistory = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'fetch_product_details', fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) {
          console.error('received message is empty or null');
          return;
        }

        let parsedMessage;
        try {
          parsedMessage = JSON.parse(message.value.toString());
        } catch (error) {
          console.error('invalid message format:', message.value.toString());
          return;
        }
        const { userId } = parsedMessage;
        if (!userId) {
          console.error('message bina userId ke:', message.value.toString());
          return;
        }
        const user = await User.findById(userId);
        if(!user){
            throw new Error("user not found")
        }
        const purchaseHistoryProducts = user.purchase_history?.map(history => history.products).flat() || []
        await sendProductHistory(purchaseHistoryProducts,user._id,user.email);
      },
    });

  } catch (error) {
    console.error('Error in Kafka Consumer:', error);
  }
};

module.exports = { consumerFetchingProductHistory };
