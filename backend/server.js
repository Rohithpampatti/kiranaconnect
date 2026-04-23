import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
    sendOrderStatusEmail,
    sendWelcomeEmail,
    sendOTPEmail,
    sendVerificationEmail,
    sendOrderConfirmationEmail,
    sendOrderDeliveredEmail
} from './services/emailService.js';

dotenv.config();

const app = express();

// ============= CORS CONFIGURATION =============
const allowedOrigins = [
    'http://localhost:5173',
    'https://kiranaconnect1.vercel.app',
    'https://kiranaconnect.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With']
}));

app.options('*', cors());

// Middleware
app.use(express.json());
app.use(cookieParser());

// Store delivery locations
const deliveryLocations = new Map();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kiranaconnect')
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB error:', err));

// Address Schema
const addressSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type: { type: String, enum: ['home', 'office', 'other'], default: 'home' },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
});

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin', 'delivery'], default: 'user' },
    addresses: { type: [addressSchema], default: [] },
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

// Product Schema
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    image: String,
    stock: Number,
    unit: String,
    brand: String,
    description: String
});

const Product = mongoose.model('Product', productSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        quantity: Number
    }],
    subtotal: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 40 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    deliveryAddress: { type: String, required: true },
    deliveryDate: { type: String, default: '' },
    deliveryTimeSlot: { type: String, default: '' },
    paymentMethod: { type: String, default: 'COD' },
    couponApplied: { type: String, default: null },
    deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerLocation: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null }
    },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Auth Middleware
const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

const deliveryOnly = (req, res, next) => {
    if (req.user.role !== 'delivery') {
        return res.status(403).json({ message: 'Delivery access required' });
    }
    next();
};

// ============= AUTH ROUTES =============
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, phone, address, city, state, pincode, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({
            name,
            email,
            password,
            phone: phone || '',
            address: address || '',
            city: city || '',
            state: state || '',
            pincode: pincode || '',
            role: role || 'user'
        });
        await user.save();

        await sendWelcomeEmail(user);

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '30d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: 'none',
            secure: true,
            domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined
        });

        res.json({
            message: 'Registration successful',
            user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address },
            token: token
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '30d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: 'none',
            secure: true,
            domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined
        });

        res.json({
            message: 'Login successful',
            user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address },
            token: token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
});

app.get('/api/auth/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ============= OTP ROUTES =============
const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    type: { type: String, enum: ['password_reset', 'email_verification'], required: true },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 10 * 60 * 1000) },
    createdAt: { type: Date, default: Date.now }
});

const OTP = mongoose.model('OTP', otpSchema);

// Send OTP
app.post('/api/auth/send-otp', async (req, res) => {
    try {
        const { email, type } = req.body;

        if (type === 'password_reset') {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'No account found with this email' });
            }
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await OTP.deleteMany({ email, type });
        await OTP.create({ email, otp, type });

        await sendOTPEmail(email, otp, type);
        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Verify OTP
app.post('/api/auth/verify-otp', async (req, res) => {
    try {
        const { email, otp, type } = req.body;

        const otpRecord = await OTP.findOne({ email, otp, type });
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        if (otpRecord.expiresAt < new Date()) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({ message: 'OTP has expired' });
        }

        await OTP.deleteOne({ _id: otpRecord._id });

        const resetToken = jwt.sign(
            { email, purpose: 'password_reset' },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '15m' }
        );

        res.json({ message: 'OTP verified', resetToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Reset password
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'secret123');

        if (decoded.purpose !== 'password_reset') {
            return res.status(400).json({ message: 'Invalid token' });
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update profile
app.put('/api/auth/update', protect, async (req, res) => {
    try {
        const { name, phone, address, city, state, pincode } = req.body;
        const user = await User.findById(req.user.id);

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        if (city) user.city = city;
        if (state) user.state = state;
        if (pincode) user.pincode = pincode;

        await user.save();
        res.json({
            message: 'Profile updated successfully',
            user: { id: user._id, name: user.name, email: user.email, phone: user.phone, address: user.address, city: user.city, state: user.state, pincode: user.pincode }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Change password
app.post('/api/auth/change-password', protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        const isValid = await user.comparePassword(currentPassword);
        if (!isValid) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Address routes
app.get('/api/auth/addresses', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.addresses || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/auth/addresses', protect, async (req, res) => {
    try {
        const { type, address, city, state, pincode, isDefault } = req.body;
        const user = await User.findById(req.user.id);

        if (!user.addresses) user.addresses = [];

        if (isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        const newAddress = {
            id: Date.now().toString(),
            type: type || 'home',
            address,
            city,
            state,
            pincode,
            isDefault: isDefault || false
        };

        user.addresses.push(newAddress);
        await user.save();
        res.json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/auth/addresses/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.addresses = user.addresses.filter(addr => addr.id !== req.params.id);
        await user.save();
        res.json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ============= PRODUCT ROUTES =============
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/products', protect, adminOnly, async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/products/:id', protect, adminOnly, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/products/:id', protect, adminOnly, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ============= ORDER ROUTES =============
app.post('/api/orders', protect, async (req, res) => {
    try {
        const { items, subtotal, deliveryFee, discount, totalAmount, deliveryAddress, deliveryDate, deliveryTimeSlot, paymentMethod, couponApplied, customerLocation } = req.body;

        const order = new Order({
            user: req.user.id,
            items,
            subtotal: subtotal || 0,
            deliveryFee: deliveryFee || 40,
            discount: discount || 0,
            totalAmount,
            deliveryAddress,
            deliveryDate: deliveryDate || '',
            deliveryTimeSlot: deliveryTimeSlot || '',
            paymentMethod: paymentMethod || 'COD',
            couponApplied: couponApplied || null,
            customerLocation: customerLocation || null
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/orders/my-orders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/orders', protect, adminOnly, async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/orders/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id).populate('user');

        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (req.user.role === 'delivery') {
            if (status === 'out-for-delivery') {
                order.status = status;
                order.deliveryPartner = req.user.id;
            } else if (status === 'delivered') {
                order.status = status;
            } else {
                return res.status(403).json({ message: 'Unauthorized action' });
            }
        }
        else if (req.user.role === 'admin') {
            order.status = status;
            if (status === 'out-for-delivery' && req.body.deliveryPartner) {
                order.deliveryPartner = req.body.deliveryPartner;
            }
        }
        else {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await order.save();

        if (order.user && order.user.email && (status === 'confirmed' || status === 'preparing' || status === 'out-for-delivery' || status === 'delivered')) {
            await sendOrderStatusEmail(order.user, order._id, status, order.totalAmount);
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Track order location
app.get('/api/orders/:orderId/track', protect, async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.user.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'delivery') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const location = deliveryLocations.get(orderId);
        if (location) {
            res.json(location);
        } else {
            res.json({ message: 'Tracking not available yet', status: order.status });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ============= DELIVERY ROUTES =============
app.get('/api/delivery/all-orders', protect, deliveryOnly, async (req, res) => {
    try {
        const orders = await Order.find({
            status: { $in: ['confirmed', 'preparing'] },
            $or: [
                { deliveryPartner: { $exists: false } },
                { deliveryPartner: null }
            ]
        }).populate('user', 'name phone address');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/delivery/orders', protect, deliveryOnly, async (req, res) => {
    try {
        const orders = await Order.find({
            deliveryPartner: req.user.id,
            status: { $in: ['out-for-delivery'] }
        }).populate('user', 'name phone address');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/delivery/accept-order', protect, deliveryOnly, async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'confirmed' && order.status !== 'preparing') {
            return res.status(400).json({ message: 'Order is not ready for pickup' });
        }

        if (order.deliveryPartner) {
            return res.status(400).json({ message: 'Order already assigned to another partner' });
        }

        order.status = 'out-for-delivery';
        order.deliveryPartner = req.user.id;
        await order.save();

        res.json({ success: true, message: 'Order accepted', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/delivery/earnings', protect, deliveryOnly, async (req, res) => {
    try {
        const deliveredOrders = await Order.find({
            deliveryPartner: req.user.id,
            status: 'delivered'
        });

        const totalEarnings = deliveredOrders.length * 50;
        const weekEarnings = deliveredOrders.filter(o => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(o.createdAt) > weekAgo;
        }).length * 50;

        res.json({
            today: deliveredOrders.filter(o => {
                const today = new Date();
                return new Date(o.createdAt).toDateString() === today.toDateString();
            }).length * 50,
            week: weekEarnings,
            month: totalEarnings,
            total: totalEarnings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ============= ADMIN ROUTES =============
app.get('/api/admin/users', protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');

        const usersWithStats = await Promise.all(users.map(async (user) => {
            const orders = await Order.find({ user: user._id });
            const totalOrders = orders.length;
            const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

            return {
                ...user.toObject(),
                totalOrders,
                totalSpent
            };
        }));

        res.json(usersWithStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/admin/users/:id/role', protect, adminOnly, async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();
        res.json({ message: 'User role updated', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/admin/stats', protect, adminOnly, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const revenueResult = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        res.json({ totalUsers, totalOrders, totalProducts, totalRevenue });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ============= NOTIFICATION SCHEMA =============
const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderId: String,
    message: String,
    status: String,
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});
const Notification = mongoose.model('Notification', notificationSchema);

app.get('/api/notifications', protect, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort('-createdAt').limit(30);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/notifications/:id/read', protect, async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ============= WISHLIST ROUTES =============
const wishlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    addedAt: { type: Date, default: Date.now }
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

app.get('/api/wishlist', protect, async (req, res) => {
    try {
        const wishlist = await Wishlist.find({ user: req.user.id }).populate('productId');
        const formattedWishlist = wishlist.map(item => ({
            _id: item._id,
            productId: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            image: item.productId.image,
            category: item.productId.category,
            unit: item.productId.unit,
            addedAt: item.addedAt
        }));
        res.json(formattedWishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/wishlist', protect, async (req, res) => {
    try {
        const { productId } = req.body;
        const existing = await Wishlist.findOne({ user: req.user.id, productId });
        if (existing) {
            return res.status(400).json({ message: 'Item already in wishlist' });
        }
        const wishlistItem = new Wishlist({ user: req.user.id, productId });
        await wishlistItem.save();

        const wishlist = await Wishlist.find({ user: req.user.id }).populate('productId');
        const formattedWishlist = wishlist.map(item => ({
            _id: item._id,
            productId: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            image: item.productId.image,
            category: item.productId.category,
            unit: item.productId.unit,
            addedAt: item.addedAt
        }));
        res.json(formattedWishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/wishlist/:productId', protect, async (req, res) => {
    try {
        await Wishlist.findOneAndDelete({ user: req.user.id, productId: req.params.productId });
        const wishlist = await Wishlist.find({ user: req.user.id }).populate('productId');
        const formattedWishlist = wishlist.map(item => ({
            _id: item._id,
            productId: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            image: item.productId.image,
            category: item.productId.category,
            unit: item.productId.unit,
            addedAt: item.addedAt
        }));
        res.json(formattedWishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/wishlist/clear', protect, async (req, res) => {
    try {
        await Wishlist.deleteMany({ user: req.user.id });
        res.json([]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ============= PORT =============
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});