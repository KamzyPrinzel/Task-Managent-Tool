const express = require('express');
const Task = require('../models/task');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
    const { title, description, deadline, priority } = req.body;
    try {
        const task = new Task({ title, description, deadline, priority, user: req.user.id });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task' });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
});

module.exports = router;
