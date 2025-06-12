const verifyrequestModels = require("../models/verifyrequestModels");

// Submit a new verification request
const submitRequest = async (req, res) => {
  const { twitter_link, instagram_link, facebook_link } = req.body;
  const user_id = req.user.id;

  try {
    // Use correct function names from the model
    const existingRequest = await verifyrequestModels.findVerificationRequestByUserId(user_id);
    if (existingRequest) {
      return res.status(400).json({ message: "You already submitted a verification request." });
    }

    const newRequestId = await verifyrequestModels.createVerificationRequest({
      user_id,
      twitter_link,
      instagram_link,
      facebook_link,
    });

    res.status(201).json({ message: "Verification request submitted.", requestId: newRequestId });
  } catch (error) {
    console.error("Submit Verification Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getOwnRequest = async (req, res) => {
  const user_id = req.user.id;

  try {
    const request = await verifyrequestModels.findVerificationRequestByUserId(user_id);
    if (!request) {
      return res.status(404).json({ message: "No verification request found." });
    }

    res.status(200).json(request);
  } catch (error) {
    console.error("Fetch Verification Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const requests = await verifyrequestModels.getAllVerificationRequestsWithUsernames();
    res.status(200).json(requests);
  } catch (error) {
    console.error("Get All Verifications Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  try {
    await verifyrequestModels.updateVerificationRequestStatus(id, status);
    res.status(200).json({ message: "Status updated successfully." });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteRequest = async (req, res) => {
  const { id } = req.params;

  try {
    await verifyrequestModels.deleteVerificationRequest(id);
    res.status(200).json({ message: "Request deleted successfully." });
  } catch (error) {
    console.error("Delete Request Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const approveRequest = async (req, res) => {
  const { id } = req.params;

  try {
    await verifyrequestModels.approveVerificationRequest(id);
    res.status(200).json({ message: "Request approved and user profile updated." });
  } catch (error) {
    console.error("Approve Request Error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};


module.exports = {
  submitRequest,
  getOwnRequest,
  getAllRequests,
  updateRequestStatus,
  deleteRequest, 
  approveRequest, 
};
