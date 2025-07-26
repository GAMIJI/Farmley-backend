require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const path = require("path");

const app = express();

// ✅ MongoDB URI
const dbURL = process.env.MONGODB_URI || "mongodb+srv://Farmley_db:Farmley_9575@farmley.roovp.mongodb.net/?retryWrites=true&w=majority&appName=Farmley";

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://farmley-git-main-mohit-gamis-projects.vercel.app"
];

// ✅ Allow All Origins - For Development Only
app.use(cors({
  origin: true, // dynamically reflect request origin
  credentials: true,
}));



// ✅ Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Serve Static Files
app.use("/uploads", express.static("uploads"));

// ✅ MongoDB Connection
mongoose.set("strictQuery", false);
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Passport Config
app.use(passport.initialize());
require("./config/passport")(passport);

// ✅ Test Route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working ✅" });
});

// ✅ Import Routes
const userRoutes = require("./routes/api/user.js");
const productRoutes = require("./routes/api/Product.js");
const cartRoutes = require("./routes/api/cartRoutes.js");
const orderRoutes = require("./routes/api/Order.js");

// ✅ Register API Routes
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 [ERROR]:", err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
