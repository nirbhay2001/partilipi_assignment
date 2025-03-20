const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'user-service-producer-register',
  brokers: ['kafka:9092'],
});

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
};

const sendUserRegistrationMessage = async (user) => {
  try {
    await connectProducer(); 

    const message = {
      user: user,
      content: 'You registered successfully',
      timestamp: new Date().toISOString(),
    };

    await producer.send({
      topic: 'notification',  
      messages: [
        {
          key: 'register_user', 
          value: JSON.stringify(message),
        },
      ],
    });

  } catch (err) {
    console.error('error sending message to Kafka:', err);
  }
};

module.exports = { sendUserRegistrationMessage };
