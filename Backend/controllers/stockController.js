const XLSX = require('xlsx');
const Stock = require('../models/stockModel');




exports.importExcelToStock = async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Read the uploaded Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    // Map and add the userId to each row
    const stockDataWithUser = jsonData.map((item) => ({
      userid: userId,
      item_code: item['item_code'],
      item_name: item['item_name'],
      category: item['category'] || '',
      qty: item['qty'] || 0,
      qty_type: item['qty_type'] || '',
      bind_price: item['bind_price'] || 0,
      seling_price: item['seling_price'] || 0,
      discount: item['discount'] ? item['discount'].toString().split(',') : [],
      Date: new Date()
    }));

    // Insert into MongoDB
    await Stock.insertMany(stockDataWithUser);

    res.status(200).json({
      message: 'Excel data imported successfully',
      count: stockDataWithUser.length
    });
  } catch (error) {
    console.error('Import error:', error.message);
    res.status(500).json({ message: 'Failed to import Excel data' });
  }
};

// exports.importExcelToStock = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];

//     const data = XLSX.utils.sheet_to_json(worksheet);

//     const formattedData = data.map(row => ({
//       userid: row['userid'],
//       item_code: row['item_code'],
//       item_name: row['item_code'],
//       category: row['item_code'],
//       qty: parseFloat(row['qty']) || 0,
//       qty_type: row['qty_type'],
//       bind_price: parseFloat(row['bind_price']) || 0,
//       seling_price: parseFloat(row['seling_price']) || 0,
//       discount: parseFloat((row['discount'] + '').replace(',', '.')) || 0,
//       Date: new Date()
//     }));

//     await Stock.insertMany(formattedData);
//     res.status(200).json({ message: 'Excel file imported successfully', count: formattedData.length });

//   } catch (error) {
//     console.error('Excel import error:', error.message);
//     res.status(500).json({ message: 'Failed to import Excel file' });
//   }
// };

exports.getAllStockItems = async (req, res) => {
  try {
    const items = await Stock.find(); // You can add sorting or filters if needed
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching stock items:', error.message);
    res.status(500).json({ message: 'Failed to retrieve stock items' });
  }
};

exports.deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndDelete(req.params.id);
    if (!stock) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error during delete' });
  }
};
exports.updateStockQuantities = async (req, res) => {
  try {
    const { items } = req.body; // items: [{ item_code, qty }]

    for (const item of items) {
      await Stock.updateOne(
        { _id: item.itemid },
        { $inc: { qty: -item.qty } }
      );
    }

    res.status(200).json({ message: "Stock updated successfully" });
  } catch (error) {
    console.error("Stock update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
