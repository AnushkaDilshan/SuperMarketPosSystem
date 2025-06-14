// Backend/controllers/stockController.js
const Invoice = require("../models/invoiceModel");
const getNextInvoiceId = require("../utils/generateInvoiceId");
const Return = require('../models/Return');

exports.createInvoice = async (req, res) => {
  try {
    const invoiceId = await getNextInvoiceId();
    const userId = req.body.user;

    const invoice = new Invoice({
      _id: invoiceId,
      items: req.body.items.map(i => ({
        item_code: i.item_code,
        name: i.item_name,
        qty: i.qty,
        price: i.seling_price,
        applied_discount: i.appliedDiscount || 0,
      })),
      total: req.body.total,
       userid: userId,
       payment_method:req.body.paymentMethod
    });

    const saved = await invoice.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save invoice', error: err.message });
  }
};

exports.getAllinvoice = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedInvoice = await Invoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete invoice", error: error.message });
  }
};
exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch invoice", error: error.message });
  }
};
exports.processReturn = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { returnItems, userId } = req.body;

    if (!returnItems || !Array.isArray(returnItems) || returnItems.length === 0) {
      return res.status(400).json({ message: "No return items provided" });
    }

    if (!userId) {
      return res.status(400).json({ message: "User ID is required to process return" });
    }

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const isValid = returnItems.every((returnItem) =>
      invoice.items.some(
        (invItem) =>
          invItem.item_code === returnItem.itemCode &&
          returnItem.qty > 0 &&
          returnItem.qty <= invItem.qty
      )
    );

    if (!isValid) {
      return res.status(400).json({ message: "Invalid return items" });
    }

    const totalRefund = returnItems.reduce((total, returnItem) => {
      const item = invoice.items.find((i) => i.item_code === returnItem.itemCode);
      const discount = item.applied_discount || 0;
      const discountedPrice = item.price * (1 - discount / 100);
      return total + returnItem.qty * discountedPrice;
    }, 0);

    const newReturn = new Return({
      invoiceId,
      returnedItems: returnItems,
      returnedBy: userId,
      totalRefund,
    });

    await newReturn.save();

    res.status(200).json({ message: "Return processed successfully", return: newReturn });
  } catch (error) {
    console.error("Return processing error:", error);
    res.status(500).json({ message: "Failed to process return", error: error.message });
  }
};





