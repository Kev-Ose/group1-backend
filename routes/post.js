import express from 'express';
import query from '../config/db.js'; // Import the query function

const router = express.Router();

// Route to get all blogs
router.get('/', async (req, res) => {
    const sql = 'SELECT * FROM blogs';

    try {
        const results = await query(sql); // Use the query function to fetch data
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: 'Database error', error: err });
    }
});

// Route to get a blog by ID
router.get('/:id', async (req, res) => {
    const blogId = req.params.id;
    const sql = 'SELECT * FROM blogs WHERE id = ?';

    try {
        const results = await query(sql, [blogId]); // Use the query function with a parameter
        if (results.length === 0) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ message: 'Database error', error: err });
    }
});

export default router;
