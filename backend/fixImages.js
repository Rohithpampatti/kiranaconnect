import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kiranaconnect')
    .then(() => console.log('Connected'))
    .catch(err => console.error(err));

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    image: String,
    stock: Number,
    unit: String
});

const Product = mongoose.model('Product', productSchema);

const imageMap = {
    'Fruits': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
    'Vegetables': 'https://images.unsplash.com/photo-1546094096-0df4bcaaa2e5?w=400',
    'Dairy': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    'Grocery': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    'Snacks': 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=400',
    'Beverages': 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400',
    'Bakery': 'https://images.unsplash.com/photo-1509440159596-0249085222d9?w=400',
    'Household': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400'
};

async function fixImages() {
    for (const [category, image] of Object.entries(imageMap)) {
        const result = await Product.updateMany(
            { category: category },
            { $set: { image: image } }
        );
        console.log(`Updated ${result.modifiedCount} products in ${category}`);
    }
    console.log('✅ All images updated!');
    process.exit();
}

fixImages();