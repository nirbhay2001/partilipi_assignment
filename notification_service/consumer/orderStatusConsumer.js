const { Kafka } = require('kafkajs');
const Notification = require('../models/notificationModel');
const sendEmailNotification = require('../sendingMessage/emailService');

const kafka = new Kafka({
  clientId: 'notification-service-consumer-orderStatusUpdate',
  brokers: ['kafka:9092'],
});

const consumer = kafka.consumer({ groupId: 'notification-group-orderStatus' });

const connectConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order_update_notification', fromBeginning: true }); 
};

const consumeMessages = async () => {
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`received message from topic: ${topic}, and partion: ${partition}`);

      if (!message.value) {
        console.error('received message empty or null');
        return;
      }

      let data;
      try {
        data = JSON.parse(message.value.toString());
      } catch (error) {
        console.error('Invalid format:', message.value.toString());
        return;
      }

      const { user, content } = data;

      if (!user || !user._id || !content) {
        console.error('Invalid user or content:', data);
        return;
      }

      try {
        const newNotification = new Notification({
          userId: user._id,
          type: 'order_update',
          content: content,
        });

        await newNotification.save();
        const subject = "📦 Your Order is Almost Ready to Ship!";
        await sendEmailNotification(user.email, subject, content, newNotification._id);
      } catch (error) {
        console.error('save karte time ka error:', error);
      }
    },
  });
};

const startOrderStatusConsumer = async () => {
  await connectConsumer();
  await consumeMessages();
};

module.exports = { startOrderStatusConsumer };








