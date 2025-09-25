const Transaction = require('../models/Transaction');
const redisClient = require('../config/redis');

const getOverview = async (req, res) => {
  try {
    const userId = req.user.role === 'admin' && req.query.userId ? req.query.userId : req.user.id;
    const cacheKey = `analytics:overview:${userId}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const year = new Date().getFullYear();
    const monthlyData = await Transaction.getMonthlyTotals(userId, year);

    const overview = {
      year,
      monthlyIncome: Array(12).fill(0),
      monthlyExpenses: Array(12).fill(0),
      totalIncome: 0,
      totalExpenses: 0,
      netSavings: 0
    };

    monthlyData.forEach(row => {
      const monthIndex = row.month - 1;
      const amount = Math.abs(parseFloat(row.total));
      const type = String(row.type).toLowerCase();
      
      if (type === 'income') {
        overview.monthlyIncome[monthIndex] = amount;
        overview.totalIncome += amount;
      } else if (type === 'expense') {
        overview.monthlyExpenses[monthIndex] = amount;
        overview.totalExpenses += amount;
      }
    });

    overview.netSavings = overview.totalIncome - overview.totalExpenses;

    await redisClient.setEx(cacheKey, 900, JSON.stringify(overview));
    res.json(overview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCategoryBreakdown = async (req, res) => {
  try {
    const userId = req.user.role === 'admin' && req.query.userId ? req.query.userId : req.user.id;
    const { startDate, endDate } = req.query;
    
    const start = startDate || `${new Date().getFullYear()}-01-01`;
    const end = endDate || `${new Date().getFullYear()}-12-31`;
    
    const cacheKey = `analytics:categories:${userId}:${start}:${end}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const categoryData = await Transaction.getCategoryTotals(userId, start, end);
    
    const breakdown = {
      income: [],
      expenses: [],
      totalIncome: 0,
      totalExpenses: 0
    };

    categoryData.forEach(row => {
      const categoryInfo = {
        name: row.name,
        amount: Math.abs(parseFloat(row.total)),
        count: parseInt(row.count),
        percentage: 0
      };
      const type = String(row.type).toLowerCase();

      if (type === 'income') {
        breakdown.income.push(categoryInfo);
        breakdown.totalIncome += categoryInfo.amount;
      } else if (type === 'expense') {
        breakdown.expenses.push(categoryInfo);
        breakdown.totalExpenses += categoryInfo.amount;
      }
    });

    breakdown.income.forEach(item => {
      item.percentage = breakdown.totalIncome > 0 ? 
        ((item.amount / breakdown.totalIncome) * 100).toFixed(2) : 0;
    });

    breakdown.expenses.forEach(item => {
      item.percentage = breakdown.totalExpenses > 0 ? 
        ((item.amount / breakdown.totalExpenses) * 100).toFixed(2) : 0;
    });

    await redisClient.setEx(cacheKey, 900, JSON.stringify(breakdown));
    res.json(breakdown);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTrends = async (req, res) => {
  try {
    const userId = req.user.role === 'admin' && req.query.userId ? req.query.userId : req.user.id;
    const { months = 6 } = req.query;
    
    const cacheKey = `analytics:trends:${userId}:${months}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));

    const year = endDate.getFullYear();
    const monthlyData = await Transaction.getMonthlyTotals(userId, year);

    console.log('getTrends - monthlyData from DB:', monthlyData);

    const trends = {
      labels: [],
      income: [],
      expenses: [],
      savings: []
    };

    for (let i = parseInt(months) - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const month = date.getMonth() + 1;
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      trends.labels.push(monthName);
      
      const incomeData = monthlyData.find(d => Number(d.month) === month && String(d.type).toLowerCase() === 'income');
      const expenseData = monthlyData.find(d => Number(d.month) === month && String(d.type).toLowerCase() === 'expense');
      
      console.log(`Month ${month} (${monthName}):`, { incomeData, expenseData });
      
      const income = incomeData ? Math.abs(parseFloat(incomeData.total)) : 0;
      const expenses = expenseData ? Math.abs(parseFloat(expenseData.total)) : 0;
      
      trends.income.push(income);
      trends.expenses.push(expenses);
      trends.savings.push(income - expenses);
    }

    await redisClient.setEx(cacheKey, 900, JSON.stringify(trends));
    res.json(trends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getOverview,
  getCategoryBreakdown,
  getTrends
};
