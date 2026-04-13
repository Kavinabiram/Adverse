const db = require('../config/db');
const bcrypt = require('bcryptjs');

/**
 * Service for initial admin setup
 */
class SetupAdminService {
  /**
   * Ensures the database table is ready for the first admin
   */
  async ensureSchema() {
    await db.query(`
      DO $$ 
      BEGIN 
        BEGIN
          ALTER TABLE users ADD COLUMN password_hash VARCHAR;
        EXCEPTION
          WHEN duplicate_column THEN RAISE NOTICE 'column password_hash already exists in users.';
        END;
      END $$;
    `);
  }

  /**
   * Checks if an admin already exists
   * @returns {Promise<boolean>}
   */
  async adminExists() {
    const result = await db.query(
      "SELECT id FROM users WHERE role = 'Admin' LIMIT 1"
    );
    return result.rows.length > 0;
  }

  /**
   * Creates the first admin account
   * @param {Object} adminData 
   * @returns {Promise<Object>}
   */
  async createAdmin(adminData) {
    const { name, email, password } = adminData;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const insertQuery = `
      INSERT INTO users (auth_uid, name, email, password_hash, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, role, created_at
    `;
    
    // auth_uid is required in the schema, using email as auth_uid for now
    const result = await db.query(insertQuery, [email, name, email, passwordHash, 'Admin']);
    return result.rows[0];
  }
}

module.exports = new SetupAdminService();
