// Backend/controllers/stockController.js
const Invoice = require("../models/invoiceModel");
const getNextInvoiceId = require("../utils/generateInvoiceId");

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
