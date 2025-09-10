const express = require("express");
const path = require("path");
const http = require("http"); // 👈 needed for socket.io
const { Server } = require("socket.io"); // 👈 socket.io
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
const messageRoutes = require("./routes/messageRoutes");

// 👉 Import the auction cron job
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

// 👉 Serve uploads with CORS
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the API! Explore Signup, Login, Logout, Profile, Post, Tag, Artwork, Auction, and Media APIs.");
});

const PORT = process.env.PORT || 5000;

// 👉 Replace app.listen with HTTP + Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend
    methods: ["GET", "POST"],
    credentials: true
  }
});

// 👉 Socket.IO logic
io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  // Join personal room (userId from frontend)
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`👤 User ${userId} joined room`);
  });

  // Handle sending messages
  socket.on("sendMessage", (data) => {
    const { senderId, recipientId, text } = data;

    // TODO: Save to DB here if needed

    // Emit to recipient’s room
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

// 👉 Start the auction cron job before starting the server
checkAndEndAuctions();

server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
