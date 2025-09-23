const express = require('express');
const { 
  getTransactions, 
  getTransaction, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction, 
  getCategories,
  validateTransaction 
} = require('../controllers/transactionController');
const auth = require('../middleware/auth');
const { authorize, checkResourceAccess } = require('../middleware/rbac');
const { transactionLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(auth);
router.use(transactionLimiter);

router.get('/categories', getCategories);
router.get('/', getTransactions);
router.get('/:id', getTransaction);
router.post('/', checkResourceAccess, validateTransaction, createTransaction);
router.put('/:id', checkResourceAccess, validateTransaction, updateTransaction);
router.delete('/:id', checkResourceAccess, deleteTransaction);

module.exports = router;
