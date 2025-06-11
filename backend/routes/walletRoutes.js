const express = require("express");
const router = express.Router();
const { activateWallet, getWalletBalance, checkWalletStatus } = require("../controllers/walletController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/wallet/activate", authenticateToken, activateWallet);
router.get("/wallet/balance", authenticateToken, getWalletBalance);
router.get("/wallet/status", authenticateToken, checkWalletStatus);


module.exports = router;
