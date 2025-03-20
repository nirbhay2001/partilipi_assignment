const { Kafka } = require('kafkajs');
const Notification = require('../models/notificationModel');
const sendEmailNotification = require('../sendingMessage/emailService');

const kafka = new Kafka({
  clientId: 'register',
  brokers: ['kafka:9092'],
});

const consumer = kafka.consumer({ groupId: 'register_1' });

const connectConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'notification', fromBeginning: true });
  } catch (error) {
    console.error('topic subscribe na hone per aane wala error:', error);
    throw error; 
  }
};

const consumeMessages = async () => {
  try {
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`received message from toic: ${topic}, and partition: ${partition}`);

        try {
          const data = JSON.parse(message.value.toString());
          const { user, content } = data;
          if (!user || !user._id || !user.email) {
            throw new Error('invalid user in message ');
          }
          const newNotification = new Notification({
            userId: user._id,
            type: 'other',
            content: content,
          });

          await newNotification.save();
          const subject = "🎉 Welcome to join our plateform! Let’s Get Started";
          await sendEmailNotification(user.email, subject, content, newNotification._id);
        } catch (error) {
          console.error('processing karte time ka error:', error);
        }
      },
    });
  } catch (error) {
    console.error('running consumer error:', error);
  }
};
const startRegisterConsumer = async () => {
  try {
    await connectConsumer();
    await consumeMessages();
  } catch (error) {
    console.error(' starting Kafka consumer error:', error);
  }
};

module.exports = { startRegisterConsumer };
