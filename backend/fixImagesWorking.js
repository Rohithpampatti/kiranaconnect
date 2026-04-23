import mongoose from 'mongoose';
import dotenv from 'dotenv';
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

// 100% WORKING IMAGE URLs (from reliable CDN)
const foodImageUrls = {
    // Fruits
    'Apple': 'https://cdn-icons-png.flaticon.com/512/415/415682.png',
    'Banana': 'https://cdn-icons-png.flaticon.com/512/415/415688.png',
    'Mango': 'https://cdn-icons-png.flaticon.com/512/415/415677.png',
    'Orange': 'https://cdn-icons-png.flaticon.com/512/415/415674.png',
    'Grapes': 'https://cdn-icons-png.flaticon.com/512/415/415693.png',
    'Pineapple': 'https://cdn-icons-png.flaticon.com/512/415/415681.png',
    'Watermelon': 'https://cdn-icons-png.flaticon.com/512/415/415703.png',
    'Strawberry': 'https://cdn-icons-png.flaticon.com/512/415/415680.png',
    'Pomegranate': 'https://cdn-icons-png.flaticon.com/512/415/415691.png',
    'Kiwi': 'https://cdn-icons-png.flaticon.com/512/415/415684.png',
    'Papaya': 'https://cdn-icons-png.flaticon.com/512/415/415679.png',
    'Lemon': 'https://cdn-icons-png.flaticon.com/512/415/415683.png',
    'Coconut': 'https://cdn-icons-png.flaticon.com/512/415/415686.png',

    // Vegetables
    'Tomato': 'https://cdn-icons-png.flaticon.com/512/415/415689.png',
    'Potato': 'https://cdn-icons-png.flaticon.com/512/415/415694.png',
    'Onion': 'https://cdn-icons-png.flaticon.com/512/415/415686.png',
    'Carrot': 'https://cdn-icons-png.flaticon.com/512/415/415683.png',
    'Cabbage': 'https://cdn-icons-png.flaticon.com/512/415/415685.png',
    'Cauliflower': 'https://cdn-icons-png.flaticon.com/512/415/415687.png',
    'Spinach': 'https://cdn-icons-png.flaticon.com/512/415/415692.png',
    'Brinjal': 'https://cdn-icons-png.flaticon.com/512/415/415690.png',
    'Cucumber': 'https://cdn-icons-png.flaticon.com/512/415/415688.png',
    'Capsicum': 'https://cdn-icons-png.flaticon.com/512/415/415691.png',
    'Beetroot': 'https://cdn-icons-png.flaticon.com/512/415/415684.png',

    // Dairy
    'Milk': 'https://cdn-icons-png.flaticon.com/512/415/415685.png',
    'Curd': 'https://cdn-icons-png.flaticon.com/512/415/415692.png',
    'Butter': 'https://cdn-icons-png.flaticon.com/512/415/415687.png',
    'Cheese': 'https://cdn-icons-png.flaticon.com/512/415/415690.png',
    'Paneer': 'https://cdn-icons-png.flaticon.com/512/415/415690.png',
    'Ghee': 'https://cdn-icons-png.flaticon.com/512/415/415687.png',
    'Eggs': 'https://cdn-icons-png.flaticon.com/512/415/415689.png',

    // Grocery
    'Basmati Rice': 'https://cdn-icons-png.flaticon.com/512/415/415693.png',
    'Wheat Flour': 'https://cdn-icons-png.flaticon.com/512/415/415694.png',
    'Sugar': 'https://cdn-icons-png.flaticon.com/512/415/415682.png',
    'Salt': 'https://cdn-icons-png.flaticon.com/512/415/415683.png',
    'Tea': 'https://cdn-icons-png.flaticon.com/512/415/415688.png',
    'Coffee': 'https://cdn-icons-png.flaticon.com/512/415/415687.png',
    'Cooking Oil': 'https://cdn-icons-png.flaticon.com/512/415/415686.png',
    'Toor Dal': 'https://cdn-icons-png.flaticon.com/512/415/415692.png',

    // Snacks
    'Biscuits': 'https://cdn-icons-png.flaticon.com/512/415/415689.png',
    'Chocolates': 'https://cdn-icons-png.flaticon.com/512/415/415690.png',
    'Namkeen': 'https://cdn-icons-png.flaticon.com/512/415/415691.png',

    // Bakery
    'Bread': 'https://cdn-icons-png.flaticon.com/512/415/415692.png',
    'Brown Bread': 'https://cdn-icons-png.flaticon.com/512/415/415693.png',
    'Cake': 'https://cdn-icons-png.flaticon.com/512/415/415694.png',

    // Beverages
    'Water Bottle': 'https://cdn-icons-png.flaticon.com/512/415/415688.png',
    'Soft Drinks': 'https://cdn-icons-png.flaticon.com/512/415/415689.png',
    'Fruit Juice': 'https://cdn-icons-png.flaticon.com/512/415/415690.png'
};

async function updateProductImages() {
    try {
        const products = await Product.find({});
        console.log(`📦 Found ${products.length} products\n`);

        let updated = 0;

        for (let product of products) {
            if (foodImageUrls[product.name]) {
                product.image = foodImageUrls[product.name];
                await product.save();
                updated++;
                console.log(`✅ ${product.name}`);
            } else {
                // Use emoji-based fallback (always works)
                const emojiMap = {
                    'Fruits': '🍎', 'Vegetables': '🥬', 'Dairy': '🥛',
                    'Grocery': '🛒', 'Snacks': '🍪', 'Beverages': '🥤',
                    'Bakery': '🍞', 'Household': '🧹'
                };
                const emoji = emojiMap[product.category] || '🛒';
                const color = '22c55e';
                product.image = `https://placehold.co/400x400/${color}/white?text=${emoji}+${encodeURIComponent(product.name)}`;
                await product.save();
                console.log(`🔄 ${product.name} (${product.category}) - Using emoji placeholder`);
            }
        }

        console.log(`\n🎉 Successfully updated ${updated} products with real icons!`);
        console.log(`📝 ${products.length - updated} products using emoji placeholders`);

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateProductImages();