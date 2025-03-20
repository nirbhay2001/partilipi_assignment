const express = require("express");
const {productSchedule} = require("../controllers/scheduleControllers");
const router = express.Router();

router.put("/promotion-schedule/:id", productSchedule);

module.exports = router;