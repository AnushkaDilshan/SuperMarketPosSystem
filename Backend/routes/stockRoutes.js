const express = require('express');
const multer = require('multer');
const { importExcelToStock, getAllStockItems,deleteStock,updateStockQuantities} = require('../controllers/stockController');

const router = express.Router();

// Setup file upload with multer
const upload = multer({ dest: 'uploads/' });

// Route for importing Excel to stock
router.post('/upload-excel', upload.single('file'), importExcelToStock);
router.get('/all', getAllStockItems);
router.delete('/:id', deleteStock);
router.post('/update-qty', updateStockQuantities);
module.exports = router;
