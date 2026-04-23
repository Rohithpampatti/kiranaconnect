import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://rohith:rohith@rohith.jygyyqq.mongodb.net/kiranaconnect?appName=rohith')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ Error:', err));

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

// Food-specific image URLs that match product names
const foodImages = {
    // Fruits
    'Apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
    'Banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
    'Mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400',
    'Orange': 'https://images.unsplash.com/photo-1547514701-427821017f5a?w=400',
    'Grapes': 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400',
    'Pineapple': 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400',
    'Papaya': 'https://images.unsplash.com/photo-1517282009859-f000ec3b37fe?w=400',
    'Watermelon': 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=400',
    'Pomegranate': 'https://images.unsplash.com/photo-1541344999736-93eca5f6fef2?w=400',
    'Strawberry': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca5?w=400',
    'Kiwi': 'https://images.unsplash.com/photo-1547844149-792ce979464a?w=400',
    'Lemon': 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400',

    // Vegetables
    'Tomato': 'https://images.unsplash.com/photo-1546094096-0df4bcaaa2e5?w=400',
    'Potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
    'Onion': 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400',
    'Carrot': 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=400',
    'Cabbage': 'https://images.unsplash.com/photo-1594282486550-52b61f1eb85b?w=400',
    'Cauliflower': 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400',
    'Spinach': 'https://images.unsplash.com/photo-1570916054829-2e9b5b7d1555?w=400',
    'Brinjal': 'https://images.unsplash.com/photo-1585599327908-9591b7cdf1b7?w=400',
    'Cucumber': 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400',
    'Capsicum': 'https://images.unsplash.com/photo-1563565374990-3c2ba92865f6?w=400',
    'Beetroot': 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=400',

    // Dairy
    'Milk': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    'Curd': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
    'Butter': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400',
    'Cheese': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400',
    'Paneer': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
    'Ghee': 'https://images.unsplash.com/photo-1625810072192-3d9214fdd0ef?w=400',

    // Grocery
    'Basmati Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    'Wheat Flour': 'https://images.unsplash.com/photo-1569278267998-046cacf0e7a8?w=400',
    'Sugar': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    'Salt': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    'Tea': 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400',
    'Coffee': 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400',
    'Cooking Oil': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',

    // Snacks
    'Potato Chips': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400',
    'Biscuits': 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=400',
    'Chocolates': 'https://images.unsplash.com/photo-1549007953-2d2f4a9b8a53?w=400',

    // Bakery
    'Bread': 'https://images.unsplash.com/photo-1509440159596-0249085222d9?w=400',
    'Cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9588?w=400'
};

async function updateProductImages() {
    try {
        const products = await Product.find({});
        console.log(`📦 Found ${products.length} products`);

        let updated = 0;
        let notFound = [];

        for (let product of products) {
            if (foodImages[product.name]) {
                product.image = foodImages[product.name];
                await product.save();
                updated++;
                console.log(`✅ ${product.name} - Food image assigned`);
            } else {
                // Use category-based Unsplash search for unmapped products
                const categoryImages = {
                    'Fruits': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400',
                    'Vegetables': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
                    'Dairy': 'https://images.unsplash.com/photo-1628088062854-d187a7dc7f5d?w=400',
                    'Grocery': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
                    'Snacks': 'https://images.unsplash.com/photo-1627308597028-3f5ea7f5c5a2?w=400',
                    'Bakery': 'https://images.unsplash.com/photo-1509440159596-0249085222d9?w=400'
                };
                product.image = categoryImages[product.category] || categoryImages['Grocery'];
                await product.save();
                notFound.push(product.name);
                console.log(`⚠️ ${product.name} - Using category image`);
            }
        }

        console.log(`\n🎉 Updated ${updated} products with real food images!`);
        if (notFound.length > 0) {
            console.log(`\n📝 Products using category images: ${notFound.join(', ')}`);
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateProductImages();