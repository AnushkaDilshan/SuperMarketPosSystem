const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema({
  invoiceId: { type: String, ref: "Invoice", required: true }, // ✅ fix: store invoiceCode string
  returnedItems: [
    {
      itemCode: String,
      qty: Number,
    },
  ],
  totalRefund: {
    type: Number,
    required: true,
  },
  returnedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  returnedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Return", returnSchema);