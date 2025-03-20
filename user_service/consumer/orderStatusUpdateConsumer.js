const { Kafka } = require('kafkajs');
const User = require('../models/userModel');
const {BackSendDetailsOfOrderStatus} = require("../producer/orderStatusUpdateProducer");

const kafka = new Kafka({
  clientId: 'user-service-consumer-orderStatusUpdate',
  brokers: ['kafka:9092'],
});
const consumer = kafka.consumer({ groupId: 'user-service-group-orderStatusUpdate' });
const consumeOrderUpdate = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'order_update', fromBeginning: true });
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

        const { userId, order_status } = parsedMessage;

        if (!userId) {
          console.error('message bina userId ke:', message.value.toString());
          return;
        }

        const user = await User.findById(userId);
        if (!user) {
          console.error(`user not found for this id: ${userId}`);
          return;
        }

        user.order_status = order_status;
        await user.save();
        console.log("user_service_consumer",user)

        await BackSendDetailsOfOrderStatus(user);
      },
    });

  } catch (error) {
    console.error('Error in Kafka Consumer:', error);
  }
};

module.exports = { consumeOrderUpdate };
