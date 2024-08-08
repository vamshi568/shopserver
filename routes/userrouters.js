const express = require('express');
const { saveData } = require('../controllers/userDetails');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/savedata',authMiddleware, saveData);

module.exports = router;
