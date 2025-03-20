const express = require('express');
const { trackEmailRead,getNotificationDetails } = require('../controllers/notificationControllers');

const router = express.Router();


router.get('/track-email-read/:notificationId', trackEmailRead);
router.get('/get-notification/:id',getNotificationDetails)

module.exports = router;
