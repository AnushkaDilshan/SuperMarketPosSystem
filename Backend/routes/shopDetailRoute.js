const express = require('express');
const router = express.Router();
const {createShop,getAllShops,getShopById,updateShop,deleteShop} = require('../controllers/shopdetailsController');

router.post('/', createShop);
router.get('/', getAllShops);
router.get('/:id', getShopById);
router.put('/:id', updateShop);
router.delete('/:id', deleteShop);

module.exports = router;
