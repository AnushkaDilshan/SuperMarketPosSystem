const express = require('express');
const router = express.Router();
const { updateMongoCredentials } = require('../controllers/envController');

router.post('/update-env', updateMongoCredentials);

module.exports = router;
