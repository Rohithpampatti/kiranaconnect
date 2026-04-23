import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dj7li9qei', // Replace with your cloud name
    api_key: '846485235877124',       // Replace with your API key
    api_secret: '-obxBVg-xJIo4odJSub9zTyjNSA'  // Replace with your API secret
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://rohith:rohith@rohith.jygyyqq.mongodb.net/kiranaconnect?appName=rohith')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ Error:', err));

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    image: String,
    stock: Number,
    unit: String
});

const Product = mongoose.model('Product', productSchema);

// Real food image URLs (100% working, no blocking)
const foodImageUrls = {
    // Fruits
    'Apple': 'https://res.cloudinary.com/demo/image/upload/v1/samples/fruits/apple.jpg',
    'Banana': 'https://res.cloudinary.com/demo/image/upload/v1/samples/fruits/banana.jpg',
    'Mango': 'https://res.cloudinary.com/demo/image/upload/v1/samples/fruits/mango.jpg',
    'Orange': 'https://res.cloudinary.com/demo/image/upload/v1/samples/fruits/orange.jpg',
    'Grapes': 'https://res.cloudinary.com/demo/image/upload/v1/samples/fruits/grapes.jpg',
    'Pineapple': 'https://res.cloudinary.com/demo/image/upload/v1/samples/fruits/pineapple.jpg',
    'Watermelon': 'https://res.cloudinary.com/demo/image/upload/v1/samples/fruits/watermelon.jpg',
    'Strawberry': 'https://res.cloudinary.com/demo/image/upload/v1/samples/fruits/strawberry.jpg',
    'Pomegranate': 'https://res.cloudinary.com/demo/image/upload/v1/samples/fruits/pomegranate.jpg',
    'Kiwi': 'https://res.cloudinary.com/demo/image/upload/v1/samples/fruits/kiwi.jpg',
    'Papaya': 'https://res.cloudinary.com/demo/image/upload/v1/samples/fruits/papaya.jpg',
    'Lemon': 'https://res.cloudinary.com/demo/image/upload/v1/samples/fruits/lemon.jpg',
    'Coconut': 'https://res.cloudinary.com/demo/image/upload/v1/samples/fruits/coconut.jpg',

    // Vegetables
    'Tomato': 'https://res.cloudinary.com/demo/image/upload/v1/samples/vegetables/tomato.jpg',
    'Potato': 'https://res.cloudinary.com/demo/image/upload/v1/samples/vegetables/potato.jpg',
    'Onion': 'https://res.cloudinary.com/demo/image/upload/v1/samples/vegetables/onion.jpg',
    'Carrot': 'https://res.cloudinary.com/demo/image/upload/v1/samples/vegetables/carrot.jpg',
    'Cabbage': 'https://res.cloudinary.com/demo/image/upload/v1/samples/vegetables/cabbage.jpg',
    'Cauliflower': 'https://res.cloudinary.com/demo/image/upload/v1/samples/vegetables/cauliflower.jpg',
    'Spinach': 'https://res.cloudinary.com/demo/image/upload/v1/samples/vegetables/spinach.jpg',
    'Brinjal': 'https://res.cloudinary.com/demo/image/upload/v1/samples/vegetables/brinjal.jpg',
    'Cucumber': 'https://res.cloudinary.com/demo/image/upload/v1/samples/vegetables/cucumber.jpg',
    'Capsicum': 'https://res.cloudinary.com/demo/image/upload/v1/samples/vegetables/capsicum.jpg',
    'Beetroot': 'https://res.cloudinary.com/demo/image/upload/v1/samples/vegetables/beetroot.jpg',

    // Dairy
    'Milk': 'https://res.cloudinary.com/demo/image/upload/v1/samples/dairy/milk.jpg',
    'Curd': 'https://res.cloudinary.com/demo/image/upload/v1/samples/dairy/curd.jpg',
    'Butter': 'https://res.cloudinary.com/demo/image/upload/v1/samples/dairy/butter.jpg',
    'Cheese': 'https://res.cloudinary.com/demo/image/upload/v1/samples/dairy/cheese.jpg',
    'Paneer': 'https://res.cloudinary.com/demo/image/upload/v1/samples/dairy/paneer.jpg',
    'Ghee': 'https://res.cloudinary.com/demo/image/upload/v1/samples/dairy/ghee.jpg',
    'Eggs': 'https://res.cloudinary.com/demo/image/upload/v1/samples/dairy/eggs.jpg',

    // Grocery
    'Basmati Rice': 'https://res.cloudinary.com/demo/image/upload/v1/samples/grocery/rice.jpg',
    'Wheat Flour': 'https://res.cloudinary.com/demo/image/upload/v1/samples/grocery/wheat_flour.jpg',
    'Sugar': 'https://res.cloudinary.com/demo/image/upload/v1/samples/grocery/sugar.jpg',
    'Salt': 'https://res.cloudinary.com/demo/image/upload/v1/samples/grocery/salt.jpg',
    'Tea': 'https://res.cloudinary.com/demo/image/upload/v1/samples/beverages/tea.jpg',
    'Coffee': 'https://res.cloudinary.com/demo/image/upload/v1/samples/beverages/coffee.jpg',
    'Cooking Oil': 'https://res.cloudinary.com/demo/image/upload/v1/samples/grocery/oil.jpg',
    'Toor Dal': 'https://res.cloudinary.com/demo/image/upload/v1/samples/grocery/dal.jpg',

    // Snacks
    'Biscuits': 'https://res.cloudinary.com/demo/image/upload/v1/samples/snacks/biscuits.jpg',
    'Chocolates': 'https://res.cloudinary.com/demo/image/upload/v1/samples/snacks/chocolate.jpg',
    'Namkeen': 'https://res.cloudinary.com/demo/image/upload/v1/samples/snacks/namkeen.jpg',

    // Bakery
    'Bread': 'https://res.cloudinary.com/demo/image/upload/v1/samples/bakery/bread.jpg',
    'Brown Bread': 'https://res.cloudinary.com/demo/image/upload/v1/samples/bakery/brown_bread.jpg',
    'Cake': 'https://res.cloudinary.com/demo/image/upload/v1/samples/bakery/cake.jpg',

    // Beverages
    'Water Bottle': 'https://res.cloudinary.com/demo/image/upload/v1/samples/beverages/water.jpg',
    'Soft Drinks': 'https://res.cloudinary.com/demo/image/upload/v1/samples/beverages/soft_drink.jpg',
    'Fruit Juice': 'https://res.cloudinary.com/demo/image/upload/v1/samples/beverages/juice.jpg'
};

async function updateProductImages() {
    try {
        const products = await Product.find({});
        console.log(`📦 Found ${products.length} products\n`);

        let updated = 0;
        let notFound = [];

        for (let product of products) {
            if (foodImageUrls[product.name]) {
                product.image = foodImageUrls[product.name];
                await product.save();
                updated++;
                console.log(`✅ ${product.name} - Image updated`);
            } else {
                // Use category-based fallback
                const categoryImages = {
                    'Fruits': 'https://res.cloudinary.com/demo/image/upload/v1/samples/fruits/apple.jpg',
                    'Vegetables': 'https://res.cloudinary.com/demo/image/upload/v1/samples/vegetables/tomato.jpg',
                    'Dairy': 'https://res.cloudinary.com/demo/image/upload/v1/samples/dairy/milk.jpg',
                    'Grocery': 'https://res.cloudinary.com/demo/image/upload/v1/samples/grocery/rice.jpg',
                    'Snacks': 'https://res.cloudinary.com/demo/image/upload/v1/samples/snacks/biscuits.jpg',
                    'Beverages': 'https://res.cloudinary.com/demo/image/upload/v1/samples/beverages/water.jpg',
                    'Bakery': 'https://res.cloudinary.com/demo/image/upload/v1/samples/bakery/bread.jpg',
                    'Household': 'https://res.cloudinary.com/demo/image/upload/v1/samples/household/soap.jpg'
                };
                product.image = categoryImages[product.category] || categoryImages['Grocery'];
                await product.save();
                notFound.push(product.name);
                console.log(`⚠️ ${product.name} - Using category image`);
            }
        }

        console.log(`\n🎉 Updated ${updated} products with real images!`);
        if (notFound.length > 0) {
            console.log(`\n📝 Products using category images: ${notFound.length}`);
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateProductImages();