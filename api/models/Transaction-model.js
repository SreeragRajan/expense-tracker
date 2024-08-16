const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
  amount: { type: String, required: true },
  date: {
    type: Date,
    required: true,
  },
  desc: { type: String, required: true },
});

module.exports = mongoose.model("Transaction", transactionSchema);
