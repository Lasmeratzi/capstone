// models/walletModels.js
const db = require("../config/database2"); // <-- use mysql2 promise pool here

const createWallet = (userId) => {
    const sql = `INSERT INTO wallets (user_id, balance) VALUES (?, ?)`;
    return db.query(sql, [userId, 0.00]); // returns a Promise
};

const getWalletByUserId = async (userId) => {
    const sql = `SELECT * FROM wallets WHERE user_id = ?`;
    const [rows] = await db.query(sql, [userId]);
    return rows;
};

const updateWalletBalance = (userId, amount) => {
    const sql = `UPDATE wallets SET balance = balance + ? WHERE user_id = ?`;
    return db.query(sql, [amount, userId]);
};

module.exports = { createWallet, getWalletByUserId, updateWalletBalance };
