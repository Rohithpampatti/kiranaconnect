import express from 'express';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category) query.category = category;
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create product (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update product (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete product (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;