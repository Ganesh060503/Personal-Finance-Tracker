const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const jwt = require("jsonwebtoken");

// Add Transaction
router.post("/add", async (req, res) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, "simple_secret_key");
    const { amount, category, description, date } = req.body;

    const transaction = new Transaction({
      userId: decoded.id,
      amount,
      category,
      description,
      date,
    });

    const savedTransaction = await transaction.save();
    res.status(200).json(savedTransaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get Transactions
router.get("/all", async (req, res) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, "simple_secret_key");
    const transactions = await Transaction.find({ userId: decoded.id });
    res.status(200).json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
