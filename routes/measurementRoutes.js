const express = require('express');
const {
  createMeasurement,
  getMeasurements,
  getMeasurementById,
  updateMeasurement,
  deleteMeasurement
} = require('../controllers/measurementController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createMeasurement);
router.get('/', authMiddleware, getMeasurements);
router.get('/:id', authMiddleware, getMeasurementById);
router.put('/:id', authMiddleware, updateMeasurement);
router.delete('/:id', authMiddleware, deleteMeasurement);

module.exports = router;
