const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getCompletedOrders,
  getIncompleteOrders,
  getDeleveredOrders
} = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createOrder);
router.get('/', authMiddleware, getOrders);
router.get('/completed',authMiddleware, getCompletedOrders);
router.get('/incompleted',authMiddleware, getIncompleteOrders);
router.get('/delevered',authMiddleware, getDeleveredOrders);
router.get('/:id', authMiddleware, getOrderById);
router.put('/:id', authMiddleware, updateOrder);
router.delete('/:id', authMiddleware, deleteOrder);


module.exports = router;
