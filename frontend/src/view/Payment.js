import React, { useEffect, useState } from "react";
import StockService from "../services/stockService";
import InvoiceService from '../services/invoiceService';
import { createInvoice,getbyInvoiceid } from "../services/invoiceService";
import "jspdf-autotable";
import { useUser } from "../context/UserContext";
import { useLocation } from 'react-router-dom';

const PaymentManagement = () => {
  const [stocks, setStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paidAmount, setPaidAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const { user } = useUser();

  const { state } = useLocation();
  const invoiceId = state?.invoiceId;
const [loadingStocks, setLoadingStocks] = useState(true);
  useEffect(() => {
    fetchStocks();
  }, []);

useEffect(() => {
  if (invoiceId && !loadingStocks && stocks.length > 0) {
    fetchInvoice(invoiceId);
  }
}, [loadingStocks]);

const fetchInvoice = async (invoiceId) => {
   try {
      const data = await getbyInvoiceid(invoiceId);
      data.items.map((item) => addToBillInvoice(item));

    } catch (err) {
      console.error("Fetch error:", err);
    }
}

const fetchStocks = async () => {
    try {
      setLoadingStocks(true);
      const data = await StockService.fetchStocks();
      setStocks(data);
    
    } catch (err) {
      console.error("Fetch error:", err);
    }finally {
      setLoadingStocks(false);
    }
};

const parseDiscounts = (discount) => {
    if (!discount) return [];
    if (typeof discount !== "string") discount = discount.toString();
    return discount
      .split(",")
      .map((d) => Number(d.trim()))
      .filter((d) => !isNaN(d) && d > 0);
};

const addToBillInvoice = (InvoiceItem) => {
  const stockItem = stocks.find((s) => s.item_code === InvoiceItem.item_code);

  if (!stockItem) {
    console.warn(`Item with code ${InvoiceItem.item_code} not found in stock`);
    return;
  }
  const invoiceMappedItem = {
    ...stockItem,
    qty: InvoiceItem.qty,
    appliedDiscount: InvoiceItem.applied_discount,
  };

  setCart((prevCart) => [...prevCart, invoiceMappedItem]);
};

  const addToBill = (item) => {
    const stockItem = stocks.find((s) => s.item_code === item.item_code);
       
  console.log("test it",item);
  console.log("stock it",stockItem);
    if (!stockItem || stockItem.qty < 1) {
      alert("Item out of stock");
      return;
    }

    const exists = cart.find((ci) => ci.item_code === item.item_code);
    if (exists) {
      if (exists.qty + 1 > stockItem.qty) {
        alert("No more stock available for this item");
        return;
      }
      updateQty(item.item_code, exists.qty + 1);
    } else {
      const newItem = {
        ...stockItem,
        qty: 1,
        appliedDiscount: 0,
      };
      const updatedCart = [...cart, newItem];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      setStocks((prev) =>
        prev.map((stock) =>
          stock.item_code === item.item_code
            ? { ...stock, qty: stock.qty - 1 }
            : stock
        )
      );
    }
  };

  const updateQty = (item_code, newQty) => {
    if (newQty < 0) return;

    const stockItem = stocks.find((s) => s.item_code === item_code);
    const cartItem = cart.find((ci) => ci.item_code === item_code);
    if (!stockItem || !cartItem) return;

    const currentQtyInCart = cartItem.qty;
    const qtyDiff = newQty - currentQtyInCart;

    if (qtyDiff > stockItem.qty) {
      alert("Quantity exceeds available stock");
      return;
    }

    const updatedCart = cart.map((ci) =>
      ci.item_code === item_code ? { ...ci, qty: newQty } : ci
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    setStocks((prev) =>
      prev.map((stock) =>
        stock.item_code === item_code
          ? { ...stock, qty: stock.qty - qtyDiff }
          : stock
      )
    );
  };
    
  const removeFromBill = (item_code) => {
    const cartItem = cart.find((ci) => ci.item_code === item_code);
    if (!cartItem) return;

    const updatedCart = cart.filter((ci) => ci.item_code !== item_code);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    setStocks((prev) =>
      prev.map((stock) =>
        stock.item_code === item_code
          ? { ...stock, qty: stock.qty + cartItem.qty }
          : stock
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const discount = item.appliedDiscount ?? 0;
      const discountAmount = (item.seling_price * discount) / 100;
      const discountedPrice = item.seling_price - discountAmount;
      return total + discountedPrice * item.qty;
    }, 0);
  };
  const getBalance = () => {
    const total = calculateTotal();
    const paid = parseFloat(paidAmount);
    if (isNaN(paid)) return total.toFixed(2);
    return (paid - total).toFixed(2);
  };

  const resetPayment = () => {
    setPaidAmount("");
    setPaymentMethod("Cash");
    setShowPaymentPopup(false);
  };

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.item_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const printInvoice = async (invoiceId) => {
  try {
    
    const response = await fetch('http://localhost:5000/api/shop');
    const shops = await response.json();
    const shop = shops[0] || { name: "Shop", address: "", phone: "" };

    const currentDate = new Date().toLocaleString();
    const total = calculateTotal();
    const paid = parseFloat(paidAmount) || 0;
    const balance = paid - total;

    let invoiceHTML = `
    <html>
      <head>
        <title>Invoice - ${invoiceId}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2, h4, p { margin: 4px 0; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #000; padding: 6px; text-align: left; font-size: 12px; }
          .right { text-align: right; }
        </style>
      </head>
      <body>
        <h2>🛒 ${shop.shop_name}</h2>
        <p>${shop.shop_address}<br>Tel: ${shop.shop_tp}</p>
        <p><strong>Invoice No:</strong> ${invoiceId}<br><strong>Date:</strong> ${currentDate}</p>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Disc</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>`;

    cart.forEach((item) => {
      const discount = item.appliedDiscount ?? 0;
      const discountedPrice =
        item.seling_price - (discount / 100) * item.seling_price;
      const itemTotal = discountedPrice * item.qty;

      invoiceHTML += `
      <tr>
        <td>${item.item_name.slice(0, 25)}</td>
        <td class="right">${item.qty}</td>
        <td class="right">Rs ${item.seling_price.toFixed(2)}</td>
        <td class="right">${discount}%</td>
        <td class="right">Rs ${itemTotal.toFixed(2)}</td>
      </tr>`;
    });

    invoiceHTML += `
          </tbody>
        </table>
        <br>
        <table>
          <tr><td class="right"><strong>Total:</strong></td><td class="right">Rs ${total.toFixed(
            2
          )}</td></tr>
          <tr><td class="right"><strong>Paid:</strong></td><td class="right">Rs ${paid.toFixed(
            2
          )}</td></tr>
          <tr><td class="right"><strong>Balance:</strong></td><td class="right">Rs ${balance.toFixed(
            2
          )}</td></tr>
        </table>
        <br>
        <p><strong>🙏 Thank you for shopping with us!</strong><br>Visit again!</p>
      </body>
    </html>
  `;

    const printWindow = window.open();
    printWindow.document.open();
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    // printWindow.close();
  } catch (error) {
    console.error("Error printing invoice:", error);
    alert("Unable to fetch shop details for invoice.");
  }
};


  return (
    <div style={{ display: "flex", gap: "30px", padding: "20px" }}>
      <div style={{ flex: 1 }}>
        <h2>📦 Stock Management</h2>
        <input
          type="text"
          placeholder="🔍 Search by name, code or category"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%", padding: "6px", marginBottom: "20px" }}
        />
        <table
          style={{ width: "100%", borderCollapse: "collapse" }}
          border="1"
          cellPadding="5"
        >
          <thead style={{ backgroundColor: "#eee" }}>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Discounts</th>
              <th>Add</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((item) => (
              <tr key={item.item_code}>
                <td>{item.item_code}</td>
                <td>{item.item_name}</td>
                <td>{item.category}</td>
                <td>{item.qty}</td>
                <td>{item.seling_price.toFixed(2)}</td>
                <td>
                  {parseDiscounts(item.discount).map((d, i) => (
                    <span
                      key={i}
                      style={{
                        marginRight: "5px",
                        padding: "2px 6px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "4px",
                        fontSize: "12px",
                      }}
                    >
                      {d}%
                    </span>
                  ))}
                </td>
                <td>
                  <button
                    onClick={() => addToBill(item)}
                    disabled={item.qty === 0}
                    style={{
                      cursor: item.qty === 0 ? "not-allowed" : "pointer",
                      backgroundColor: item.qty === 0 ? "#ccc" : "#1890ff",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "4px",
                    }}
                  >
                    Add
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ flex: 1 }}>
        <h2>🧾 Current Bill</h2>
        {cart.length === 0 ? (
          <p>No items in the bill.</p>
        ) : (
          <>
            <table
              style={{ width: "100%", borderCollapse: "collapse" }}
              border="1"
              cellPadding="5"
            >
              <thead style={{ backgroundColor: "#eee" }}>
                <tr>
                  <th>Name</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Total</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, idx) => {
                  const discount = item.appliedDiscount ?? 0;
                  const discountAmount = (item.seling_price * discount) / 100;
                  const discountedPrice = item.seling_price - discountAmount;
                  const totalPrice = discountedPrice * item.qty;

                  return (
                    <tr key={idx}>
                      <td>{item.item_name}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          max={
                            stocks.find((s) => s.item_code === item.item_code)
                              ?.qty + item.qty
                          }
                          value={item.qty}
                          onChange={(e) =>
                            updateQty(item.item_code, Number(e.target.value))
                          }
                          style={{ width: "60px" }}
                        />
                      </td>
                      <td>{item.seling_price}</td>
                      <td>
                        {parseDiscounts(item.discount).map((d, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              let currentDisc = item.appliedDiscount || 0;
                              let newDisc = currentDisc + d;
                              if (newDisc > 100) newDisc = 100;

                              const updatedCart = cart.map((ci) =>
                                ci.item_code === item.item_code
                                  ? { ...ci, appliedDiscount: newDisc }
                                  : ci
                              );
                              setCart(updatedCart);
                              localStorage.setItem(
                                "cart",
                                JSON.stringify(updatedCart)
                              );
                            }}
                            style={{
                              marginRight: "5px",
                              backgroundColor: "#1890ff",
                              color: "white",
                              border: "none",
                              padding: "5px 10px",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                            title={`Add ${d}% discount`}
                          >
                            {d}%
                          </button>
                        ))}
                        <div style={{ marginTop: "6px", fontWeight: "bold" }}>
                          Applied: {discount}%
                        </div>
                      </td>
                      <td>{totalPrice.toFixed(2)}</td>
                      <td>
                        <button
                          onClick={() => removeFromBill(item.item_code)}
                          style={{
                            backgroundColor: "#ff4d4f",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            cursor: "pointer",
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan="4"
                    style={{ textAlign: "right", fontWeight: "bold" }}
                  >
                    Total:
                  </td>
                  <td colSpan="2" style={{ fontWeight: "bold" }}>
                    {calculateTotal().toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>

            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <button
                onClick={() => setShowPaymentPopup(true)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#52c41a",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                ✅ Complete Payment
              </button>
            </div>
          </>
        )}

        {/* Payment Modal */}
        {showPaymentPopup && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999,
            }}
          >
            <div
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "10px",
                width: "400px",
                boxShadow: "0 0 10px rgba(0,0,0,0.3)",
              }}
            >
              <h3>🧾 Payment Details</h3>
              <div style={{ marginBottom: "10px" }}>
                <label>Total Amount: </label>
                <strong>Rs. {calculateTotal().toFixed(2)}</strong>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Payment Method: </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ width: "100%", padding: "6px" }}
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Paid Amount: </label>
                <input
                  type="number"
                  min="0"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  style={{ width: "100%", padding: "6px" }}
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label>Balance: </label>
                <strong>Rs. {getBalance()}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>           
                <button
                  onClick={async () => {
                    try {
                      const total = calculateTotal();
                      console.log("user", user);
                      console.log("cart", cart);                    
                      const response = await createInvoice(
                        cart,
                        total,
                        user,
                        paymentMethod
                      ); // Make sure this returns invoice data
                      const savedInvoice = response.data;
                      console.log("Saved Invoice:", savedInvoice);
                      // Step 2: Notify success
                      alert(
                        `Payment successful via ${paymentMethod}. Invoice saved!`
                      );
                      const itemsToUpdate = cart.map((item) => ({
                        itemid: item._id,
                        qty: item.qty,
                      }));
                      await StockService.updateStockQuantities(itemsToUpdate);
                      printInvoice(response._id);
                      console.log("hii", response._id);

                      // Step 4: Reset UI state
                      setCart([]);
                      localStorage.removeItem("cart");
                      fetchStocks();
                      resetPayment();
                    } catch (error) {
                      console.error("Invoice save error:", error);
                      alert("Payment processed, but failed to save invoice!");
                    }
                  }}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#1890ff",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Confirm
                </button>

                <button
                  onClick={resetPayment}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#ccc",
                    color: "#333",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
             >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;
