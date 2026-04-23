import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rohith:rohith@rohith.jygyyqq.mongodb.net/kiranaconnect?appName=rohith';

const productSchema = new mongoose.Schema({ name: String, image: String });
const Product = mongoose.model('Product', productSchema);

async function fixImages() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find({});
        console.log(`Found ${products.length} products. Updating images...`);

        for (let product of products) {
            // Use a unique ID for each product to get a different image
            const uniqueId = product._id.toString().slice(-4);
            product.image = `https://picsum.photos/id/${parseInt(uniqueId, 16) % 1000}/400/400`;
            await product.save();
        }

        console.log(`✅ Successfully updated ${products.length} products with working images!`);
        process.exit(0);
    } catch (error) {
        console.error('Error fixing images:', error);
        process.exit(1);
    }
}

fixImages();