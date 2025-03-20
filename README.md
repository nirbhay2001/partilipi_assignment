### **🏗 Video Demo**

[![Watch the video](https://res.cloudinary.com/dtqnwfxnx/image/upload/v1742492103/thumbnail_pr_coy8yv.png)](https://res.cloudinary.com/dtqnwfxnx/video/upload/v1742491912/pratilipi_assignment_video_1_cmzrvj.mp4)


## 🚀 Key Features  

<p style="font-size: 1.1em;">✔ <b>GraphQL API Gateway</b> for handling all client requests</p>  
<p style="font-size: 1.1em;">✔ <b>Microservices Architecture</b> with independent services</p>  
<p style="font-size: 1.1em;">✔ <b>JWT Authentication</b> for secure communication</p>  
<p style="font-size: 1.1em;">✔ <b>Kafka for Event-Driven Architecture</b></p>  
<p style="font-size: 1.1em;">✔ <b>Dockerized Services</b> running in a shared network</p>  
<p style="font-size: 1.1em;">✔ <b>Automated Notifications and Scheduling</b></p>  
<p style="font-size: 1.1em;">✔ <b>Caching Mechanism</b> for improved performance and reduced latency</p>  
<p style="font-size: 1.1em;">✔ <b>Monitoring for Message Queues/Streams</b> to track and analyze system health</p>  
<p style="font-size: 1.1em;">✔ <b>Retry Mechanism</b> for handling failed message deliveries in Kafka</p>  
<p style="font-size: 1.1em;">✔ <b>User Purchase Flow</b> allowing users to buy products seamlessly</p>  
<p style="font-size: 1.1em;">✔ <b>Order Updates</b> with real-time tracking and notifications</p>  
<p style="font-size: 1.1em;">✔ <b>Personalized Product Recommendations</b> based on previous purchases</p>  
<p style="font-size: 1.1em;">✔ <b>User Registration & Authentication</b> with secure JWT tokens</p>  
<p style="font-size: 1.1em;">✔ <b>User Preferences Management</b> for tailored notifications and recommendations</p>  

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js, GraphQL, REST API, Cron job, Kafka monitoring tools  
- **Authentication:** JWT  
- **Messaging Queue:** Apache Kafka  
- **Database:** MongoDB, Redis  
- **Containerization:** Docker, Docker Compose  
- **API Testing:** Postman, GraphQL Playground


## 🔧 Setup Instructions

This project consists of multiple microservices running in separate Docker containers, all connected through a shared **Docker network**. Each microservice has its own `.env` file for managing environment variables.

### Steps to Set Up the Project:

1. Clone the repository:  
   ```sh
   git clone <https://github.com/nirbhay2001/partilipi_assignment/tree/main>
   cd <project-folder>

2. Environment Variables 
Each microservice has its own `.env` file with the following variables:  

### **User Service (`user_service/.env`)**
```sh
PORT=<your-port>
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
```
### **Order Service (`order_service/.env`)**
```sh
PORT=<your-port>
```
### **Recommendation Service (`recommendation_service/.env`)**
```sh
PORT=<your-port>
```
### **Scheduler Service (`scheduler_service/.env`)**
```sh
PORT=<your-port>
```
### **Notification Service (`notification_service/.env`)**
```sh
PORT=<your-port>
MONGO_URI=<your-mongodb-uri>
SMTP_SERVICE=<your-smtp-service>
SMTP_MAIL=<your-email>
SMTP_PASSWORD=<your-email-password>
SMTP_HOST=<your-smtp-host>
SMTP_PORT=<your-smtp-port>
```
### **Kafka Admin Service (`kafka_admin_service/.env`)**
```sh
PORT=<your-port>
KAFKA_BROKER=<your-kafka-broker>
```
### **GraphQL Gateway (`graphql_gateway/.env`)**
```sh
PORT=<your-port>
JWT_SECRET=<your-jwt-secret>
```
3. Finally run the command to start project
```sh
docker-compose up
```
### **🏗 Architecture**

![Architecture](https://res.cloudinary.com/dtqnwfxnx/image/upload/v1742490007/image_nirbhay_nluujh.jpg )

### **Note:** email check in spam also. my some message send in spam message

## **📜 Microservices Overview**
## **1. 🚀 GraphQL API Gateway**

The GraphQL API Gateway acts as a bridge between the client and multiple microservices. It handles authentication, authorization, and request routing while aggregating data from various services into a single GraphQL endpoint.

📡 Unified API – Single entry point for all services
🔒 Authentication & Authorization – Ensures secure access
⚡ Efficient Data Fetching – Reduces multiple API calls
🔄 Service Routing – Manages requests to different microservices

## **2.👤 User Service**
🔐 Handles User Registration & Authentication
🔑 Generates & Verifies JWT Tokens
⚙️ Stores & Manages User Preferences
![user_service](https://res.cloudinary.com/dgejijgss/image/upload/v1742504551/user_service_kbx94u.jpg)
## **3.📦 Order Service**
The Order Service manages order status updates when a user purchases a product.

🚀 How It Works:
1️⃣ A user places an order, and the request is sent to the GraphQL API Gateway along with a token.
2️⃣ The Gateway authenticates the request, extracts the user ID, and forwards it to the Order Service.
3️⃣ The Order Service sends an order status update to a Kafka Broker.
4️⃣ The User Service consumes this message, retrieves user details, and sends order status + email to Kafka.
5️⃣ The Notification Service consumes the message, saves the data, and sends an email to the user.
![order_service](https://res.cloudinary.com/dgejijgss/image/upload/v1742504472/zgec7r50zz7f1ufpacqk.jpg)

## **3.🔍 Recommendation Service**
The Recommendation Service suggests products to users based on their purchase history.

🚀 How It Works:
1️⃣ A request is sent to the GraphQL API Gateway, which authenticates the user and extracts their ID.
2️⃣ The Recommendation Service sends this ID to a Kafka Broker.
3️⃣ The User Service consumes the message, retrieves the user's purchase history, and sends the data back to Kafka.
4️⃣ The Recommendation Service processes this data, fetches relevant product suggestions using a third-party API, and sends the recommendations to Kafka.
5️⃣ The Notification Service consumes the message, saves the recommendations in the database, and sends an email to the user.
![recommendation_service](https://res.cloudinary.com/dgejijgss/image/upload/v1742504524/recommendation_service_t3xkkt.jpg)

## **4.⏳ Scheduler Service**
The Scheduler Service automates promotional product recommendations using cron jobs.

🚀 How It Works:
1️⃣ The GraphQL API Gateway sends user ID and email after authentication.
2️⃣ A cron job runs every 5 minutes, fetching promotional products from a third-party API.
3️⃣ The service sends the promotion data, user ID, and email to a Kafka Broker.
4️⃣ The Notification Service consumes the message, stores it in the database, and sends an email to the user.
![schedule_service](https://res.cloudinary.com/dgejijgss/image/upload/v1742504538/schedule_service_tktyk6.jpg)
## **5.🔔 Notification Service**
The Notification Service handles user notifications efficiently.

🚀 How It Works:
1️⃣ Consumes messages from Kafka Broker.
2️⃣ Stores notifications in the database.
3️⃣ Sends email notifications to users.
4️⃣ Includes a read status field (false by default), which updates to true when a notification is read.
## **6.📡 Kafka Admin Service**
The Kafka Admin Service is responsible for managing Kafka topics and partitions efficiently.

🚀 Key Features:
1️⃣ Handles topic and partition creation within the Kafka broker.
2️⃣ Implements a retry mechanism to ensure seamless topic creation.
3️⃣ Prevents failures by continuously retrying until the Kafka broker leader is ready.

🔹 Ensures fault tolerance and smooth Kafka topic management.

