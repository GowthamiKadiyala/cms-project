const express = require("express");
const cors = require("cors");
const path = require("path");

const uploadRoutes = require("./routes/uploadRoutes");
const userRoutes = require("./routes/userRoutes");
const contentTypeRoutes = require("./routes/contentTypeRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors()); // Allows Frontend to talk to Backend
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/types", contentTypeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/contents", require("./routes/contentRoutes"));

module.exports = app;
