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

// All products that should appear in Admin Panel
const products = [
    // Fruits
    { name: "Apple", price: 120, category: "Fruits", stock: 100, unit: "kg", brand: "FreshFarm", description: "Fresh red apples" },
    { name: "Banana", price: 40, category: "Fruits", stock: 150, unit: "dozen", brand: "FreshFarm", description: "Sweet bananas" },
    { name: "Mango", price: 120, category: "Fruits", stock: 80, unit: "kg", brand: "FreshFarm", description: "Alphonso mangoes" },
    { name: "Orange", price: 60, category: "Fruits", stock: 100, unit: "kg", brand: "FreshFarm", description: "Sweet oranges" },
    { name: "Grapes", price: 90, category: "Fruits", stock: 70, unit: "kg", brand: "FreshFarm", description: "Green grapes" },
    { name: "Pineapple", price: 70, category: "Fruits", stock: 50, unit: "kg", brand: "FreshFarm", description: "Fresh pineapple" },
    { name: "Papaya", price: 45, category: "Fruits", stock: 60, unit: "kg", brand: "FreshFarm", description: "Ripe papaya" },
    { name: "Watermelon", price: 35, category: "Fruits", stock: 40, unit: "kg", brand: "FreshFarm", description: "Sweet watermelon" },
    { name: "Pomegranate", price: 110, category: "Fruits", stock: 60, unit: "kg", brand: "FreshFarm", description: "Fresh pomegranate" },
    { name: "Guava", price: 50, category: "Fruits", stock: 70, unit: "kg", brand: "FreshFarm", description: "Fresh guavas" },
    { name: "Strawberry", price: 150, category: "Fruits", stock: 40, unit: "box", brand: "FreshFarm", description: "Fresh strawberries" },
    { name: "Kiwi", price: 80, category: "Fruits", stock: 50, unit: "kg", brand: "FreshFarm", description: "Green kiwi" },
    { name: "Lemon", price: 60, category: "Fruits", stock: 100, unit: "kg", brand: "FreshFarm", description: "Fresh lemons" },
    { name: "Coconut", price: 50, category: "Fruits", stock: 80, unit: "piece", brand: "FreshFarm", description: "Fresh coconut" },

    // Vegetables
    { name: "Tomato", price: 30, category: "Vegetables", stock: 120, unit: "kg", brand: "FreshFarm", description: "Fresh tomatoes" },
    { name: "Potato", price: 28, category: "Vegetables", stock: 150, unit: "kg", brand: "FreshFarm", description: "Fresh potatoes" },
    { name: "Onion", price: 25, category: "Vegetables", stock: 130, unit: "kg", brand: "FreshFarm", description: "Red onions" },
    { name: "Carrot", price: 35, category: "Vegetables", stock: 90, unit: "kg", brand: "FreshFarm", description: "Orange carrots" },
    { name: "Cabbage", price: 20, category: "Vegetables", stock: 80, unit: "kg", brand: "FreshFarm", description: "Fresh cabbage" },
    { name: "Cauliflower", price: 35, category: "Vegetables", stock: 70, unit: "kg", brand: "FreshFarm", description: "Fresh cauliflower" },
    { name: "Spinach", price: 15, category: "Vegetables", stock: 60, unit: "bunch", brand: "FreshFarm", description: "Fresh spinach" },
    { name: "Brinjal", price: 30, category: "Vegetables", stock: 80, unit: "kg", brand: "FreshFarm", description: "Purple brinjal" },
    { name: "Capsicum", price: 50, category: "Vegetables", stock: 70, unit: "kg", brand: "FreshFarm", description: "Green capsicum" },
    { name: "Cucumber", price: 25, category: "Vegetables", stock: 90, unit: "kg", brand: "FreshFarm", description: "Fresh cucumber" },

    // Dairy
    { name: "Milk", price: 60, category: "Dairy", stock: 100, unit: "liter", brand: "Amul", description: "Fresh milk" },
    { name: "Curd", price: 35, category: "Dairy", stock: 80, unit: "kg", brand: "Amul", description: "Fresh curd" },
    { name: "Butter", price: 55, category: "Dairy", stock: 70, unit: "pack", brand: "Amul", description: "Salted butter" },
    { name: "Cheese", price: 120, category: "Dairy", stock: 60, unit: "pack", brand: "Amul", description: "Processed cheese" },
    { name: "Paneer", price: 160, category: "Dairy", stock: 50, unit: "kg", brand: "Amul", description: "Fresh cottage cheese" },
    { name: "Ghee", price: 450, category: "Dairy", stock: 40, unit: "liter", brand: "Amul", description: "Pure cow ghee" },
    { name: "Eggs", price: 90, category: "Dairy", stock: 200, unit: "dozen", brand: "FreshFarm", description: "Fresh eggs" },

    // Grocery
    { name: "Basmati Rice", price: 120, category: "Grocery", stock: 100, unit: "kg", brand: "India Gate", description: "Premium basmati rice" },
    { name: "Wheat Flour", price: 35, category: "Grocery", stock: 100, unit: "kg", brand: "Ashirvaad", description: "Whole wheat atta" },
    { name: "Toor Dal", price: 110, category: "Grocery", stock: 80, unit: "kg", brand: "Tata", description: "Split pigeon pea" },
    { name: "Sugar", price: 42, category: "Grocery", stock: 120, unit: "kg", brand: "Madhur", description: "White sugar" },
    { name: "Salt", price: 20, category: "Grocery", stock: 150, unit: "pack", brand: "Tata", description: "Iodized salt" },
    { name: "Cooking Oil", price: 130, category: "Grocery", stock: 80, unit: "liter", brand: "Fortune", description: "Sunflower oil" },
    { name: "Turmeric Powder", price: 70, category: "Grocery", stock: 80, unit: "kg", brand: "MDH", description: "Pure turmeric" },
    { name: "Red Chili Powder", price: 120, category: "Grocery", stock: 70, unit: "kg", brand: "MDH", description: "Spicy red chili" },
    { name: "Tea Powder", price: 180, category: "Grocery", stock: 80, unit: "pack", brand: "Taj Mahal", description: "Premium tea" },
    { name: "Coffee Powder", price: 220, category: "Grocery", stock: 60, unit: "pack", brand: "Nescafe", description: "Instant coffee" },

    // Snacks
    { name: "Potato Chips", price: 20, category: "Snacks", stock: 200, unit: "pack", brand: "Lays", description: "Classic salted chips" },
    { name: "Biscuits", price: 25, category: "Snacks", stock: 150, unit: "pack", brand: "Parle", description: "Cream biscuits" },
    { name: "Chocolates", price: 50, category: "Snacks", stock: 100, unit: "pack", brand: "Cadbury", description: "Milk chocolate" },
    { name: "Namkeen", price: 40, category: "Snacks", stock: 120, unit: "pack", brand: "Haldiram", description: "Mixed namkeen" },

    // Beverages
    { name: "Water Bottle", price: 20, category: "Beverages", stock: 500, unit: "bottle", brand: "Bisleri", description: "Mineral water" },
    { name: "Soft Drinks", price: 40, category: "Beverages", stock: 200, unit: "bottle", brand: "Coca-Cola", description: "Carbonated drink" },
    { name: "Fruit Juice", price: 80, category: "Beverages", stock: 100, unit: "bottle", brand: "Real", description: "Mixed fruit juice" },

    // Bakery
    { name: "Bread", price: 30, category: "Bakery", stock: 80, unit: "pack", brand: "Britannia", description: "Fresh white bread" },
    { name: "Brown Bread", price: 35, category: "Bakery", stock: 70, unit: "pack", brand: "Britannia", description: "Whole wheat bread" },
    { name: "Cake", price: 150, category: "Bakery", stock: 40, unit: "pack", brand: "Britannia", description: "Chocolate cake" },

    // Household
    { name: "Detergent Powder", price: 280, category: "Household", stock: 60, unit: "pack", brand: "Surf Excel", description: "Laundry detergent" },
    { name: "Soap", price: 35, category: "Household", stock: 200, unit: "pack", brand: "Dove", description: "Bathing soap" },
    { name: "Floor Cleaner", price: 180, category: "Household", stock: 50, unit: "bottle", brand: "Harpic", description: "Floor cleaning liquid" }
];

async function addProducts() {
    try {
        // Clear existing products
        await Product.deleteMany({});
        console.log('✅ Cleared existing products');

        // Add all products
        await Product.insertMany(products);
        console.log(`✅ Added ${products.length} products to database!`);

        console.log('\n📊 Category-wise count:');
        const categories = [...new Set(products.map(p => p.category))];
        categories.forEach(cat => {
            const count = products.filter(p => p.category === cat).length;
            console.log(`  - ${cat}: ${count} products`);
        });

        console.log('\n🎉 All products are now available in Admin Panel!');
        console.log('📝 Go to Admin Panel → Products tab to see them');

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

addProducts();