const auctionModels = require("../models/auctionModels");

// Create auction
const createAuction = (req, res) => {
  const { title, description, starting_price, end_time } = req.body;
  const author_id = req.user.id;
  const status = "pending";

  if (!title || !description || !starting_price || !end_time) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const current_price = starting_price; // start at starting_price

  const auctionData = {
    author_id,
    title,
    description,
    starting_price,
    current_price,
    end_time,
    status,
  };

  auctionModels.createAuction(auctionData, (err, result) => {
    if (err)
      return res.status(500).json({ message: "Database error.", error: err });

    res.status(201).json({
      message: "Auction created successfully.",
      auctionId: result.insertId,
    });
  });
};

// Get all auctions
const getAllAuctions = (req, res) => {
  auctionModels.getAllAuctions((err, results) => {
    if (err)
      return res.status(500).json({ message: "Database error.", error: err });

    res.status(200).json(results);
  });
};

// Get single auction
const getAuctionById = (req, res) => {
  const { auctionId } = req.params;

  auctionModels.getAuctionById(auctionId, (err, result) => {
    if (err)
      return res.status(500).json({ message: "Database error.", error: err });

    if (result.length === 0) {
      return res.status(404).json({ message: "Auction not found." });
    }

    res.status(200).json(result[0]);
  });
};

// Update auction status
const updateAuctionStatus = (req, res) => {
  const { auctionId } = req.params;
  const { status } = req.body;

  auctionModels.updateAuctionStatus(auctionId, status, (err) => {
    if (err)
      return res.status(500).json({ message: "Database error.", error: err });

    res.status(200).json({ message: "Auction status updated." });
  });
};

// Delete auction
const deleteAuction = (req, res) => {
  const { auctionId } = req.params;

  auctionModels.deleteAuction(auctionId, (err) => {
    if (err)
      return res.status(500).json({ message: "Database error.", error: err });

    res.status(200).json({ message: "Auction deleted successfully." });
  });
};

// Get auctions for logged-in user
const getUserAuctions = (req, res) => {
  console.log("Received User ID:", req.user.id);
  const authorId = req.user.id;

  auctionModels.getAuctionsByAuthorId(authorId, (err, results) => {
    if (err)
      return res.status(500).json({ message: "Database error.", error: err });

    res.status(200).json(results);
  });
};

module.exports = {
  createAuction,
  getAllAuctions,
  getUserAuctions,
  getAuctionById,
  updateAuctionStatus,
  deleteAuction,
};
