import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = 'mongodb+srv://rohith:rohith@rohith.jygyyqq.mongodb.net/kiranaconnect?appName=rohith';

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    phone: String,
    address: String,
    createdAt: Date
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@kiranaconnect.com' });
        if (existingAdmin) {
            console.log('✅ Admin already exists!');
            console.log('📧 Email: admin@kiranaconnect.com');
            console.log('🔑 Password: admin123');
            await mongoose.disconnect();
            return;
        }

        // Hash password - admin123
        const hashedPassword = await bcrypt.hash('admin123', 10);
        console.log('Password hashed successfully');

        // Create admin user
        const admin = new User({
            name: 'Super Admin',
            email: 'admin@kiranaconnect.com',
            password: hashedPassword,
            role: 'admin',
            phone: '9999999999',
            address: 'Admin Office, Main Street',
            createdAt: new Date()
        });

        await admin.save();
        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: admin@kiranaconnect.com');
        console.log('🔑 Password: admin123');

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createAdmin();