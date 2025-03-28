// routes/index.js
const express = require('express');
const { authMiddleware, AuthController } = require('../controllers/auth');
const { CategoryModel, TaskModel } = require('../models');

const router = express.Router();

// Authentication Routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Category Routes
router.get('/categories', authMiddleware, async (req, res) => {
    try {
        const categories = await CategoryModel.findByUser(req.user.id);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/categories', authMiddleware, async (req, res) => {
    try {
        const { name, color } = req.body;
        const categoryId = await CategoryModel.create(req.user.id, name, color);
        res.status(201).json({ id: categoryId, name, color });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/categories/:id', authMiddleware, async (req, res) => {
    try {
        await CategoryModel.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Task Routes
router.get('/tasks', authMiddleware, async (req, res) => {
    try {
        const tasks = await TaskModel.findByUser(req.user.id);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/tasks', authMiddleware, async (req, res) => {
    try {
        const taskData = { ...req.body, userId: req.user.id };
        const taskId = await TaskModel.create(taskData);
        res.status(201).json({ id: taskId, ...taskData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/tasks/:id', authMiddleware, async (req, res) => {
    try {
        await TaskModel.update(req.params.id, req.body);
        res.status(200).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/tasks/:id', authMiddleware, async (req, res) => {
    try {
        await TaskModel.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;