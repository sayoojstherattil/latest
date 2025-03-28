class CategoryModel {
    static async create(userId, name, color) {
        const categoryId = uuidv4();
        
        await db.execute(
            'INSERT INTO categories (id, name, color, user_id) VALUES (?, ?, ?, ?)', 
            [categoryId, name, color, userId]
        );
        
        return categoryId;
    }

    static async findByUser(userId) {
        const [rows] = await db.execute(
            'SELECT * FROM categories WHERE user_id = ?', 
            [userId]
        );
        return rows;
    }

    static async delete(categoryId) {
        await db.execute('DELETE FROM categories WHERE id = ?', [categoryId]);
    }
}