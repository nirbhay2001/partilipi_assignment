const express = require("express");
const {productRecommendation} = require("../controllers/recommendationControllers");
const router = express.Router();

router.get("/product-recommendation/:id", productRecommendation);

module.exports = router;