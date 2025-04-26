const client = require('./db-conn');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

// Initialize default admin in users table if it doesn't exist
const initAdmin = async () => {
    try {
        // Check if default admin exists
        const defaultAdmin = await client.query('SELECT * FROM users WHERE email = $1 AND roles = $2', ['admin@maa.com', 'admin']);
        
        if (defaultAdmin.rows.length === 0) {
            const passwordHash = await bcrypt.hash('admin123', saltRounds);
            // Insert admin into users table
            await client.query(
                'INSERT INTO users (first_name, last_name, email, password, roles, dob) VALUES ($1, $2, $3, $4, $5, $6)',
                ['Admin', 'User', 'admin@maa.com', passwordHash, 'admin', new Date()]
            );
        }
    } catch (error) {
        console.error('Error initializing admin:', error);
        throw error;
    }
};

const authenticateAdmin = async (email, password) => {
    try {
        const result = await client.query('SELECT * FROM users WHERE email = $1 AND roles = $2', [email, 'admin']);
        if (result.rows.length === 0) {
            return null;
        }

        const admin = result.rows[0];
        const isValid = await bcrypt.compare(password, admin.password);
        
        if (!isValid) {
            return null;
        }

        // Update last login time (if you want to add this column to users table)
        // await client.query(
        //     'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        //     [admin.id]
        // );

        // Generate JWT token
        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: 'admin' },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        return {
            id: admin.id,
            email: admin.email,
            firstName: admin.first_name,
            lastName: admin.last_name,
            role: admin.roles,
            token
        };
    } catch (error) {
        console.error('Error authenticating admin:', error);
        throw error;
    }
};

const changeAdminPassword = async (adminId, newPassword) => {
    try {
        const passwordHash = await bcrypt.hash(newPassword, saltRounds);
        const result = await client.query(
            'UPDATE users SET password = $1 WHERE id = $2 AND roles = $3 RETURNING *',
            [passwordHash, adminId, 'admin']
        );
        
        if (result.rows.length === 0) {
            throw new Error('Admin not found');
        }
        
        return true;
    } catch (error) {
        console.error('Error changing admin password:', error);
        throw error;
    }
};

// Initialize the admin when the application starts
initAdmin().catch(console.error);

module.exports = {
    authenticateAdmin,
    changeAdminPassword
}; 