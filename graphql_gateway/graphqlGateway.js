const { ApolloServer, gql } = require("apollo-server");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const redisClient = require("./redisClient.js");
const CACHE_TTL = 60 * 5;

const port = process.env.PORT || 4000;

const typeDefs = gql`
  input ProductInput {
    productId: ID!
    title: String!
    category: String!
  }

  type Product {
    productId: ID!
    title: String!
    category: String!
  }

  type PurchaseHistory {
    products: [Product!]!
    purchaseDate: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    preferences: [String!]!
    orders: [Product!]!
    order_status: String!
    purchase_history: [PurchaseHistory!]!
  }

  type Notification {
    id: ID!
    userId: ID!
    type: String!
    content: String!
    sentAt: String!
    read: Boolean!
  }

  type Query {
    getUserDetails: User
    getUserNotifications: [Notification!]!
    productRecommendation: String
  }

  type Mutation {
    registerUser(name: String!, email: String!, preferences: [String!]!): User
    updateUserPreferences(preferences: [String!]!): User
    placeOrder(products: [ProductInput!]!): User
    updateOrderStatus(order_status: String!): String
    taskSchedular: String
  }
`;

const resolvers = {
  Query: {
    getUserDetails: async (_, __, { user }) => {
      if (!user || !user.id)
        throw new Error("Unauthorized or invalid user object");
      const cachekey = `user:${user.id}`;
      try {
        const cachedUser = await redisClient.get(cachekey);
        if (cachedUser) {
          console.log("redis cache data");
          return JSON.parse(cachedUser);
        }
        const response = await axios.get(
          `http://userservice:5000/api/user/${user.id}`
        );
        const userData = response.data;

        if (!userData || !userData._id) {
          throw new Error("User not found or invalid ID");
        }
        const userObj = {
          id: userData._id,
          name: userData.name,
          email: userData.email,
          preferences: userData.preferences || [],
          order_status: userData.order_status || "none",
          orders: userData.orders?.filter((order) => order !== null) || [],
          purchase_history:
            userData.purchase_history?.filter((history) => history !== null) ||
            [],
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
        };

        await redisClient.setEx(cachekey, CACHE_TTL, JSON.stringify(userObj));
        return userObj;
      } catch (error) {
        console.error("Error fetching user details:", error);
        throw new Error("Error fetching user details");
      }
    },

    getUserNotifications: async (_, __, { user }) => {
      if (!user) {
        throw new Error("Unauthorized");
      }
      const cachekey = `notifications:${user.id}`;
      try {
        const cachedNotifications = await redisClient.get(cachekey);
        if (cachedNotifications) {
          return JSON.parse(cachedNotifications);
        }
        const response = await axios.get(
          `http://notificationservice:6000/api/get-notification/${user.id}`
        );
        console.log("response.data", response.data);
        console.log(
          "API Response Data:",
          JSON.stringify(response.data, null, 2)
        );

        if (!Array.isArray(response.data)) {
          throw new Error("Invalid response format from notification service");
        }
        const formattedNotifications = response.data.map((notification) => ({
          id: notification._id.toString(),
          userId: notification.userId.toString(),
          type: notification.type,
          content: notification.content,
          sentAt: new Date(notification.sentAt).toISOString(),
          read: Boolean(notification.read),
        }));

        await redisClient.setEx(
          cachekey,
          CACHE_TTL,
          JSON.stringify(formattedNotifications)
        );

        return formattedNotifications;
      } catch (error) {
        console.error("Error fetching notifications:", error);
        throw new Error("Failed to fetch notifications");
      }
    },

    productRecommendation: async (_, __, { user }) => {
      if (!user) {
        throw new Error("Unathorized");
      }
      try {
        const response = await axios.get(
          `http://recommendationservice:8000/api/product-recommendation/${user.id}`
        );
        if (response.status === 200) {
          return "product recommendation send successfully";
        } else {
          throw new Error("error come product recommendation send time");
        }
      } catch (error) {
        console.error("error regrading product recommendation", error);
        throw new Error("error recommendation product");
      }
    },
  },

  
  Mutation: {
    registerUser: async (_, { name, email, preferences }) => {
      try {
        const response = await axios.post(
          "http://userservice:5000/api/register",
          { name, email, preferences }
        );
        const user = {
          id: response.data.user?._id || "fallback-id",
          name: response.data.user?.name || "",
          email: response.data.user?.email || "",
          preferences: response.data.user?.preferences || [],
          orders: response.data.user?.orders || [],
          order_status: response.data.user?.order_status || "none",
          purchase_history: response.data.user?.purchase_history || [],
        };
        return user;
      } catch (error) {
        throw new Error("Error registering user");
      }
    },

    updateUserPreferences: async (_, { preferences }, { user }) => {
      if (!user) throw new Error("Unauthorized");

      try {
        const response = await axios.put(
          `http://userservice:5000/api/preferences/${user.id}`,
          { preferences }
        );

        const userData = response.data;

        return {
          id: userData?._id,
          name: userData?.name,
          email: userData?.email,
          preferences: userData?.preferences || [],
        };
      } catch (error) {
        console.error("Error updating preferences:", error);
        throw new Error("Error updating preferences");
      }
    },

    placeOrder: async (_, { products }, { user }) => {
      if (!user || !products || !Array.isArray(products)) {
        throw new Error("Invalid input data");
      }

      try {
        const response = await axios.put(
          `http://userservice:5000/api/placedorder/${user.id}`,
          { products }
        );

        console.log("response.data", response.data);
        console.log("response.data.user", response.data.user);

        return {
          id: response.data.user?._id,
          name: response.data.user?.name,
          email: response.data.user?.email,
          preferences: response.data.user?.preferences || [],
          order_status: response.data.user?.order_status || "none",
          orders:
            response.data.user?.orders?.filter((order) => order !== null) || [],
          purchase_history:
            response.data.user?.purchase_history?.filter(
              (history) => history !== null
            ) || [],
          createdAt: response.data.user?.createdAt,
          updatedAt: response.data.user?.updatedAt,
        };
      } catch (error) {
        console.error(
          "Error from User Service:",
          error.response?.data || error.message
        );
        throw new Error("failed to place order");
      }
    },
    updateOrderStatus: async (_, { order_status }, { user }) => {
      if (!user) throw new Error("Unathorized");
      try {
        const response = await axios.put(
          `http://orderservice:7000/api/order-update/${user.id}`,
          {
            order_status,
          }
        );
        if (response.status === 200) {
          return "Order Status updated Successfully";
        } else {
          throw new Error("Failed to update order status");
        }
      } catch (error) {
        console.error("error updating order status:", error);
        throw new Error("error updating order status");
      }
    },

    taskSchedular: async (_, __, { user }) => {
      if (!user) throw new Error("Unauthorized");
      try {
        const response = await axios.put(
          `http://schedularservice:9000/api/promotion-schedule/${user.id}`,
          { email: user.email }
        );
        if (response.status === 200) {
          return "task schedule successfully";
        } else {
          throw new Error("error come task scheduling time ");
        }
      } catch (error) {
        console.error("error regrading task scheduling", error);
        throw new Error("showing error when task is scheduling");
      }
    },
  },
};

const getUserFromToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    const user = getUserFromToken(token.replace("Bearer ", ""));
    return { user };
  },
});

server.listen(port).then(({ url }) => {
  console.log(`GraphQL Gateway running at ${url}`);
});
