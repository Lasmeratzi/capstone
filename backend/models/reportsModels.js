const db = require("../config/database");

// Get all reports with user and content info
const getAllReports = (callback) => {
  const sql = `
    SELECT 
      r.*,
      u.username AS reporter_name,
      ua.username AS content_author_name,
      adm.username AS admin_name,  -- Add admin name
      p.title AS post_title,
      ap.title AS artwork_title,
      a.title AS auction_title,
      a.status AS auction_status,
      p.post_status AS post_status,
      p.visibility AS post_visibility,
      ap.visibility AS artwork_visibility
    FROM reports r
    LEFT JOIN users u ON r.reporter_id = u.id
    LEFT JOIN users ua ON r.content_author_id = ua.id
    LEFT JOIN admins adm ON r.reviewed_by = adm.id  -- Join with admins table
    LEFT JOIN posts p ON r.post_id = p.id
    LEFT JOIN artwork_posts ap ON r.artwork_id = ap.id
    LEFT JOIN auctions a ON r.auction_id = a.id
    ORDER BY r.created_at DESC
  `;
  db.query(sql, callback);
};

// Get reports by status
const getReportsByStatus = (status, callback) => {
  const sql = `
    SELECT 
      r.*,
      u.username AS reporter_name,
      ua.username AS content_author_name,
      adm.username AS admin_name,  -- Add admin name
      p.title AS post_title,
      ap.title AS artwork_title,
      a.title AS auction_title
    FROM reports r
    LEFT JOIN users u ON r.reporter_id = u.id
    LEFT JOIN users ua ON r.content_author_id = ua.id
    LEFT JOIN admins adm ON r.reviewed_by = adm.id  -- Join with admins table
    LEFT JOIN posts p ON r.post_id = p.id
    LEFT JOIN artwork_posts ap ON r.artwork_id = ap.id
    LEFT JOIN auctions a ON r.auction_id = a.id
    WHERE r.status = ?
    ORDER BY r.created_at DESC
  `;
  db.query(sql, [status], callback);
};

// Update report status and action - UPDATED to include reviewed_by
const updateReport = (reportId, updateData, adminId, callback) => {
  const { status, action_taken, action_notes } = updateData;
  const sql = `
    UPDATE reports 
    SET status = ?, 
        action_taken = ?, 
        action_notes = ?,
        reviewed_by = ?,  -- Store admin ID who reviewed
        reviewed_at = NOW()
    WHERE id = ?
  `;
  db.query(sql, [status, action_taken, action_notes, adminId, reportId], callback);
};

// Get report by ID
const getReportById = (reportId, callback) => {
  const sql = `
    SELECT 
      r.*,
      u.username AS reporter_name,
      ua.username AS content_author_name,
      adm.username AS admin_name,  -- Add admin name
      p.title AS post_title,
      ap.title AS artwork_title,
      a.title AS auction_title
    FROM reports r
    LEFT JOIN users u ON r.reporter_id = u.id
    LEFT JOIN users ua ON r.content_author_id = ua.id
    LEFT JOIN admins adm ON r.reviewed_by = adm.id  -- Join with admins table
    LEFT JOIN posts p ON r.post_id = p.id
    LEFT JOIN artwork_posts ap ON r.artwork_id = ap.id
    LEFT JOIN auctions a ON r.auction_id = a.id
    WHERE r.id = ?
  `;
  db.query(sql, [reportId], callback);
};

// Check if user can report content
const canUserReportContent = (userId, contentId, contentType, callback) => {
  let sql, params;
  
  if (contentType === 'post') {
    sql = `
      SELECT p.visibility, p.author_id,
             EXISTS (
               SELECT 1 FROM follows f 
               WHERE f.follower_id = ? 
               AND f.following_id = p.author_id
             ) AS is_following
      FROM posts p
      WHERE p.id = ? AND p.post_status = 'active'
    `;
    params = [userId, contentId];
  } 
  else if (contentType === 'artwork') {
    sql = `
      SELECT ap.visibility, ap.author_id,
             EXISTS (
               SELECT 1 FROM follows f 
               WHERE f.follower_id = ? 
               AND f.following_id = ap.author_id
             ) AS is_following
      FROM artwork_posts ap
      WHERE ap.id = ?
    `;
    params = [userId, contentId];
  }
  else if (contentType === 'auction') {
    sql = `
      SELECT a.author_id, a.status
      FROM auctions a
      WHERE a.id = ? AND a.status = 'active'
    `;
    params = [contentId];
  }
  
  db.query(sql, params, (err, result) => {
    if (err) return callback(err);
    if (!result.length) return callback(null, false);
    
    const content = result[0];
    let canReport = false;
    
    if (contentType === 'post' || contentType === 'artwork') {
      if (content.visibility === 'public') {
        canReport = true;
      } else if (content.visibility === 'friends') {
        canReport = Boolean(content.is_following);
      }
    } 
    else if (contentType === 'auction') {
      canReport = true;
    }
    
    callback(null, {
      canReport,
      contentAuthorId: content.author_id
    });
  });
};

// Create a report
const createReport = (reporterId, contentType, contentId, contentAuthorId, reportCategory, reason, callback) => {
  let sql, params;
  
  if (contentType === 'post') {
    sql = `
      INSERT INTO reports 
      (reporter_id, content_type, post_id, content_author_id, report_category, reason) 
      VALUES (?, 'post', ?, ?, ?, ?)
    `;
    params = [reporterId, contentId, contentAuthorId, reportCategory, reason];
  } 
  else if (contentType === 'artwork') {
    sql = `
      INSERT INTO reports 
      (reporter_id, content_type, artwork_id, content_author_id, report_category, reason) 
      VALUES (?, 'artwork', ?, ?, ?, ?)
    `;
    params = [reporterId, contentId, contentAuthorId, reportCategory, reason];
  }
  else if (contentType === 'auction') {
    sql = `
      INSERT INTO reports 
      (reporter_id, content_type, auction_id, content_author_id, report_category, reason) 
      VALUES (?, 'auction', ?, ?, ?, ?)
    `;
    params = [reporterId, contentId, contentAuthorId, reportCategory, reason];
  }
  
  db.query(sql, params, callback);
};

module.exports = {
  getAllReports,
  getReportsByStatus,
  updateReport,
  getReportById,
  canUserReportContent,
  createReport
};