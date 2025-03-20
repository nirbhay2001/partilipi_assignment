const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'order-service-producer-orderStatusUpdate',
  brokers: ['kafka:9092'],
});
const producer = kafka.producer();
const orderUpdateStatus = async (userId, order_status) => {
  try {
    await producer.connect();

    const message = JSON.stringify({ userId, order_status });

    await producer.send({
      topic: 'order_update',
      messages: [{ key: 'orderstatus', value: message }],
    });

    await producer.disconnect();
  } catch (error) {
    console.error("error in orderUpdateStatus:", error);
    throw error;
  }
};

module.exports = orderUpdateStatus;

