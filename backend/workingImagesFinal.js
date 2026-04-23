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

// Emoji mapping for each product
const productEmojis = {
    // Fruits
    'Apple': '🍎', 'Banana': '🍌', 'Mango': '🥭', 'Orange': '🍊',
    'Grapes': '🍇', 'Pineapple': '🍍', 'Papaya': '🍈', 'Watermelon': '🍉',
    'Pomegranate': '🍎', 'Strawberry': '🍓', 'Kiwi': '🥝', 'Lemon': '🍋',
    'Coconut': '🥥', 'Guava': '🍐',

    // Vegetables
    'Tomato': '🍅', 'Potato': '🥔', 'Onion': '🧅', 'Carrot': '🥕',
    'Cabbage': '🥬', 'Cauliflower': '🥦', 'Spinach': '🥬', 'Brinjal': '🍆',
    'Cucumber': '🥒', 'Capsicum': '🫑', 'Beetroot': '🟣',

    // Dairy
    'Milk': '🥛', 'Curd': '🥄', 'Butter': '🧈', 'Cheese': '🧀',
    'Paneer': '🧀', 'Ghee': '🧈', 'Eggs': '🥚', 'Yogurt': '🥄',

    // Grocery
    'Basmati Rice': '🍚', 'Wheat Flour': '🌾', 'Sugar': '🍬', 'Salt': '🧂',
    'Tea': '🫖', 'Coffee': '☕', 'Cooking Oil': '🫒', 'Toor Dal': '🫘',
    'Turmeric Powder': '🟡', 'Red Chili Powder': '🔴',

    // Snacks
    'Potato Chips': '🍟', 'Biscuits': '🍪', 'Chocolates': '🍫', 'Namkeen': '🥨',

    // Beverages
    'Water Bottle': '💧', 'Soft Drinks': '🥤', 'Fruit Juice': '🧃',

    // Bakery
    'Bread': '🍞', 'Brown Bread': '🍞', 'Cake': '🍰',

    // Household
    'Soap': '🧼', 'Detergent': '🧴', 'Floor Cleaner': '🧹'
};

// Category colors
const categoryColors = {
    'Fruits': 'FF6B6B',
    'Vegetables': '4ECDC4',
    'Dairy': 'FFE66D',
    'Grocery': 'FF9F43',
    'Snacks': 'A8E6CF',
    'Beverages': '54A0FF',
    'Bakery': 'F3A683',
    'Household': 'C7CEE6'
};

async function updateAllImages() {
    try {
        const products = await Product.find({});
        console.log(`📦 Found ${products.length} products\n`);

        let updated = 0;

        for (let product of products) {
            // Get emoji for product
            let emoji = productEmojis[product.name];
            if (!emoji) {
                // Fallback emoji based on category
                const categoryEmojis = {
                    'Fruits': '🍎', 'Vegetables': '🥬', 'Dairy': '🥛',
                    'Grocery': '🛒', 'Snacks': '🍪', 'Beverages': '🥤',
                    'Bakery': '🍞', 'Household': '🧹'
                };
                emoji = categoryEmojis[product.category] || '🛒';
            }

            // Get color based on category
            const color = categoryColors[product.category] || '22c55e';

            // Create placeholder image with emoji and name
            const imageUrl = `https://placehold.co/400x400/${color}/white?text=${emoji}+${encodeURIComponent(product.name)}`;

            product.image = imageUrl;
            await product.save();
            updated++;

            console.log(`✅ ${updated}/${products.length}: ${product.name} (${emoji})`);
        }

        console.log(`\n🎉 Successfully updated ${updated} products!`);
        console.log(`\n📸 Image format: Emoji + Product Name on colored background`);
        console.log(`🖼️ These images will ALWAYS load because they're from placehold.co`);

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateAllImages();