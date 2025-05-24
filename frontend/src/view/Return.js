import React, { useEffect, useState } from "react";
import styles from "../styles/StockManager.module.css";
import { getAllInvoices, deleteInvoice } from "../services/invoiceService";
import { useNavigate } from "react-router-dom";
const StockManager = () => {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchInvoices = async () => {
    try {
      const data = await getAllInvoices();
      console.log("Invoice data:", data);
      setInvoices(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };
  const handleReturn = async (invoiceId) => {
     navigate(`/payment`, { state: { invoiceId } });
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Filter invoices based on payment_method or _id matching the search term
  const filteredInvoices = invoices.filter((invoice) => {
    const id = invoice._id || "";
    const date = new Date(invoice.date).toLocaleDateString("en-GB") || "";
    const paymentMethod = invoice.payment_method || "";
    return (
      id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDelete = async (invoiceId) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await deleteInvoice(invoiceId);
        // Remove deleted invoice from state to update UI
        setInvoices((prev) => prev.filter((inv) => inv._id !== invoiceId));
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete invoice. Please try again.");
      }
    }
  };

  return (
    <div className={styles["stock-container"]}>
      <h2>📦 Invoice Management</h2>

      <div className={styles["search-bar"]}>
        <input
          type="text"
          placeholder="🔍 Search by Invoice ID or Payment Method"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h3>📋 Invoice List</h3>
      <table className={styles["stock-table"]}>
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Total</th>
            <th>Payment Method</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map((invoice) => (
            <tr key={invoice._id}>
              <td>{invoice._id}</td>
              <td>{invoice.total}</td>
              <td>{invoice.payment_method}</td>
              <td>{new Date(invoice.date).toLocaleDateString("en-GB")}</td>
              <td>
                <button
                  onClick={() => handleDelete(invoice._id)}
                  className={styles["delete-button"]}
                >
                  Delete
                </button>
                <button
                  onClick={() => handleReturn(invoice._id)}
                  className={styles["return-button"]}
                >
                  Return
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
