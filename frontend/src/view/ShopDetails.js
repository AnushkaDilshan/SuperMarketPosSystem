import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/shop.module.css'; // CSS Module

const ShopForm = () => {
  const [form, setForm] = useState({
    shop_name: '',
    shop_address: '',
    shop_tp: '',
    shop_email: ''
  });
  const [shopId, setShopId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/shop')
      .then(res => {
        if (res.data.length > 0) {
          const shop = res.data[0];
          setForm(shop);
          setShopId(shop._id);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (shopId) {
      await axios.put(`http://localhost:5000/api/shop/${shopId}`, form);
      setMessage('Shop updated successfully!');
    } else {
      try {
        await axios.post('http://localhost:5000/api/shop', form);
        setMessage('Shop created successfully!');
        const res = await axios.get('http://localhost:5000/api/shop');
        setForm(res.data[0]);
        setShopId(res.data[0]._id);
      } catch (err) {
        setMessage(err.response?.data?.message || 'Failed to create shop.');
      }
    }
  };

  return (
    <div className={styles.shopContainer}>
      <div className={styles.shopCard}>
        <h1 className={styles.shopTitle}>{shopId ? 'Update Shop' : 'Create Shop'}</h1>
        {message && <div className={styles.shopMessage}>{message}</div>}

        <form onSubmit={handleSubmit} className={styles.shopForm}>
          <div className={styles.formGroup}>
            <label>Shop Name</label>
            <input
              type="text"
              name="shop_name"
              value={form.shop_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Shop Address</label>
            <input
              type="text"
              name="shop_address"
              value={form.shop_address}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Telephone</label>
            <input
              type="text"
              name="shop_tp"
              value={form.shop_tp}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="shop_email"
              value={form.shop_email}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className={styles.shopButton}>
            {shopId ? 'Update Shop' : 'Create Shop'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShopForm;
