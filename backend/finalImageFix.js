import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected'))
    .catch(err => console.error(err));

const productSchema = new mongoose.Schema({ name: String, image: String, category: String });
const Product = mongoose.model('Product', productSchema);

// Comprehensive food image mapping
const foodImageMap = {
    // Fruits
    'Apple': 'https://images.pexels.com/photos/102104/fruit-apple-red-delicious-102104.jpeg?w=400',
    'Banana': 'https://images.pexels.com/photos/594756/pexels-photo-594756.jpeg?w=400',
    'Mango': 'https://images.pexels.com/photos/91153/mango-sweet-fruit-mangoes-91153.jpeg?w=400',
    'Orange': 'https://images.pexels.com/photos/616340/orange-fruit-citrus-616340.jpeg?w=400',
    'Grapes': 'https://images.pexels.com/photos/708777/grapes-fruit-grape-fruit-708777.jpeg?w=400',
    'Pineapple': 'https://images.pexels.com/photos/777018/pineapple-fruit-sweet-777018.jpeg?w=400',
    'Papaya': 'https://images.pexels.com/photos/988945/papaya-fruit-exotic-988945.jpeg?w=400',
    'Watermelon': 'https://images.pexels.com/photos/311069/watermelon-fruit-summer-311069.jpeg?w=400',
    'Pomegranate': 'https://images.pexels.com/photos/2683955/pomegranate-fruit-seeds-2683955.jpeg?w=400',
    'Guava': 'https://images.pexels.com/photos/7003520/guava-fruit-closeup-7003520.jpeg?w=400',
    'Strawberry': 'https://images.pexels.com/photos/46174/strawberries-berries-fruit-juicy-46174.jpeg?w=400',
    'Kiwi': 'https://images.pexels.com/photos/775032/kiwi-fruit-healthy-775032.jpeg?w=400',
    'Lemon': 'https://images.pexels.com/photos/60611/lemons-fruit-sour-60611.jpeg?w=400',
    'Coconut': 'https://images.pexels.com/photos/594591/coconut-fruit-tropical-594591.jpeg?w=400',

    // Vegetables
    'Tomato': 'https://images.pexels.com/photos/533280/tomatoes-red-ripe-533280.jpeg?w=400',
    'Potato': 'https://images.pexels.com/photos/228677/potatoes-vegetables-food-228677.jpeg?w=400',
    'Onion': 'https://images.pexels.com/photos/134259/onions-vegetables-food-134259.jpeg?w=400',
    'Carrot': 'https://images.pexels.com/photos/143133/carrots-vegetables-healthy-143133.jpeg?w=400',
    'Cabbage': 'https://images.pexels.com/photos/128403/cabbage-vegetable-healthy-128403.jpeg?w=400',
    'Cauliflower': 'https://images.pexels.com/photos/131142/cauliflower-vegetables-food-131142.jpeg?w=400',
    'Spinach': 'https://images.pexels.com/photos/807834/spinach-leafy-greens-807834.jpeg?w=400',
    'Brinjal': 'https://images.pexels.com/photos/210799/eggplant-vegetables-aubergine-210799.jpeg?w=400',
    'Cucumber': 'https://images.pexels.com/photos/229448/cucumber-vegetable-slice-229448.jpeg?w=400',
    'Capsicum': 'https://images.pexels.com/photos/52010/bell-pepper-capsicum-vegetable-52010.jpeg?w=400',

    // Dairy
    'Milk': 'https://images.pexels.com/photos/139253/milk-glass-milk-glass-139253.jpeg?w=400',
    'Curd': 'https://images.pexels.com/photos/4110015/yogurt-curd-bowl-4110015.jpeg?w=400',
    'Butter': 'https://images.pexels.com/photos/2895025/butter-dairy-2895025.jpeg?w=400',
    'Cheese': 'https://images.pexels.com/photos/821365/cheese-dairy-821365.jpeg?w=400',
    'Paneer': 'https://images.pexels.com/photos/123456/paneer-cottage-cheese-123456.jpeg?w=400',
    'Ghee': 'https://images.pexels.com/photos/1625810/ghee-butter-1625810.jpeg?w=400',
    'Eggs': 'https://images.pexels.com/photos/162712/eggs-white-egg-162712.jpeg?w=400',

    // Grocery
    'Basmati Rice': 'https://images.pexels.com/photos/811518/rice-basmati-raw-811518.jpeg?w=400',
    'Wheat Flour': 'https://images.pexels.com/photos/811518/wheat-flour-atta-811518.jpeg?w=400',
    'Sugar': 'https://images.pexels.com/photos/839915/sugar-white-839915.jpeg?w=400',
    'Salt': 'https://images.pexels.com/photos/839915/salt-iodized-839915.jpeg?w=400',
    'Tea Powder': 'https://images.pexels.com/photos/159748/tea-cup-tea-leaves-159748.jpeg?w=400',
    'Coffee Powder': 'https://images.pexels.com/photos/312418/coffee-beans-coffee-312418.jpeg?w=400',
    'Cooking Oil': 'https://images.pexels.com/photos/1351238/cooking-oil-bottle-1351238.jpeg?w=400',
    'Toor Dal': 'https://images.pexels.com/photos/811518/toor-dal-lentils-811518.jpeg?w=400',
    'Turmeric Powder': 'https://images.pexels.com/photos/839915/turmeric-powder-spice-839915.jpeg?w=400',
    'Red Chili Powder': 'https://images.pexels.com/photos/161944/chili-powder-spice-161944.jpeg?w=400',

    // Snacks & Beverages
    'Potato Chips': 'https://images.pexels.com/photos/158388/chips-potato-crisps-158388.jpeg?w=400',
    'Biscuits': 'https://images.pexels.com/photos/158388/biscuits-cream-158388.jpeg?w=400',
    'Chocolates': 'https://images.pexels.com/photos/158388/chocolate-milk-158388.jpeg?w=400',
    'Namkeen': 'https://images.pexels.com/photos/158388/namkeen-mixed-158388.jpeg?w=400',
    'Soft Drinks': 'https://images.pexels.com/photos/50594/soft-drink-coca-cola-50594.jpeg?w=400',
    'Fruit Juice': 'https://images.pexels.com/photos/109275/fruit-juice-109275.jpeg?w=400',
    'Water Bottle': 'https://images.pexels.com/photos/327119/water-bottle-327119.jpeg?w=400',

    // Bakery
    'Bread': 'https://images.pexels.com/photos/263978/bread-bakery-263978.jpeg?w=400',
    'Brown Bread': 'https://images.pexels.com/photos/263978/brown-bread-263978.jpeg?w=400',
    'Cake': 'https://images.pexels.com/photos/291528/cake-chocolate-291528.jpeg?w=400',

    // Household
    'Soap': 'https://images.pexels.com/photos/123456/soap-bar-123456.jpeg?w=400',
    'Detergent Powder': 'https://images.pexels.com/photos/123456/detergent-powder-123456.jpeg?w=400',
    'Floor Cleaner': 'https://images.pexels.com/photos/123456/floor-cleaner-123456.jpeg?w=400'
};

async function updateAllImages() {
    const products = await Product.find({});

    for (let product of products) {
        if (foodImageMap[product.name]) {
            product.image = foodImageMap[product.name];
            await product.save();
            console.log(`✅ ${product.name}`);
        } else {
            // Use category-based fallback
            const categoryFallback = {
                'Fruits': 'https://images.pexels.com/photos/102104/fruit-apple-red-delicious-102104.jpeg?w=400',
                'Vegetables': 'https://images.pexels.com/photos/533280/tomatoes-red-ripe-533280.jpeg?w=400',
                'Dairy': 'https://images.pexels.com/photos/139253/milk-glass-milk-glass-139253.jpeg?w=400',
                'Grocery': 'https://images.pexels.com/photos/811518/rice-basmati-raw-811518.jpeg?w=400',
                'Snacks': 'https://images.pexels.com/photos/158388/chips-potato-crisps-158388.jpeg?w=400',
                'Beverages': 'https://images.pexels.com/photos/50594/soft-drink-coca-cola-50594.jpeg?w=400',
                'Bakery': 'https://images.pexels.com/photos/263978/bread-bakery-263978.jpeg?w=400',
                'Household': 'https://images.pexels.com/photos/123456/soap-bar-123456.jpeg?w=400'
            };
            product.image = categoryFallback[product.category] || categoryFallback['Grocery'];
            await product.save();
            console.log(`⚠️ ${product.name} (${product.category}) - Using category image`);
        }
    }

    console.log(`\n✅ All ${products.length} products updated!`);
    process.exit();
}

updateAllImages();