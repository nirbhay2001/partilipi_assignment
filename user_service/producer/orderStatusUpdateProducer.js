const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'user-service-producer-orderStatusUpdate',
  brokers: ['kafka:9092'],
});

const producer = kafka.producer();

const connectProducer = async () => {
  if (!producer.isConnected) {
    await producer.connect();
    producer.isConnected = true;
  }
};

const BackSendDetailsOfOrderStatus = async (user) => {
  try {
    await connectProducer();

    const message = {
      user: {
        _id: user._id,
        email: user.email,
      },
      content: `Your Order is ${user.order_status}`,
      timestamp: new Date().toISOString(),
    };

    await producer.send({
      topic: 'order_update_notification', 
      messages: [
        {
          key: 'order_status_notification',
          value: JSON.stringify(message),
        },
      ],
    });

  } catch (err) {
    console.error('error sending message to Kafka:', err);
  }
};

module.exports = { BackSendDetailsOfOrderStatus };
