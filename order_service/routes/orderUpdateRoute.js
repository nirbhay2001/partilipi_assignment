const express = require("express");
const orderUpdate = require("../controllers/orderUpdateController");
const router = express.Router();

router.put("/order-update/:id", orderUpdate);

module.exports = router;