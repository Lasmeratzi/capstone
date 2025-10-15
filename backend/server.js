const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
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
const auctionMediaRoutes = require("./routes/auctionmediaRoutes"); 
const auctionbidsRoutes = require("./routes/auctionbidsRoutes");
const walletRoutes = require("./routes/walletRoutes");
const adminLoginRoutes = require("./routes/adminLoginRoutes");
const adminLogoutRoutes = require("./routes/adminLogoutRoutes");
const notificationsRoutes = require("./routes/notificationsRoutes");
const verifyrequestRoutes = require("./routes/verifyrequestRoutes");
const followRoutes = require("./routes/followRoutes");
const postlikesRoutes = require("./routes/postlikesRoutes");
const artworkpostlikesRoutes = require("./routes/artworkpostlikesRoutes");
const artworkcommentsRoutes = require("./routes/artworkcommentsRoutes");
const messageRoutes = require("./routes/messageRoutes");
const autoReplyRoutes = require("./routes/autoReplyRoutes");
const tagsRoutes = require("./routes/tagsRoutes"); // ✅ NEW
const locationRoutes = require("./routes/locationRoutes");

// Auction cron job
const checkAndEndAuctions = require("./jobs/auctionJobs");

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

// ✅ Serve uploads with CORS-safe headers
// ✅ Serve all uploaded files (including watermarks) with open CORS
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      // Allow frontend (Vite dev server) to access
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
      res.setHeader("Cache-Control", "public, max-age=0");
    },
  })
);

// Routes
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
app.use("/api", auctionMediaRoutes); 
app.use("/api/auctionbids", auctionbidsRoutes);
app.use("/api", walletRoutes);
app.use("/api", adminLoginRoutes); 
app.use("/api", adminLogoutRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api", verifyrequestRoutes);
app.use("/api/follow", followRoutes);
app.use("/api", postlikesRoutes);
app.use("/api/artwork-post-likes", artworkpostlikesRoutes);
app.use("/api/artwork-comments", artworkcommentsRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/auto-replies", autoReplyRoutes);
app.use("/api", tagsRoutes); // ✅ NEW
app.use("/api/locations", locationRoutes); // ✅ NEW

app.get("/", (req, res) => {
  res.send("Welcome to the API! Explore Signup, Login, Logout, Profile, Post, Tag, Artwork, Auction, and Media APIs.");
});

const PORT = process.env.PORT || 5000;

// Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`👤 User ${userId} joined room`);
  });

  socket.on("sendMessage", (data) => {
    const { senderId, recipientId, text } = data;
    io.to(recipientId).emit("receiveMessage", {
      senderId,
      text,
      created_at: new Date()
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

checkAndEndAuctions();

server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));