const reportsModel = require("../models/reportsModels");
const notificationsController = require("../controllers/notificationsController");

// Get all reports (admin only)
const getAllReports = (req, res) => {
  reportsModel.getAllReports((err, results) => {
    if (err) {
      console.error("Error fetching reports:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};

// Get reports by status (admin only)
const getReportsByStatus = (req, res) => {
  const { status } = req.params;
  
  if (!['pending', 'under_review', 'reviewed', 'dismissed', 'action_taken'].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  
  reportsModel.getReportsByStatus(status, (err, results) => {
    if (err) {
      console.error("Error fetching reports by status:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};

// Update report (admin only) - UPDATED with notifications
const updateReport = (req, res) => {
  const { id } = req.params;
  const { status, action_taken, action_notes } = req.body;
  const adminId = req.admin.id;
  const adminUsername = req.admin.username;
  
  // Validate required fields
  if (!status || !action_taken) {
    return res.status(400).json({ message: "Status and action_taken are required" });
  }
  
  // Validate status
  const validStatuses = ['pending', 'under_review', 'reviewed', 'dismissed', 'action_taken'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  
  // Validate action_taken
  const validActions = ['none', 'content_removed', 'user_warned', 'content_restricted'];
  if (!validActions.includes(action_taken)) {
    return res.status(400).json({ message: "Invalid action_taken" });
  }
  
  // Get report details first to know who to notify
  reportsModel.getReportById(id, (err, reportResult) => {
    if (err) {
      console.error("Error getting report for update:", err);
      return res.status(500).json({ message: "Database error" });
    }
    
    if (reportResult.length === 0) {
      return res.status(404).json({ message: "Report not found" });
    }
    
    const report = reportResult[0];
    const contentAuthorId = report.content_author_id;
    
    // Update the report
    reportsModel.updateReport(
      id, 
      { status, action_taken, action_notes }, 
      adminId,
      (err) => {
        if (err) {
          console.error("Error updating report:", err);
          return res.status(500).json({ message: "Database error" });
        }
        
        // Send notification to content author
        sendActionNotification(contentAuthorId, report, status, action_taken, action_notes, adminUsername);
        
        // If action is content_removed, remove the content
        if (action_taken === 'content_removed') {
          handleContentRemoval(report, res);
        } else {
          res.json({ message: "Report updated successfully" });
        }
      }
    );
  });
};

// Helper function to send notification to content author
const sendActionNotification = (authorId, report, status, action_taken, action_notes, adminUsername) => {
  // Determine notification message based on action
  let message = "";
  const contentTitle = report.post_title || report.artwork_title || report.auction_title || "your content";
  
  switch (action_taken) {
    case 'content_removed':
      message = `Your ${report.content_type} "${contentTitle}" has been removed due to violations.`;
      break;
    case 'user_warned':
      message = `You have received a warning regarding your ${report.content_type} "${contentTitle}".`;
      break;
    case 'content_restricted':
      message = `Your ${report.content_type} "${contentTitle}" has been restricted due to community guidelines.`;
      break;
    case 'none':
      if (status === 'dismissed') {
        message = `A report on your ${report.content_type} "${contentTitle}" has been dismissed.`;
      } else {
        message = `A report on your ${report.content_type} "${contentTitle}" has been reviewed by admin.`;
      }
      break;
  }
  
  // Add admin notes if provided
  if (action_notes && action_notes.trim() !== '') {
    message += ` Admin notes: ${action_notes}`;
  }
  
  // Create notification
  notificationsController.createNotification(authorId, message, (err) => {
    if (err) {
      console.error("Error creating notification:", err);
    } else {
      console.log(`Notification sent to user ${authorId}: ${message}`);
    }
  });
};

// Helper function to handle content removal
const handleContentRemoval = (report, res) => {
  // Get the report to know what content to remove
  reportsModel.getReportById(report.id, (err, reportResult) => {
    if (err) {
      console.error("Error getting report for content removal:", err);
      return res.json({ 
        message: "Report updated but content removal may have failed" 
      });
    }
    
    if (reportResult.length > 0) {
      const updatedReport = reportResult[0];
      
      // Handle content removal based on content_type
      if (updatedReport.content_type === 'post') {
        // Update post status to 'down'
        const db = require("../config/database");
        db.query(
          "UPDATE posts SET post_status = 'down' WHERE id = ?",
          [updatedReport.post_id],
          (err) => {
            if (err) {
              console.error("Error removing post:", err);
              return res.json({ 
                message: "Report updated but content removal failed" 
              });
            }
            res.json({ message: "Report updated successfully and content removed" });
          }
        );
      } else if (updatedReport.content_type === 'artwork') {
        // Mark artwork as taken down
        const db = require("../config/database");
        db.query(
          "UPDATE artwork_posts SET post_status = 'down' WHERE id = ?",
          [updatedReport.artwork_id],
          (err) => {
            if (err) {
              console.error("Error removing artwork:", err);
              return res.json({ 
                message: "Report updated but content removal failed" 
              });
            }
            res.json({ message: "Report updated successfully and content removed" });
          }
        );
      }
      // Note: Auctions might need different handling
    }
  });
};

// User submits a report
const submitReport = async (req, res) => {
  try {
    const reporterId = req.user.id;
    const { content_type, content_id, report_category, reason } = req.body;
    
    if (!content_type || !content_id || !reason) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    // Check if user can report this content
    reportsModel.canUserReportContent(reporterId, content_id, content_type, (err, result) => {
      if (err) {
        console.error("Error checking report permission:", err);
        return res.status(500).json({ message: "Database error" });
      }
      
      if (!result.canReport) {
        return res.status(403).json({ 
          message: "You cannot report this content" 
        });
      }
      
      // Create the report
      reportsModel.createReport(
        reporterId, 
        content_type, 
        content_id, 
        result.contentAuthorId, 
        report_category || 'other', 
        reason,
        (err, reportResult) => {
          if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              return res.status(400).json({ 
                message: "You have already reported this content" 
              });
            }
            console.error("Error creating report:", err);
            return res.status(500).json({ message: "Database error" });
          }
          
          res.status(201).json({ 
            message: "Report submitted successfully",
            reportId: reportResult.insertId 
          });
        }
      );
    });
    
  } catch (error) {
    console.error("Error in submitReport:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllReports,
  getReportsByStatus,
  updateReport,
  submitReport
};