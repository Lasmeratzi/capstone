const Wallet = require("../models/walletModels");

const activateWallet = async (req, res) => {
    const userId = req.user.id;
    const walletExists = await Wallet.getWalletByUserId(userId);
    if (walletExists.length > 0) {
        return res.status(400).json({ message: "Wallet already activated!" });
    }
    await Wallet.createWallet(userId);
    res.json({ message: "Wallet activated successfully!" });
};

const getWalletBalance = async (req, res) => {
    const userId = req.user.id;
    const wallet = await Wallet.getWalletByUserId(userId);
    if (wallet.length === 0) {
        return res.status(404).json({ message: "Wallet not found." });
    }
    res.json({
        balance: wallet[0].balance,
        transactions: [] // or fetch from a transactions table later
    });
};
const checkWalletStatus = async (req, res) => {
  const userId = req.user.id;
  const wallet = await Wallet.getWalletByUserId(userId);
  const activated = wallet.length > 0;
  res.json({ activated });
};


module.exports = {
    activateWallet,
    getWalletBalance,
    checkWalletStatus,
};
