const express = require("express"); const router = express.Router();
const { registerPushToken } = require("../controllers/announcementController");
const { verifyToken } = require("../middleware/auth");
router.post("/", verifyToken, registerPushToken);
module.exports = router;
