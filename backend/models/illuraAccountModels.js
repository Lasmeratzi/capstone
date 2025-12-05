const db = require("../config/database");

// Get Illura account information (super_admin's GCash info)
const getIlluraAccount = (callback) => {
  const sql = `
    SELECT gcash_number, gcash_name, qr_code_path 
    FROM admins 
    WHERE role = 'super_admin' 
    LIMIT 1
  `;
  db.query(sql, callback);
};

// Update Illura account information
const updateIlluraAccount = (gcashData, callback) => {
  const sql = `
    UPDATE admins 
    SET gcash_number = ?, gcash_name = ?, qr_code_path = ?
    WHERE role = 'super_admin'
  `;
  const { gcash_number, gcash_name, qr_code_path } = gcashData;
  db.query(sql, [gcash_number, gcash_name, qr_code_path], callback);
};

// Update only QR code path
const updateQRCode = (qrCodePath, callback) => {
  const sql = `
    UPDATE admins 
    SET qr_code_path = ?
    WHERE role = 'super_admin'
  `;
  db.query(sql, [qrCodePath], callback);
};

module.exports = {
  getIlluraAccount,
  updateIlluraAccount,
  updateQRCode
};