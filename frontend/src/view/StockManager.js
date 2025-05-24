import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/StockManager.module.css";
import StockService from "../services/stockService";
import { useUser } from "../context/UserContext";
const StockManager = () => {
  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [stocks, setStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const fetchStocks = async () => {
    try {
      const data = await StockService.fetchStocks();
      setStocks(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleUpload = async () => {
    if (!file) return setMessage("Please select a file.");

    try {
      const res = await StockService.uploadExcel(file, user);
      setMessage(res.message + ` (${res.count} items)`);
      setFile(null);
      fetchStocks();
    } catch (err) {
      console.error(err);
      setMessage("Upload failed.");
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.item_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await StockService.deleteStock(itemId, user); // Make sure your service has this
      setMessage("Item deleted successfully.");
      fetchStocks(); // Refresh list
    } catch (err) {
      console.error("Delete error:", err);
      setMessage("Failed to delete item.");
    }
  };

  return (
    <div className={styles["stock-container"]}>
      <h2>📦 Stock Management</h2>

      <div className={styles["upload-section"]}>
        <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload Excel</button>
        {message && <p className={styles.message}>{message}</p>}
      </div>

      <div className={styles["search-bar"]}>
        <input
          type="text"
          placeholder="🔍 Search by item name, code or category"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h3>📋 Stock List</h3>
      <table className={styles["stock-table"]}>
        <thead>
          <tr>
            <th>Item Code</th>
            <th>Item Name</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Qty Type</th>
            <th>Buy Price</th>
            <th>Sell Price</th>
            <th>Discount</th>
            <th>Date</th>
            <th>Actions</th> 
          </tr>
        </thead>
        <tbody>
          {filteredStocks.map((item, idx) => (
            <tr key={idx}>
              <td>{item.item_code}</td>
              <td>{item.item_name}</td>
              <td>{item.category}</td>
              <td>{item.qty}</td>
              <td>{item.qty_type}</td>
              <td>{item.bind_price}</td>
              <td>{item.seling_price}</td>
              <td>{item.discount}</td>
              <td>{new Date(item.Date).toLocaleDateString("en-GB")}</td>
              <td>
                <button
                  className={styles["delete-button"]}
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockManager;
