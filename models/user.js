const db = require('../config/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class UserModel {
    static async create(email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        
        const [result] = await db.execute(
            'INSERT INTO users (id, email, password) VALUES (?, ?, ?)', 
            [userId, email, hashedPassword]
        );
        
        return userId;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }
}