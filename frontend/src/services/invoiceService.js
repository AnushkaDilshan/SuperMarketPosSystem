
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL;



export const createInvoice = async (items,total,user,paymentMethod) => {
  const res = await axios.post(`${API_URL}/invoice/create-invoice`, {
    items,
    total,
    user, 
    paymentMethod
  });
  return res.data;
};
export const getAllInvoices = async () => {
  const res = await axios.get(`${API_URL}/invoice/all`);
  return res.data;
};
export const deleteInvoice = async (invoiceId) => {
  const res = await axios.delete(`${API_URL}/invoice/${invoiceId}`);
  return res.data;
};
export const getbyInvoiceid = async (invoiceId) => {
  const res = await axios.get(`${API_URL}/invoice/${invoiceId}`);
  return res.data;
};