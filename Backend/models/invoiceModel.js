const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
      _id: {
    type: String, // <-- Allow string ID like "INV-000001"
    required: true
  },
    items: [
        {
            item_code: String,
            name: String,
            qty: Number,
            price: Number,
            applied_discount: Number
        }
    ],
    total: {
        type: Number,
        required: true
    },
      userid: {
        type: mongoose.Schema.Types.ObjectId, // ideally reference the User collection
        required: true,
        ref: 'User' // assuming you have a User model
    },
   payment_method: {
    type: String, 
    required: true
  },
  return: {
    type: String, 
  
  },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Invoice", invoiceSchema);
