
const Counter = require("../models/counterModel");

const getNextInvoiceId = async () => {
  const counter = await Counter.findByIdAndUpdate(
    { _id: "invoiceId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const padded = String(counter.seq).padStart(6, "0");
  return `INV-${padded}`;
};

module.exports = getNextInvoiceId;
