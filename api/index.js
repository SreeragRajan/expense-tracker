const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const transactionModel = require("./models/Transaction-model.js");

app.use(cors());

app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json("test ok");
});

app.post("/api/transactions", async (req, res) => {
  const { amount, date, desc } = req.body;

  try {
    const newTransaction = await transactionModel.create({
      amount,
      date,
      desc,
    });
    res.send(newTransaction);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.get("/api/transactions", async (req, res) => {
  try {
    const allTransactions = await transactionModel.find({});
    res.json(allTransactions);
  } catch (err) {
    console.log(err.message);
  }
});

app.delete("/api/transactions/:id", (req, res) => {
  const { id } = req.params;
  transactionModel.findByIdAndDelete(id)
    .then(() => res.status(204).send())
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.listen(3000, () => {
  mongoose
    .connect(
      "mongodb+srv://sreeragrajan07:UK07Zz7YJVJvFdvv@transactions.i3z3g.mongodb.net/?retryWrites=true&w=majority&appName=Transactions"
    )
    .then(() => {})
    .catch((err) => {
      console.log(err.message);
    });
});
