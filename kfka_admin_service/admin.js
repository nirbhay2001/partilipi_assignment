require("dotenv").config();
const express = require("express");
const { Kafka } = require('kafkajs');

const app = express();
const port = process.env.PORT || 3000;

const kafka = new Kafka({
  clientId: 'admin-service',
  brokers: ['kafka:9092'],
});

const admin = kafka.admin();

const waitForKafka = async (maxRetries = 15, delayMs = 5000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await admin.connect();
      const topics = await admin.listTopics();
      console.log(`fafka broker is ready. Topics available: ${topics}`);
      return;
    } catch (error) {
      if (error.message.includes("There is no leader for this topic-partition")) {
        console.error(`attempt ${i + 1}: Kafka leader election in progress, retrying in ${delayMs / 1000} seconds...`);
      } else {
        console.error(`attempt ${i + 1}: Kafka broker not ready, retrying in ${delayMs / 1000} seconds...`);
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw new Error('Kafka broker not become ready in time.');
};

const createTopicWithRetry = async (topicName, numPartitions = 3, retries = 10) => {
  for (let i = 0; i < retries; i++) {
    try {
      await admin.createTopics({
        topics: [{ topic: topicName, numPartitions }],
      });
      console.log(`topic ${topicName} created`);
      return;
    } catch (error) {
      if (error.message.includes("there is no leader for this topic-partition")) {
        console.error(`attempt ${i + 1}: leader election in progress, retrying in 5 seconds...`);
      } else {
        console.error(`attempt ${i + 1}: error creating topic ${topicName}:`, error);
      }
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }
  throw new Error(`failed to create topic ${topicName} after ${retries} attempts`);
};

const createAllTopics = async () => {
  try {
    console.log('wait for Kafka broker and leader election...');
    await waitForKafka(); 

    await createTopicWithRetry('notification', 3);
    await createTopicWithRetry('order_update', 3);
    await createTopicWithRetry('order_update_notification',2)
    await createTopicWithRetry('fetch_product_details',2)
    await createTopicWithRetry('sendProductDetails',2)
    await createTopicWithRetry('send_product_recommendation',2)
    await createTopicWithRetry('taskSchedular',2)
    

    console.log('all topic are created');
  } catch (error) {
    console.error('checcking error for createAllTopic function:', error);
  } finally {
    await admin.disconnect();
    console.log('checking disconnected broker');
  }
};

const start = async () => {
  await createAllTopics();
};

start();

setInterval(() => {
  console.log('kafka admin running..');
}, 10000);

app.listen(port, () => {
  console.log(`kafka admin server is running on  ${port}`);
});

