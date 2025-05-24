require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors =require('cors');
const authRoutes = require('./routes/user');
const stockRoutes = require('./routes/stockRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const shopDetailsRoutes = require('./routes/shopDetailRoute');
const envRoutes = require('./routes/envRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/shop', shopDetailsRoutes);
app.use('/api', envRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
