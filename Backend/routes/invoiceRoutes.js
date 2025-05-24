// Backend/routes/stockRoutes.js
const express = require("express");
const router = express.Router();
const { createInvoice,getAllinvoice,deleteInvoice,getInvoiceById } = require("../controllers/invoiceController");

router.post("/create-invoice", createInvoice);
router.get("/all", getAllinvoice);
router.delete('/:id', deleteInvoice); 
router.get("/:id", getInvoiceById);
module.exports = router;
