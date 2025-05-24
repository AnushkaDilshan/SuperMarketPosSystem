import axios from 'axios';

//const API_BASE_URL = 'http://localhost:5000/api/stock';
const API_URL = process.env.REACT_APP_API_BASE_URL;
class StockService {
  // Fetch all stocks
  static async fetchStocks() {
    try {
      const response = await axios.get(`${API_URL}/stock/all`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Upload Excel file
  static async uploadExcel(file,userId) {
    try {
      const formData = new FormData();
      formData.append('file', file);
       formData.append('userId', userId);
      const response = await axios.post(`${API_URL}/stock/upload-excel`, formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async deleteStock(itemId, userId) {
  try {
    const formData = new FormData();
    formData.append('userId', userId);

    const response = await axios.delete(`${API_URL}/stock/${itemId}`, {
      data: formData, // axios needs `data` for body in DELETE
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}
static async updateStockQuantities(items) {
    try {
      const response = await axios.post(`${API_URL}/stock/update-qty`, { items });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  
}

export default StockService;
