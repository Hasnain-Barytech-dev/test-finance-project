const db = require('../config/database');

class Transaction {
  static async create(transactionData) {
    const { userId, categoryId, type, amount, description, date } = transactionData;
    
    const result = await db.query(
      `INSERT INTO transactions (user_id, category_id, type, amount, description, date) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, user_id, category_id, type, amount, description, date, created_at`,
      [userId, categoryId, type, amount, description, date]
    );
    
    return result.rows[0];
  }

  static async findByUserId(userId, options = {}) {
    const { page = 1, limit = 10, type, categoryId, startDate, endDate } = options;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT t.*, c.name as category_name 
      FROM transactions t 
      LEFT JOIN categories c ON t.category_id = c.id 
      WHERE t.user_id = $1`;
    
    const params = [userId];
    let paramCount = 1;
    
    if (type) {
      paramCount++;
      query += ` AND t.type = $${paramCount}`;
      params.push(type);
    }
    
    if (categoryId) {
      paramCount++;
      query += ` AND t.category_id = $${paramCount}`;
      params.push(categoryId);
    }
    
    if (startDate) {
      paramCount++;
      query += ` AND t.date >= $${paramCount}`;
      params.push(startDate);
    }
    
    if (endDate) {
      paramCount++;
      query += ` AND t.date <= $${paramCount}`;
      params.push(endDate);
    }
    
    query += ` ORDER BY t.date DESC, t.created_at DESC LIMIT $${++paramCount} OFFSET $${++paramCount}`;
    params.push(limit, offset);
    
    const result = await db.query(query, params);
    
    let countQuery = 'SELECT COUNT(*) FROM transactions WHERE user_id = $1';
    const countParams = [userId];
    let countParamCount = 1;
    
    if (type) {
      countQuery += ` AND type = $${++countParamCount}`;
      countParams.push(type);
    }
    
    if (categoryId) {
      countQuery += ` AND category_id = $${++countParamCount}`;
      countParams.push(categoryId);
    }
    
    if (startDate) {
      countQuery += ` AND date >= $${++countParamCount}`;
      countParams.push(startDate);
    }
    
    if (endDate) {
      countQuery += ` AND date <= $${++countParamCount}`;
      countParams.push(endDate);
    }
    
    const countResult = await db.query(countQuery, countParams);
    
    return {
      transactions: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    };
  }

  static async findById(id, userId = null) {
    let query = `
      SELECT t.*, c.name as category_name 
      FROM transactions t 
      LEFT JOIN categories c ON t.category_id = c.id 
      WHERE t.id = $1`;
    
    const params = [id];
    
    if (userId) {
      query += ` AND t.user_id = $2`;
      params.push(userId);
    }
    
    const result = await db.query(query, params);
    return result.rows[0];
  }

  static async update(id, transactionData, userId = null) {
    const { categoryId, type, amount, description, date } = transactionData;
    
    let query = `
      UPDATE transactions 
      SET category_id = $1, type = $2, amount = $3, description = $4, date = $5, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $6`;
    
    const params = [categoryId, type, amount, description, date, id];
    
    if (userId) {
      query += ` AND user_id = $7`;
      params.push(userId);
    }
    
    query += ` RETURNING *`;
    
    const result = await db.query(query, params);
    return result.rows[0];
  }

  static async delete(id, userId = null) {
    let query = `DELETE FROM transactions WHERE id = $1`;
    const params = [id];
    
    if (userId) {
      query += ` AND user_id = $2`;
      params.push(userId);
    }
    
    const result = await db.query(query, params);
    return result.rowCount > 0;
  }

  static async getMonthlyTotals(userId, year) {
    const result = await db.query(`
      SELECT 
        EXTRACT(MONTH FROM date)::INTEGER as month,
        type::TEXT,
        SUM(amount)::NUMERIC as total
      FROM transactions 
      WHERE user_id = $1 AND EXTRACT(YEAR FROM date) = $2
      GROUP BY EXTRACT(MONTH FROM date), type
      ORDER BY month
    `, [userId, year]);
    
    return result.rows;
  }

  static async getCategoryTotals(userId, startDate, endDate) {
    const result = await db.query(`
      SELECT 
        c.name,
        t.type::TEXT,
        SUM(t.amount) as total,
        COUNT(t.id) as count
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1 AND t.date BETWEEN $2 AND $3
      GROUP BY c.id, c.name, t.type
      ORDER BY total DESC
    `, [userId, startDate, endDate]);
    
    return result.rows;
  }
}

module.exports = Transaction;