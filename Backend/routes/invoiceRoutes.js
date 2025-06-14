// Backend/routes/stockRoutes.js
const express = require("express");
const router = express.Router();
const { createInvoice,getAllinvoice,deleteInvoice,getInvoiceById,processReturn } = require("../controllers/invoiceController");

router.post("/create-invoice", createInvoice);
router.get("/all", getAllinvoice);
router.delete('/:id', deleteInvoice); 
router.get("/:id", getInvoiceById);
router.post("/:invoiceId/return", processReturn);
module.exports = router;
