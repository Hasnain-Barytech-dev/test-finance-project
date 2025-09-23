const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const { body, validationResult } = require('express-validator');

const validateTransaction = [
  body('categoryId').isUUID(),
  body('type').isIn(['income', 'expense']),
  body('amount').isFloat({ min: 0.01 }),
  body('description').optional().trim(),
  body('date').isISO8601().toDate()
];

const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, categoryId, startDate, endDate } = req.query;
    const userId = req.user.role === 'admin' ? req.query.userId : req.user.id;
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      type,
      categoryId,
      startDate,
      endDate
    };

    const result = await Transaction.findByUserId(userId, options);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.role === 'admin' ? null : req.user.id;
    
    const transaction = await Transaction.findById(id, userId);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createTransaction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { categoryId, type, amount, description, date } = req.body;
    const userId = req.user.role === 'admin' && req.body.userId ? req.body.userId : req.user.id;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    if (category.type !== type) {
      return res.status(400).json({ message: 'Category type does not match transaction type' });
    }

    const transaction = await Transaction.create({
      userId,
      categoryId,
      type,
      amount,
      description,
      date
    });

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { categoryId, type, amount, description, date } = req.body;
    const userId = req.user.role === 'admin' ? null : req.user.id;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    if (category.type !== type) {
      return res.status(400).json({ message: 'Category type does not match transaction type' });
    }

    const transaction = await Transaction.update(id, {
      categoryId,
      type,
      amount,
      description,
      date
    }, userId);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found or access denied' });
    }

    res.json({
      message: 'Transaction updated successfully',
      transaction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.role === 'admin' ? null : req.user.id;

    const deleted = await Transaction.delete(id, userId);

    if (!deleted) {
      return res.status(404).json({ message: 'Transaction not found or access denied' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCategories = async (req, res) => {
  try {
    const { type } = req.query;
    const categories = type ? await Category.findByType(type) : await Category.findAll();
    res.json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getCategories,
  validateTransaction
};
