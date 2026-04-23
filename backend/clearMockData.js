import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://rohith:rohith@rohith.jygyyqq.mongodb.net/kiranaconnect?appName=rohith')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error:', err));

const productSchema = new mongoose.Schema({ name: String });
const Product = mongoose.model('Product', productSchema);
const orderSchema = new mongoose.Schema({});
const Order = mongoose.model('Order', orderSchema);

async function clearData() {
    try {
        const productResult = await Product.deleteMany({});
        console.log(`✅ Cleared ${productResult.deletedCount} products`);

        console.log('\n📊 Database is now clean!');
        console.log('📝 Add real products from Admin Panel');
        console.log('🔗 Login with admin@kiranaconnect.com / admin123');

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

clearData();