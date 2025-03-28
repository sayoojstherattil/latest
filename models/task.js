class TaskModel {
    static async create(task) {
        const taskId = uuidv4();
        
        await db.execute(
            'INSERT INTO tasks (id, title, completed, category_id, reminder_date, due_date, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                taskId, 
                task.title, 
                task.completed || false, 
                task.categoryId, 
                task.reminderDate, 
                task.dueDate, 
                task.userId
            ]
        );
        
        return taskId;
    }

    static async findByUser(userId) {
        const [rows] = await db.execute(
            'SELECT * FROM tasks WHERE user_id = ?', 
            [userId]
        );
        return rows.map(row => ({
            ...row,
            reminderDate: row.reminder_date ? new Date(row.reminder_date) : undefined,
            dueDate: row.due_date ? new Date(row.due_date) : undefined,
            createdAt: new Date(row.created_at)
        }));
    }

    static async update(taskId, updates) {
        const updateFields = [];
        const updateValues = [];

        if (updates.title !== undefined) {
            updateFields.push('title = ?');
            updateValues.push(updates.title);
        }
        if (updates.completed !== undefined) {
            updateFields.push('completed = ?');
            updateValues.push(updates.completed);
        }
        if (updates.categoryId !== undefined) {
            updateFields.push('category_id = ?');
            updateValues.push(updates.categoryId);
        }
        if (updates.reminderDate !== undefined) {
            updateFields.push('reminder_date = ?');
            updateValues.push(updates.reminderDate);
        }
        if (updates.dueDate !== undefined) {
            updateFields.push('due_date = ?');
            updateValues.push(updates.dueDate);
        }

        if (updateFields.length === 0) return;

        updateValues.push(taskId);

        await db.execute(
            `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );
    }

    static async delete(taskId) {
        await db.execute('DELETE FROM tasks WHERE id = ?', [taskId]);
    }
}

module.exports = {
    UserModel,
    CategoryModel,
    TaskModel
};