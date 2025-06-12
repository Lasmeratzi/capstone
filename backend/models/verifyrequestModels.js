const db = require("../config/database2");

// Create a new verification request
const createVerificationRequest = async ({ user_id, twitter_link, instagram_link, facebook_link }) => {
  const [result] = await db.execute(
    `INSERT INTO verification_requests (user_id, twitter_link, instagram_link, facebook_link)
     VALUES (?, ?, ?, ?)`,
    [user_id, twitter_link, instagram_link, facebook_link]
  );
  return result.insertId;
};

// Get a request by user ID
const findVerificationRequestByUserId = async (user_id) => {
  const [rows] = await db.execute(
    `SELECT * FROM verification_requests WHERE user_id = ?`,
    [user_id]
  );
  return rows[0];
};

// Get all requests
const getAllVerificationRequests = async () => {
  const [rows] = await db.execute(`SELECT * FROM verification_requests`);
  return rows;
};

const getAllVerificationRequestsWithUsernames = async () => {
  const [rows] = await db.execute(`
    SELECT vr.*, u.username
    FROM verification_requests vr
    JOIN users u ON vr.user_id = u.id
    ORDER BY vr.request_date DESC
  `);
  return rows;
};


// Update the status of a request by ID
const updateVerificationRequestStatus = async (id, status) => {
  const [result] = await db.execute(
    `UPDATE verification_requests SET status = ? WHERE id = ?`,
    [status, id]
  );
  return result;
};

const deleteVerificationRequest = async (id) => {
  const [result] = await db.execute(
    `DELETE FROM verification_requests WHERE id = ?`,
    [id]
  );
  return result;
};

// Approve a verification request: update user profile and set verified = 1
const approveVerificationRequest = async (requestId) => {
  // Fetch the request first
  const [rows] = await db.execute(
    `SELECT * FROM verification_requests WHERE id = ?`,
    [requestId]
  );

  const request = rows[0];
  if (!request) {
    throw new Error("Request not found.");
  }

  // Update the user profile based on the request
  await db.execute(
    `UPDATE users
     SET verified = 1,
         twitter_link = ?,
         instagram_link = ?,
         facebook_link = ?
     WHERE id = ?`,
    [request.twitter_link, request.instagram_link, request.facebook_link, request.user_id]
  );

  // Optionally update the request status to 'approved'
  await db.execute(
    `UPDATE verification_requests
     SET status = 'approved'
     WHERE id = ?`,
    [requestId]
  );
};

module.exports = {
  createVerificationRequest,
  findVerificationRequestByUserId,
  getAllVerificationRequests,
  updateVerificationRequestStatus,
  getAllVerificationRequestsWithUsernames,
   deleteVerificationRequest,
   approveVerificationRequest,
};
