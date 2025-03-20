const { Kafka } = require('kafkajs');
const Notification = require('../models/notificationModel');
const sendEmailNotification = require('../sendingMessage/emailService');

const kafka = new Kafka({
  clientId: 'notification-service-consumer-placedOrderUpdate',
  brokers: ['kafka:9092'],
});

const consumer = kafka.consumer({ groupId: 'notification-group-placeOrder' });

const connectConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order_update', fromBeginning: true });
};
const consumeMessages = async () => {
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`received message from topic: ${topic}, and partion: ${partition}`);

      const data = JSON.parse(message.value.toString());
      console.log('received kiya message from user_service:', data);

      const { user, content } = data;

      try {
        const newNotification = new Notification({
          userId: user._id,
          type: 'order_update',
          content: content,
        });

        await newNotification.save();
        const subject = "📢 Great News! Your Order is placed 🚀";

        await sendEmailNotification(user.email, subject, content, newNotification._id);
      } catch (error) {
        console.error('save karte time ka error:', error);
      }
    },
  });
};

const startPlacedOrderConsumer = async () => {
  await connectConsumer();
  await consumeMessages();
};
module.exports = {startPlacedOrderConsumer}
