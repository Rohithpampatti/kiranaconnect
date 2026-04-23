import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    image: String,
    stock: Number,
    unit: String
});

const Product = mongoose.model('Product', productSchema);

const products = [
    {
        name: "Fresh Apples",
        price: 80,
        category: "Fruits",
        image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
        stock: 50,
        unit: "kg"
    },
    {
        name: "Organic Bananas",
        price: 40,
        category: "Fruits",
        image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224",
        stock: 100,
        unit: "dozen"
    },
    {
        name: "Fresh Milk",
        price: 60,
        category: "Dairy",
        image: "https://images.unsplash.com/photo-1563636619-e9143da7973b",
        stock: 30,
        unit: "liter"
    },
    {
        name: "Brown Bread",
        price: 35,
        category: "Bakery",
        image: "https://images.unsplash.com/photo-1509440159596-0249085222d9",
        stock: 40,
        unit: "pack"
    },
    {
        name: "Tomatoes",
        price: 30,
        category: "Vegetables",
        image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa2e5",
        stock: 60,
        unit: "kg"
    },
    {
        name: "Onions",
        price: 25,
        category: "Vegetables",
        image: "https://images.unsplash.com/photo-1508747703725-719777637510",
        stock: 80,
        unit: "kg"
    }
];

async function seedProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kiranaconnect');
        await Product.deleteMany();
        await Product.insertMany(products);
        console.log('✅ Products seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
}

seedProducts();