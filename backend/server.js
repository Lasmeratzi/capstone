const express = require("express");
const path = require("path");
require("dotenv").config();

const signupRoutes = require("./routes/signupRoutes");
const loginRoutes = require("./routes/loginRoutes");
const logoutRoutes = require("./routes/logoutRoutes");
const profileRoutes = require("./routes/profileRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const postsRoutes = require("./routes/postsRoutes");
const chatRoutes = require("./routes/chatRoutes");
const commentsRoutes = require("./routes/commentsRoutes");
const artworkpostsRoutes = require("./routes/artworkpostsRoutes");
const artmediaRoutes = require("./routes/artmediaRoutes");
const auctionRoutes = require("./routes/auctionRoutes");

const app = express();

const cors = require("cors");
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.set("Surrogate-Control", "no-store");
  next();
});

// 👉 Serve uploads with CORS
app.use("/uploads", cors(), express.static(path.join(__dirname, "uploads")));

app.use("/api", signupRoutes);
app.use("/api", loginRoutes);
app.use("/api", logoutRoutes);
app.use("/api", profileRoutes);
app.use("/api", portfolioRoutes);
app.use("/api", postsRoutes);
app.use("/api", chatRoutes);
app.use("/api", commentsRoutes);
app.use("/api", artworkpostsRoutes);
app.use("/api", artmediaRoutes);
app.use("/api", auctionRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the API! Explore Signup, Login, Logout, Profile, Post, Tag, and Bid APIs.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
