const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB Error:", err));

// Schema for finance tracker
const TransactionSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  type: String, // income or expense
  date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

// Routes
app.get("/", (req, res) => res.send("🚀 API is running"));

app.post("/add", async (req, res) => {
  const { description, amount, type } = req.body;
  const transaction = new Transaction({ description, amount, type });
  await transaction.save();
  res.json(transaction);
});

app.get("/transactions", async (req, res) => {
  const transactions = await Transaction.find();
  res.json(transactions);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
