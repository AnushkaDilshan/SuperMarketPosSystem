import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getbyInvoiceid, processReturn } from "../services/invoiceService";
import styles from "../styles/Retunpage.module.css";
import { useUser } from "../context/UserContext";

const ReturnItemPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { invoiceId } = location.state || {};
  const [invoice, setInvoice] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const data = await getbyInvoiceid(invoiceId);
        setInvoice(data);
      } catch (err) {
        console.error("Error fetching invoice:", err);
      }
    };
    if (invoiceId) fetchInvoice();
  }, [invoiceId]);

  const toggleSelect = (itemKey) => {
    setSelectedItems((prev) => {
      const updated = { ...prev };
      if (itemKey in updated) {
        delete updated[itemKey];
      } else {
        updated[itemKey] = 1;
      }
      return updated;
    });
  };

  const handleQtyChange = (itemKey, maxQty, value) => {
    const qty = Math.max(1, Math.min(maxQty, parseInt(value) || 1));
    setSelectedItems((prev) => ({
      ...prev,
      [itemKey]: qty,
    }));
  };

  const handleSelectAll = () => {
    if (!invoice) return;
    const allSelected = invoice.items.every((item, index) =>
      `${item.item_code}-${index}` in selectedItems
    );
    if (allSelected) {
      setSelectedItems({});
    } else {
      const selected = {};
      invoice.items.forEach((item, index) => {
        selected[`${item.item_code}-${index}`] = 1;
      });
      setSelectedItems(selected);
    }
  };

  const calculateTotalRefund = () => {
    if (!invoice) return 0;
    return invoice.items.reduce((total, item, index) => {
      const itemKey = `${item.item_code}-${index}`;
      const qty = selectedItems[itemKey] || 0;
      const discount = item.applied_discount || 0;
      const discountedPrice = item.price * (1 - discount / 100);
      return total + qty * discountedPrice;
    }, 0);
  };

const handleReturn = async () => {
  if (!user) {
    alert("User not logged in.");
    return;
  }

  const returnItems = Object.entries(selectedItems).map(([itemKey, qty]) => {
    const [, index] = itemKey.split("-");
    const item = invoice.items[parseInt(index)];
    return {
      itemCode: item.item_code,
      qty,
    };
  });

  try {
    await processReturn(invoiceId, returnItems, user);
    alert("Items returned successfully!");
    navigate("/payment");
  } catch (err) {
    console.error("Return failed:", err);
    alert("Return failed. Please try again.");
  }
};


  if (!invoice) return <p className={styles.loading}>Loading invoice...</p>;

  return (
    <div className={styles.container}>
      <h2>Return Items for Invoice {invoiceId}</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={
                  invoice.items.length > 0 &&
                  invoice.items.every((item, index) =>
                    `${item.item_code}-${index}` in selectedItems
                  )
                }
              />
              Select All
            </th>
            <th>Item</th>
            <th>Qty Purchased</th>
            <th>Discount</th>
            <th>Price</th>
            <th>Qty to Return</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => {
            const itemKey = `${item.item_code}-${index}`;
            const isSelected = itemKey in selectedItems;
            const qtyValue = selectedItems[itemKey] || 1;

            return (
              <tr key={itemKey}>
                <td>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(itemKey)}
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>{item.applied_discount || 0}%</td>
                <td>Rs. {item.price.toFixed(2)}</td>
                <td>
                  {isSelected && (
                    <input
                      type="number"
                      min="1"
                      max={item.qty}
                      value={qtyValue}
                      onChange={(e) =>
                        handleQtyChange(itemKey, item.qty, e.target.value)
                      }
                      className={styles.qtyInput}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className={styles.summary}>
        <h3>Summary</h3>
        {Object.keys(selectedItems).length > 0 ? (
          <>
            <ul>
              {invoice.items
                .map((item, index) => {
                  const itemKey = `${item.item_code}-${index}`;
                  if (!(itemKey in selectedItems)) return null;
                  const qty = selectedItems[itemKey];
                  const discount = item.applied_discount || 0;
                  const discountedPrice = item.price * (1 - discount / 100);
                  const refund = qty * discountedPrice;

                  return (
                    <li key={itemKey}>
                      {item.name} - {qty} × Rs. {item.price.toFixed(2)} with{" "}
                      {discount}% off = Rs. {refund.toFixed(2)}
                    </li>
                  );
                })
                .filter(Boolean)}
            </ul>
            <p className={styles.total}>
              <strong>Total Refund: Rs. {calculateTotalRefund().toFixed(2)}</strong>
            </p>
          </>
        ) : (
          <p>No items selected.</p>
        )}
      </div>

      <button
        onClick={handleReturn}
        disabled={Object.keys(selectedItems).length === 0}
        className={styles.button}
      >
        Process Return
      </button>
    </div>
  );
};

export default ReturnItemPage;
