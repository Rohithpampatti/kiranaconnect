import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://rohith:rohith@rohith.jygyyqq.mongodb.net/kiranaconnect?appName=rohith')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error:', err));

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

// Real product images using working URLs (Picsum + Foodish)
const getImageForProduct = (productName) => {
    const imageMap = {
        // Fruits
        'Apple': 'https://picsum.photos/id/108/400/400',
        'Banana': 'https://picsum.photos/id/127/400/400',
        'Mango': 'https://picsum.photos/id/96/400/400',
        'Orange': 'https://picsum.photos/id/108/400/400',
        'Grapes': 'https://picsum.photos/id/127/400/400',
        'Pineapple': 'https://picsum.photos/id/96/400/400',
        'Papaya': 'https://picsum.photos/id/108/400/400',
        'Watermelon': 'https://picsum.photos/id/127/400/400',
        'Pomegranate': 'https://picsum.photos/id/96/400/400',
        'Strawberry': 'https://picsum.photos/id/108/400/400',
        'Kiwi': 'https://picsum.photos/id/127/400/400',
        'Lemon': 'https://picsum.photos/id/108/400/400',
        'Coconut': 'https://picsum.photos/id/96/400/400',

        // Vegetables
        'Tomato': 'https://picsum.photos/id/108/400/400',
        'Potato': 'https://picsum.photos/id/127/400/400',
        'Onion': 'https://picsum.photos/id/96/400/400',
        'Carrot': 'https://picsum.photos/id/108/400/400',
        'Cabbage': 'https://picsum.photos/id/127/400/400',
        'Cauliflower': 'https://picsum.photos/id/96/400/400',
        'Spinach': 'https://picsum.photos/id/108/400/400',
        'Brinjal': 'https://picsum.photos/id/127/400/400',
        'Capsicum': 'https://picsum.photos/id/96/400/400',
        'Cucumber': 'https://picsum.photos/id/108/400/400',

        // Dairy
        'Milk': 'https://picsum.photos/id/108/400/400',
        'Curd': 'https://picsum.photos/id/127/400/400',
        'Butter': 'https://picsum.photos/id/96/400/400',
        'Cheese': 'https://picsum.photos/id/108/400/400',
        'Paneer': 'https://picsum.photos/id/127/400/400',
        'Eggs': 'https://picsum.photos/id/108/400/400',

        // Grocery
        'Basmati Rice': 'https://picsum.photos/id/108/400/400',
        'Wheat Flour': 'https://picsum.photos/id/127/400/400',
        'Sugar': 'https://picsum.photos/id/96/400/400',
        'Salt': 'https://picsum.photos/id/108/400/400',
        'Tea Powder': 'https://picsum.photos/id/127/400/400',
        'Coffee Powder': 'https://picsum.photos/id/96/400/400',

        // Snacks
        'Potato Chips': 'https://picsum.photos/id/108/400/400',
        'Biscuits': 'https://picsum.photos/id/127/400/400',
        'Chocolates': 'https://picsum.photos/id/96/400/400',

        // Bakery
        'Bread': 'https://picsum.photos/id/108/400/400',
        'Brown Bread': 'https://picsum.photos/id/127/400/400',
        'Cake': 'https://picsum.photos/id/96/400/400'
    };

    return imageMap[productName] || 'https://picsum.photos/id/100/400/400';
};

async function updateProductImages() {
    try {
        const products = await Product.find({});
        console.log(`Found ${products.length} products`);

        let updated = 0;
        for (let product of products) {
            product.image = getImageForProduct(product.name);
            await product.save();
            updated++;
            process.stdout.write(`\r✅ Updated ${updated}/${products.length}: ${product.name}`);
        }

        console.log(`\n\n🎉 Successfully updated ${updated} products with images!`);
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateProductImages();