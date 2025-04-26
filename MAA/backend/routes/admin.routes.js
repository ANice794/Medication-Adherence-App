const express = require('express');
const router = express.Router();
const { authenticateAdmin, changeAdminPassword } = require('../models/admin.models');
const client = require('../models/db-conn');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Admin login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }

        const admin = await authenticateAdmin(email, password);
        
        if (!admin) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        res.json({
            success: true,
            data: admin
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const result = await client.query(
            'SELECT * FROM users ORDER BY created_at DESC'
        );
        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const result = await client.query(
            'SELECT * FROM users WHERE id = $1',
            [req.params.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user'
        });
    }
});

// Update user
router.put('/users/:id', async (req, res) => {
    const { first_name, last_name, email, roles } = req.body;
    try {
        const result = await client.query(
            'UPDATE users SET first_name = $1, last_name = $2, email = $3, roles = $4 WHERE id = $5 RETURNING id, first_name, last_name, email, roles, created_at',
            [first_name, last_name, email, roles, req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user'
        });
    }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const result = await client.query(
            'DELETE FROM users WHERE id = $1 RETURNING id',
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user'
        });
    }
});

// Change admin password route
router.post('/change-password', async (req, res) => {
    try {
        const { adminId, newPassword } = req.body;
        
        if (!adminId || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Admin ID and new password are required' 
            });
        }

        await changeAdminPassword(adminId, newPassword);
        
        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Create new user
router.post('/users', async (req, res) => {
    const { first_name, last_name, email, roles } = req.body;
    try {
        // Generate a random password
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, saltRounds);

        const result = await client.query(
            'INSERT INTO users (first_name, last_name, email, password, roles, created_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING id, first_name, last_name, email, roles, created_at',
            [first_name, last_name, email, hashedPassword, roles]
        );

        // TODO: Send email with temporary password to user

        res.json({
            success: true,
            data: result.rows[0],
            tempPassword // In a production environment, this should be sent via email instead
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create user'
        });
    }
});

module.exports = router; 