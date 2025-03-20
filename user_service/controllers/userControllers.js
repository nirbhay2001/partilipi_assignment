const User = require("../models/userModel");
const { generateToken } = require("../utils/auth");
const {
  sendUserRegistrationMessage,
} = require("../producer/registerProducer");
const {sendMessageForOrderPlaced} = require("../producer/placedOrderProducer")


const registerUser = async (req, res) => {
  const { name, email, preferences } = req.body;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "invalid email format" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "user alrady exist in datanase" });
    }

    const user = await User.create({ name, email, preferences });
    const token = generateToken(user);
    await sendUserRegistrationMessage(user);

    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "internal server error" });
  }
};

const updatePreferences = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { preferences: req.body.preferences },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const CreateOrder = async (req, res) => {
  const { id } = req.params;
  const { products } = req.body;

  if (!id || !products || !Array.isArray(products)) {
    return res.status(400).json({
      message: "invalid input data. user id and  products array must be necessary.",
    });
  }
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "user not found." });
    }
    updateOrderDetails(user, products);
    await user.save();

    await sendMessageForOrderPlaced(user);

    return res
      .status(200)
      .json({ message: "order placed successfully.", user });
  } catch (error) {
    console.error("placing order error:", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const updateOrderDetails = (user, products) => {
  user.orders = products;
  user.order_status = "Placed";

  user.purchase_history.push({
    products: products,
    purchaseDate: new Date(),
  });
};

module.exports = { registerUser, updatePreferences, getUser, CreateOrder };
