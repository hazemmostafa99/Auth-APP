const express = require("express");
const { register, login, changePassword } = require("../controllers/auth");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);
router.post("/change-password", authMiddleware, changePassword);

module.exports = router;
