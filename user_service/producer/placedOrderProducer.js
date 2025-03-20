const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'user-service-producer-placeOrderUpdate',
  brokers: ['kafka:9092'],
});

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
};

const sendMessageForOrderPlaced = async (user) => {
  try {
    await connectProducer(); 

    const message = {
      user: user,
      content: 'Your Order is Placed and further update about the product will be available through mail',
      timestamp: new Date().toISOString(),
    };

    await producer.send({
      topic: 'order_update',  
      messages: [
        {
          key: 'placed_order', 
          value: JSON.stringify(message),
        },
      ],
    });
  } catch (err) {
    console.error('error sending message to Kafka:', err);
  }
};

module.exports = { sendMessageForOrderPlaced };
