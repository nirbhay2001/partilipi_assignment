const express = require("express");
const { registerUser, updatePreferences, getUser, CreateOrder } = require("../controllers/userControllers");

const router = express.Router();

router.post("/register", registerUser);
router.put("/preferences/:id", updatePreferences);
router.get("/user/:id", getUser);
router.put("/placedorder/:id",CreateOrder)

module.exports = router;