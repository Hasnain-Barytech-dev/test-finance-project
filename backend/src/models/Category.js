const db = require('../config/database');

class Category {
  static async findAll() {
    const result = await db.query(
      'SELECT id, name, type, created_at FROM categories ORDER BY type, name'
    );
    return result.rows;
  }

  static async findByType(type) {
    const result = await db.query(
      'SELECT id, name, type, created_at FROM categories WHERE type = $1 ORDER BY name',
      [type]
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query(
      'SELECT id, name, type, created_at FROM categories WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async create(categoryData) {
    const { name, type } = categoryData;
    
    const result = await db.query(
      'INSERT INTO categories (name, type) VALUES ($1, $2) RETURNING id, name, type, created_at',
      [name, type]
    );
    
    return result.rows[0];
  }

  static async update(id, categoryData) {
    const { name, type } = categoryData;
    
    const result = await db.query(
      'UPDATE categories SET name = $1, type = $2 WHERE id = $3 RETURNING id, name, type',
      [name, type, id]
    );
    
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM categories WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}

module.exports = Category;