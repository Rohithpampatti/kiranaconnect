import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kiranaconnect')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection error:', err));

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    image: String,
    stock: Number,
    unit: String,
    description: String
});

const Product = mongoose.model('Product', productSchema);

// Complete product list with Pexels images (better for grocery items)
const products = [
    // ============= FRUITS (18 items) =============
    { name: "Apple", price: 120, category: "Fruits", image: "https://images.pexels.com/photos/102104/fruit-apple-red-delicious-102104.jpeg?w=400", stock: 100, unit: "kg", description: "Fresh red apples" },
    { name: "Banana", price: 40, category: "Fruits", image: "https://images.pexels.com/photos/594756/pexels-photo-594756.jpeg?w=400", stock: 150, unit: "dozen", description: "Sweet bananas" },
    { name: "Mango", price: 120, category: "Fruits", image: "https://images.pexels.com/photos/91153/mango-sweet-fruit-mangoes-91153.jpeg?w=400", stock: 80, unit: "kg", description: "Alphonso mangoes" },
    { name: "Orange", price: 60, category: "Fruits", image: "https://images.pexels.com/photos/616340/orange-fruit-citrus-vitamin-616340.jpeg?w=400", stock: 100, unit: "kg", description: "Sweet oranges" },
    { name: "Grapes", price: 90, category: "Fruits", image: "https://images.pexels.com/photos/708777/grapes-fruit-grape-fruit-708777.jpeg?w=400", stock: 70, unit: "kg", description: "Green grapes" },
    { name: "Pineapple", price: 70, category: "Fruits", image: "https://images.pexels.com/photos/777018/pineapple-fruit-sweet-777018.jpeg?w=400", stock: 50, unit: "kg", description: "Fresh pineapple" },
    { name: "Papaya", price: 45, category: "Fruits", image: "https://images.pexels.com/photos/988945/papaya-fruit-exotic-988945.jpeg?w=400", stock: 60, unit: "kg", description: "Ripe papaya" },
    { name: "Watermelon", price: 35, category: "Fruits", image: "https://images.pexels.com/photos/311069/watermelon-fruit-summer-311069.jpeg?w=400", stock: 40, unit: "kg", description: "Sweet watermelon" },
    { name: "Pomegranate", price: 110, category: "Fruits", image: "https://images.pexels.com/photos/2683955/pomegranate-fruit-seeds-2683955.jpeg?w=400", stock: 60, unit: "kg", description: "Fresh pomegranate" },
    { name: "Guava", price: 50, category: "Fruits", image: "https://images.pexels.com/photos/7003520/guava-fruit-closeup-7003520.jpeg?w=400", stock: 70, unit: "kg", description: "Fresh guavas" },
    { name: "Muskmelon", price: 55, category: "Fruits", image: "https://images.pexels.com/photos/1132047/melon-fruit-sweet-1132047.jpeg?w=400", stock: 40, unit: "kg", description: "Sweet muskmelon" },
    { name: "Sapota", price: 60, category: "Fruits", image: "https://images.pexels.com/photos/7003520/sapota-chikoo-fruit-7003520.jpeg?w=400", stock: 50, unit: "kg", description: "Sweet sapota" },
    { name: "Sweet Lime", price: 50, category: "Fruits", image: "https://images.pexels.com/photos/616340/lime-citrus-fresh-616340.jpeg?w=400", stock: 60, unit: "kg", description: "Fresh sweet lime" },
    { name: "Dragon Fruit", price: 180, category: "Fruits", image: "https://images.pexels.com/photos/2770823/dragon-fruit-exotic-2770823.jpeg?w=400", stock: 30, unit: "kg", description: "Fresh dragon fruit" },
    { name: "Strawberry", price: 150, category: "Fruits", image: "https://images.pexels.com/photos/46174/strawberries-berries-fruit-juicy-46174.jpeg?w=400", stock: 40, unit: "box", description: "Fresh strawberries" },
    { name: "Kiwi", price: 80, category: "Fruits", image: "https://images.pexels.com/photos/775032/kiwi-fruit-healthy-775032.jpeg?w=400", stock: 50, unit: "kg", description: "Green kiwi" },
    { name: "Coconut", price: 50, category: "Fruits", image: "https://images.pexels.com/photos/594591/coconut-fruit-tropical-594591.jpeg?w=400", stock: 80, unit: "piece", description: "Fresh coconut" },
    { name: "Lemon", price: 60, category: "Fruits", image: "https://images.pexels.com/photos/60611/lemons-fruit-sour-60611.jpeg?w=400", stock: 100, unit: "kg", description: "Fresh lemons" },

    // ============= VEGETABLES (18 items) =============
    { name: "Tomato", price: 30, category: "Vegetables", image: "https://images.pexels.com/photos/533280/tomatoes-red-ripe-533280.jpeg?w=400", stock: 120, unit: "kg", description: "Fresh tomatoes" },
    { name: "Potato", price: 28, category: "Vegetables", image: "https://images.pexels.com/photos/228677/potatoes-vegetables-food-228677.jpeg?w=400", stock: 150, unit: "kg", description: "Fresh potatoes" },
    { name: "Onion", price: 25, category: "Vegetables", image: "https://images.pexels.com/photos/134259/onions-vegetables-food-134259.jpeg?w=400", stock: 130, unit: "kg", description: "Red onions" },
    { name: "Carrot", price: 35, category: "Vegetables", image: "https://images.pexels.com/photos/143133/carrots-vegetables-healthy-143133.jpeg?w=400", stock: 90, unit: "kg", description: "Orange carrots" },
    { name: "Cabbage", price: 20, category: "Vegetables", image: "https://images.pexels.com/photos/128403/cabbage-vegetable-healthy-128403.jpeg?w=400", stock: 80, unit: "kg", description: "Fresh cabbage" },
    { name: "Cauliflower", price: 35, category: "Vegetables", image: "https://images.pexels.com/photos/131142/cauliflower-vegetables-food-131142.jpeg?w=400", stock: 70, unit: "kg", description: "Fresh cauliflower" },
    { name: "Spinach", price: 15, category: "Vegetables", image: "https://images.pexels.com/photos/807834/spinach-leafy-greens-807834.jpeg?w=400", stock: 60, unit: "bunch", description: "Fresh spinach" },
    { name: "Brinjal", price: 30, category: "Vegetables", image: "https://images.pexels.com/photos/210799/eggplant-vegetables-aubergine-210799.jpeg?w=400", stock: 80, unit: "kg", description: "Purple brinjal" },
    { name: "Okra", price: 40, category: "Vegetables", image: "https://images.pexels.com/photos/183504/okra-vegetables-food-183504.jpeg?w=400", stock: 70, unit: "kg", description: "Fresh okra" },
    { name: "Green Chili", price: 30, category: "Vegetables", image: "https://images.pexels.com/photos/2111278/green-chili-pepper-2111278.jpeg?w=400", stock: 100, unit: "kg", description: "Hot green chilies" },
    { name: "Bottle Gourd", price: 25, category: "Vegetables", image: "https://images.pexels.com/photos/123456/bottle-gourd-vegetable-123456.jpeg?w=400", stock: 60, unit: "kg", description: "Fresh bottle gourd" },
    { name: "Ridge Gourd", price: 30, category: "Vegetables", image: "https://images.pexels.com/photos/123456/ridge-gourd-vegetable-123456.jpeg?w=400", stock: 50, unit: "kg", description: "Fresh ridge gourd" },
    { name: "Bitter Gourd", price: 50, category: "Vegetables", image: "https://images.pexels.com/photos/123456/bitter-gourd-vegetable-123456.jpeg?w=400", stock: 45, unit: "kg", description: "Fresh bitter gourd" },
    { name: "Pumpkin", price: 30, category: "Vegetables", image: "https://images.pexels.com/photos/946311/pumpkin-vegetable-946311.jpeg?w=400", stock: 50, unit: "kg", description: "Fresh pumpkin" },
    { name: "Beetroot", price: 40, category: "Vegetables", image: "https://images.pexels.com/photos/154381/beetroot-vegetable-food-154381.jpeg?w=400", stock: 60, unit: "kg", description: "Fresh beetroot" },
    { name: "Cucumber", price: 25, category: "Vegetables", image: "https://images.pexels.com/photos/229448/cucumber-vegetable-slice-229448.jpeg?w=400", stock: 90, unit: "kg", description: "Fresh cucumber" },
    { name: "Drumstick", price: 60, category: "Vegetables", image: "https://images.pexels.com/photos/123456/drumstick-vegetable-123456.jpeg?w=400", stock: 40, unit: "kg", description: "Fresh drumsticks" },
    { name: "Capsicum", price: 50, category: "Vegetables", image: "https://images.pexels.com/photos/52010/bell-pepper-capsicum-vegetable-52010.jpeg?w=400", stock: 70, unit: "kg", description: "Green capsicum" },

    // ============= DAIRY (11 items) =============
    { name: "Milk", price: 60, category: "Dairy", image: "https://images.pexels.com/photos/139253/milk-glass-milk-glass-139253.jpeg?w=400", stock: 100, unit: "liter", description: "Fresh milk" },
    { name: "Curd", price: 35, category: "Dairy", image: "https://images.pexels.com/photos/4110015/yogurt-curd-bowl-4110015.jpeg?w=400", stock: 80, unit: "kg", description: "Fresh curd" },
    { name: "Butter", price: 55, category: "Dairy", image: "https://images.pexels.com/photos/2895025/butter-dairy-2895025.jpeg?w=400", stock: 70, unit: "pack", description: "Salted butter" },
    { name: "Cheese", price: 120, category: "Dairy", image: "https://images.pexels.com/photos/821365/cheese-dairy-821365.jpeg?w=400", stock: 60, unit: "pack", description: "Processed cheese" },
    { name: "Paneer", price: 160, category: "Dairy", image: "https://images.pexels.com/photos/123456/paneer-cottage-cheese-123456.jpeg?w=400", stock: 50, unit: "kg", description: "Fresh cottage cheese" },
    { name: "Ghee", price: 450, category: "Dairy", image: "https://images.pexels.com/photos/123456/ghee-butter-123456.jpeg?w=400", stock: 40, unit: "liter", description: "Pure cow ghee" },
    { name: "Yogurt", price: 40, category: "Dairy", image: "https://images.pexels.com/photos/4110015/yogurt-bowl-4110015.jpeg?w=400", stock: 70, unit: "kg", description: "Flavored yogurt" },
    { name: "Cream", price: 80, category: "Dairy", image: "https://images.pexels.com/photos/2895025/cream-dairy-2895025.jpeg?w=400", stock: 50, unit: "pack", description: "Fresh cream" },
    { name: "Buttermilk", price: 30, category: "Dairy", image: "https://images.pexels.com/photos/4110015/buttermilk-4110015.jpeg?w=400", stock: 60, unit: "liter", description: "Fresh buttermilk" },
    { name: "Flavored Milk", price: 40, category: "Dairy", image: "https://images.pexels.com/photos/139253/milk-chocolate-139253.jpeg?w=400", stock: 80, unit: "pack", description: "Chocolate milk" },
    { name: "Eggs", price: 90, category: "Dairy", image: "https://images.pexels.com/photos/162712/eggs-white-egg-162712.jpeg?w=400", stock: 200, unit: "dozen", description: "Fresh eggs" },

    // ============= GROCERY - Rice & Grains =============
    { name: "Basmati Rice", price: 120, category: "Grocery", image: "https://images.pexels.com/photos/811518/rice-basmati-raw-811518.jpeg?w=400", stock: 100, unit: "kg", description: "Premium basmati rice" },
    { name: "Sona Masoori Rice", price: 70, category: "Grocery", image: "https://images.pexels.com/photos/811518/rice-raw-grains-811518.jpeg?w=400", stock: 120, unit: "kg", description: "Daily cooking rice" },
    { name: "Raw Rice", price: 55, category: "Grocery", image: "https://images.pexels.com/photos/811518/rice-uncooked-811518.jpeg?w=400", stock: 150, unit: "kg", description: "Regular raw rice" },
    { name: "Brown Rice", price: 90, category: "Grocery", image: "https://images.pexels.com/photos/811518/brown-rice-whole-811518.jpeg?w=400", stock: 80, unit: "kg", description: "Healthy brown rice" },
    { name: "Poha", price: 45, category: "Grocery", image: "https://images.pexels.com/photos/123456/poha-flattened-rice-123456.jpeg?w=400", stock: 70, unit: "kg", description: "Flattened rice" },
    { name: "Suji", price: 40, category: "Grocery", image: "https://images.pexels.com/photos/123456/suji-semolina-123456.jpeg?w=400", stock: 80, unit: "kg", description: "Semolina" },
    { name: "Wheat Flour", price: 35, category: "Grocery", image: "https://images.pexels.com/photos/811518/wheat-flour-atta-811518.jpeg?w=400", stock: 100, unit: "kg", description: "Whole wheat atta" },
    { name: "Maida", price: 40, category: "Grocery", image: "https://images.pexels.com/photos/811518/maida-flour-811518.jpeg?w=400", stock: 80, unit: "kg", description: "All-purpose flour" },
    { name: "Besan", price: 60, category: "Grocery", image: "https://images.pexels.com/photos/123456/besan-gram-flour-123456.jpeg?w=400", stock: 70, unit: "kg", description: "Gram flour" },
    { name: "Rice Flour", price: 50, category: "Grocery", image: "https://images.pexels.com/photos/811518/rice-flour-811518.jpeg?w=400", stock: 60, unit: "kg", description: "Fine rice flour" },

    // Dals & Pulses
    { name: "Toor Dal", price: 110, category: "Grocery", image: "https://images.pexels.com/photos/811518/toor-dal-lentils-811518.jpeg?w=400", stock: 80, unit: "kg", description: "Split pigeon pea" },
    { name: "Moong Dal", price: 100, category: "Grocery", image: "https://images.pexels.com/photos/811518/moong-dal-lentils-811518.jpeg?w=400", stock: 70, unit: "kg", description: "Yellow dal" },
    { name: "Urad Dal", price: 120, category: "Grocery", image: "https://images.pexels.com/photos/811518/urad-dal-black-gram-811518.jpeg?w=400", stock: 60, unit: "kg", description: "Black gram dal" },
    { name: "Chana Dal", price: 85, category: "Grocery", image: "https://images.pexels.com/photos/811518/chana-dal-811518.jpeg?w=400", stock: 70, unit: "kg", description: "Bengal gram" },
    { name: "Masoor Dal", price: 90, category: "Grocery", image: "https://images.pexels.com/photos/811518/masoor-dal-red-lentil-811518.jpeg?w=400", stock: 65, unit: "kg", description: "Red lentil" },
    { name: "Kabuli Chana", price: 85, category: "Grocery", image: "https://images.pexels.com/photos/123456/kabuli-chana-chickpeas-123456.jpeg?w=400", stock: 60, unit: "kg", description: "White chickpeas" },
    { name: "Rajma", price: 100, category: "Grocery", image: "https://images.pexels.com/photos/123456/rajma-kidney-beans-123456.jpeg?w=400", stock: 55, unit: "kg", description: "Kidney beans" },
    { name: "Black Chana", price: 70, category: "Grocery", image: "https://images.pexels.com/photos/123456/black-chana-123456.jpeg?w=400", stock: 60, unit: "kg", description: "Black chickpeas" },
    { name: "Green Gram", price: 95, category: "Grocery", image: "https://images.pexels.com/photos/811518/green-gram-811518.jpeg?w=400", stock: 65, unit: "kg", description: "Whole green gram" },

    // Cooking Oils
    { name: "Sunflower Oil", price: 130, category: "Grocery", image: "https://images.pexels.com/photos/1351238/sunflower-oil-bottle-1351238.jpeg?w=400", stock: 80, unit: "liter", description: "Sunflower cooking oil" },
    { name: "Groundnut Oil", price: 150, category: "Grocery", image: "https://images.pexels.com/photos/1351238/groundnut-oil-bottle-1351238.jpeg?w=400", stock: 60, unit: "liter", description: "Pure groundnut oil" },
    { name: "Mustard Oil", price: 140, category: "Grocery", image: "https://images.pexels.com/photos/1351238/mustard-oil-bottle-1351238.jpeg?w=400", stock: 50, unit: "liter", description: "Mustard oil" },
    { name: "Coconut Oil", price: 200, category: "Grocery", image: "https://images.pexels.com/photos/1351238/coconut-oil-jar-1351238.jpeg?w=400", stock: 60, unit: "liter", description: "Virgin coconut oil" },
    { name: "Rice Bran Oil", price: 120, category: "Grocery", image: "https://images.pexels.com/photos/1351238/rice-bran-oil-1351238.jpeg?w=400", stock: 70, unit: "liter", description: "Healthy rice bran oil" },

    // Spices
    { name: "Turmeric Powder", price: 70, category: "Grocery", image: "https://images.pexels.com/photos/839915/turmeric-powder-spice-839915.jpeg?w=400", stock: 80, unit: "kg", description: "Pure turmeric" },
    { name: "Red Chili Powder", price: 120, category: "Grocery", image: "https://images.pexels.com/photos/161944/chili-powder-spice-161944.jpeg?w=400", stock: 70, unit: "kg", description: "Spicy red chili" },
    { name: "Coriander Powder", price: 80, category: "Grocery", image: "https://images.pexels.com/photos/839915/coriander-powder-spice-839915.jpeg?w=400", stock: 75, unit: "kg", description: "Dhania powder" },
    { name: "Garam Masala", price: 150, category: "Grocery", image: "https://images.pexels.com/photos/839915/garam-masala-spice-839915.jpeg?w=400", stock: 60, unit: "kg", description: "Aromatic spice mix" },
    { name: "Cumin Seeds", price: 150, category: "Grocery", image: "https://images.pexels.com/photos/839915/cumin-seeds-jeera-839915.jpeg?w=400", stock: 70, unit: "kg", description: "Jeera" },
    { name: "Mustard Seeds", price: 90, category: "Grocery", image: "https://images.pexels.com/photos/839915/mustard-seeds-rai-839915.jpeg?w=400", stock: 65, unit: "kg", description: "Rai" },
    { name: "Black Pepper", price: 400, category: "Grocery", image: "https://images.pexels.com/photos/839915/black-pepper-whole-839915.jpeg?w=400", stock: 40, unit: "kg", description: "Whole black pepper" },
    { name: "Cinnamon", price: 200, category: "Grocery", image: "https://images.pexels.com/photos/839915/cinnamon-sticks-839915.jpeg?w=400", stock: 45, unit: "kg", description: "Cinnamon sticks" },
    { name: "Cloves", price: 350, category: "Grocery", image: "https://images.pexels.com/photos/839915/cloves-whole-839915.jpeg?w=400", stock: 35, unit: "kg", description: "Whole cloves" },
    { name: "Cardamom", price: 800, category: "Grocery", image: "https://images.pexels.com/photos/839915/cardamom-green-839915.jpeg?w=400", stock: 25, unit: "kg", description: "Green cardamom" },

    // Salt & Sugar
    { name: "Salt", price: 20, category: "Grocery", image: "https://images.pexels.com/photos/839915/salt-iodized-839915.jpeg?w=400", stock: 150, unit: "pack", description: "Iodized salt" },
    { name: "Rock Salt", price: 30, category: "Grocery", image: "https://images.pexels.com/photos/839915/rock-salt-sendha-namak-839915.jpeg?w=400", stock: 80, unit: "kg", description: "Sendha namak" },
    { name: "Sugar", price: 42, category: "Grocery", image: "https://images.pexels.com/photos/839915/sugar-white-839915.jpeg?w=400", stock: 120, unit: "kg", description: "White sugar" },
    { name: "Brown Sugar", price: 60, category: "Grocery", image: "https://images.pexels.com/photos/839915/brown-sugar-839915.jpeg?w=400", stock: 70, unit: "kg", description: "Natural brown sugar" },
    { name: "Jaggery", price: 70, category: "Grocery", image: "https://images.pexels.com/photos/839915/jaggery-gur-839915.jpeg?w=400", stock: 80, unit: "kg", description: "Natural jaggery" },
    { name: "Honey", price: 300, category: "Grocery", image: "https://images.pexels.com/photos/794284/honey-jar-794284.jpeg?w=400", stock: 50, unit: "kg", description: "Pure organic honey" },

    // Breakfast & Instant
    { name: "Oats", price: 80, category: "Grocery", image: "https://images.pexels.com/photos/811518/oats-rolled-811518.jpeg?w=400", stock: 90, unit: "kg", description: "Rolled oats" },
    { name: "Cornflakes", price: 120, category: "Grocery", image: "https://images.pexels.com/photos/811518/cornflakes-breakfast-811518.jpeg?w=400", stock: 70, unit: "pack", description: "Breakfast cornflakes" },
    { name: "Vermicelli", price: 50, category: "Grocery", image: "https://images.pexels.com/photos/811518/vermicelli-sevaiyan-811518.jpeg?w=400", stock: 80, unit: "pack", description: "Sevaiyan" },
    { name: "Instant Noodles", price: 40, category: "Grocery", image: "https://images.pexels.com/photos/123456/instant-noodles-123456.jpeg?w=400", stock: 100, unit: "pack", description: "2-minute noodles" },
    { name: "Pasta", price: 60, category: "Grocery", image: "https://images.pexels.com/photos/123456/pasta-macaroni-123456.jpeg?w=400", stock: 70, unit: "pack", description: "Macaroni pasta" },

    // Condiments
    { name: "Tomato Ketchup", price: 80, category: "Grocery", image: "https://images.pexels.com/photos/123456/tomato-ketchup-123456.jpeg?w=400", stock: 60, unit: "bottle", description: "Tomato sauce" },
    { name: "Soy Sauce", price: 100, category: "Grocery", image: "https://images.pexels.com/photos/123456/soy-sauce-123456.jpeg?w=400", stock: 50, unit: "bottle", description: "Dark soy sauce" },
    { name: "Pickles", price: 120, category: "Grocery", image: "https://images.pexels.com/photos/123456/pickles-jar-123456.jpeg?w=400", stock: 60, unit: "jar", description: "Mixed pickle" },
    { name: "Jam", price: 100, category: "Grocery", image: "https://images.pexels.com/photos/123456/jam-jar-123456.jpeg?w=400", stock: 70, unit: "jar", description: "Mixed fruit jam" },
    { name: "Peanut Butter", price: 180, category: "Grocery", image: "https://images.pexels.com/photos/123456/peanut-butter-jar-123456.jpeg?w=400", stock: 50, unit: "jar", description: "Creamy peanut butter" },

    // Dry Fruits
    { name: "Almonds", price: 800, category: "Grocery", image: "https://images.pexels.com/photos/563939/almonds-nuts-dry-fruits-563939.jpeg?w=400", stock: 40, unit: "kg", description: "Premium almonds" },
    { name: "Cashews", price: 750, category: "Grocery", image: "https://images.pexels.com/photos/563939/cashews-nuts-563939.jpeg?w=400", stock: 45, unit: "kg", description: "Whole cashews" },
    { name: "Raisins", price: 250, category: "Grocery", image: "https://images.pexels.com/photos/563939/raisins-dry-fruits-563939.jpeg?w=400", stock: 60, unit: "kg", description: "Seedless raisins" },
    { name: "Dates", price: 300, category: "Grocery", image: "https://images.pexels.com/photos/563939/dates-medjool-563939.jpeg?w=400", stock: 50, unit: "kg", description: "Medjool dates" },
    { name: "Pistachios", price: 900, category: "Grocery", image: "https://images.pexels.com/photos/563939/pistachios-nuts-563939.jpeg?w=400", stock: 35, unit: "kg", description: "Green pistachios" },

    // Tea & Coffee
    { name: "Tea Powder", price: 180, category: "Grocery", image: "https://images.pexels.com/photos/159748/tea-cup-tea-leaves-159748.jpeg?w=400", stock: 80, unit: "pack", description: "Premium tea" },
    { name: "Green Tea", price: 150, category: "Grocery", image: "https://images.pexels.com/photos/159748/green-tea-leaves-159748.jpeg?w=400", stock: 70, unit: "pack", description: "Green tea bags" },
    { name: "Coffee Powder", price: 220, category: "Grocery", image: "https://images.pexels.com/photos/312418/coffee-beans-coffee-312418.jpeg?w=400", stock: 60, unit: "pack", description: "Filter coffee" },
    { name: "Instant Coffee", price: 250, category: "Grocery", image: "https://images.pexels.com/photos/312418/instant-coffee-jar-312418.jpeg?w=400", stock: 50, unit: "jar", description: "Instant coffee powder" },

    // ============= SNACKS =============
    { name: "Potato Chips", price: 20, category: "Snacks", image: "https://images.pexels.com/photos/158388/chips-potato-crisps-158388.jpeg?w=400", stock: 100, unit: "pack", description: "Classic salted chips" },
    { name: "Banana Chips", price: 30, category: "Snacks", image: "https://images.pexels.com/photos/158388/banana-chips-158388.jpeg?w=400", stock: 80, unit: "pack", description: "Crispy banana chips" },
    { name: "Biscuits", price: 25, category: "Snacks", image: "https://images.pexels.com/photos/158388/biscuits-cream-158388.jpeg?w=400", stock: 120, unit: "pack", description: "Cream biscuits" },
    { name: "Cookies", price: 60, category: "Snacks", image: "https://images.pexels.com/photos/158388/cookies-butter-158388.jpeg?w=400", stock: 90, unit: "pack", description: "Butter cookies" },
    { name: "Namkeen", price: 40, category: "Snacks", image: "https://images.pexels.com/photos/158388/namkeen-mixed-158388.jpeg?w=400", stock: 100, unit: "pack", description: "Mixed namkeen" },
    { name: "Mixture", price: 45, category: "Snacks", image: "https://images.pexels.com/photos/158388/mixture-spicy-158388.jpeg?w=400", stock: 80, unit: "pack", description: "Spicy mixture" },
    { name: "Popcorn", price: 30, category: "Snacks", image: "https://images.pexels.com/photos/158388/popcorn-158388.jpeg?w=400", stock: 90, unit: "pack", description: "Microwave popcorn" },
    { name: "Crackers", price: 50, category: "Snacks", image: "https://images.pexels.com/photos/158388/crackers-salt-158388.jpeg?w=400", stock: 70, unit: "pack", description: "Salt crackers" },
    { name: "Chocolates", price: 50, category: "Snacks", image: "https://images.pexels.com/photos/158388/chocolate-milk-158388.jpeg?w=400", stock: 100, unit: "pack", description: "Milk chocolate" },
    { name: "Instant Noodles", price: 40, category: "Snacks", image: "https://images.pexels.com/photos/158388/noodles-instant-158388.jpeg?w=400", stock: 120, unit: "pack", description: "2-minute noodles" },

    // ============= BEVERAGES =============
    { name: "Water Bottle", price: 20, category: "Beverages", image: "https://images.pexels.com/photos/327119/water-bottle-327119.jpeg?w=400", stock: 200, unit: "bottle", description: "Mineral water" },
    { name: "Soft Drinks", price: 40, category: "Beverages", image: "https://images.pexels.com/photos/50594/soft-drink-coca-cola-50594.jpeg?w=400", stock: 150, unit: "bottle", description: "Carbonated drink" },
    { name: "Fruit Juice", price: 80, category: "Beverages", image: "https://images.pexels.com/photos/109275/fruit-juice-109275.jpeg?w=400", stock: 100, unit: "bottle", description: "Mixed fruit juice" },
    { name: "Tea", price: 180, category: "Beverages", image: "https://images.pexels.com/photos/159748/tea-cup-159748.jpeg?w=400", stock: 80, unit: "pack", description: "Hot tea" },
    { name: "Coffee", price: 220, category: "Beverages", image: "https://images.pexels.com/photos/312418/coffee-cup-312418.jpeg?w=400", stock: 70, unit: "pack", description: "Fresh coffee" },
    { name: "Energy Drink", price: 100, category: "Beverages", image: "https://images.pexels.com/photos/50594/energy-drink-50594.jpeg?w=400", stock: 80, unit: "can", description: "Energy boost" },
    { name: "Coconut Water", price: 60, category: "Beverages", image: "https://images.pexels.com/photos/594591/coconut-water-594591.jpeg?w=400", stock: 60, unit: "bottle", description: "Fresh coconut water" },
    { name: "Lassi", price: 80, category: "Beverages", image: "https://images.pexels.com/photos/4110015/lassi-yogurt-4110015.jpeg?w=400", stock: 50, unit: "bottle", description: "Sweet lassi" },
    { name: "Milkshake", price: 80, category: "Beverages", image: "https://images.pexels.com/photos/139253/milkshake-139253.jpeg?w=400", stock: 60, unit: "bottle", description: "Chocolate shake" },
    { name: "Soda", price: 30, category: "Beverages", image: "https://images.pexels.com/photos/50594/soda-can-50594.jpeg?w=400", stock: 100, unit: "bottle", description: "Club soda" },

    // ============= BAKERY =============
    { name: "Bread", price: 30, category: "Bakery", image: "https://images.pexels.com/photos/263978/bread-bakery-263978.jpeg?w=400", stock: 80, unit: "pack", description: "Fresh white bread" },
    { name: "Brown Bread", price: 35, category: "Bakery", image: "https://images.pexels.com/photos/263978/brown-bread-263978.jpeg?w=400", stock: 70, unit: "pack", description: "Whole wheat bread" },
    { name: "Buns", price: 25, category: "Bakery", image: "https://images.pexels.com/photos/263978/burger-buns-263978.jpeg?w=400", stock: 90, unit: "pack", description: "Fresh burger buns" },
    { name: "Cakes", price: 150, category: "Bakery", image: "https://images.pexels.com/photos/291528/cake-chocolate-291528.jpeg?w=400", stock: 40, unit: "pack", description: "Chocolate cake" },
    { name: "Muffins", price: 60, category: "Bakery", image: "https://images.pexels.com/photos/291528/muffins-blueberry-291528.jpeg?w=400", stock: 50, unit: "pack", description: "Blueberry muffins" },
    { name: "Cookies", price: 80, category: "Bakery", image: "https://images.pexels.com/photos/158388/cookies-158388.jpeg?w=400", stock: 70, unit: "pack", description: "Chocolate cookies" },
    { name: "Donuts", price: 70, category: "Bakery", image: "https://images.pexels.com/photos/263978/donuts-263978.jpeg?w=400", stock: 50, unit: "pack", description: "Glazed donuts" },
    { name: "Pizza Base", price: 50, category: "Bakery", image: "https://images.pexels.com/photos/263978/pizza-base-263978.jpeg?w=400", stock: 60, unit: "pack", description: "Pizza crust" },
    { name: "Rusk", price: 40, category: "Bakery", image: "https://images.pexels.com/photos/158388/rusk-tea-158388.jpeg?w=400", stock: 80, unit: "pack", description: "Tea rusk" },
    { name: "Croissants", price: 50, category: "Bakery", image: "https://images.pexels.com/photos/263978/croissants-263978.jpeg?w=400", stock: 60, unit: "piece", description: "Butter croissants" },

    // ============= HOUSEHOLD =============
    { name: "Detergent Powder", price: 280, category: "Household", image: "https://images.pexels.com/photos/123456/detergent-powder-123456.jpeg?w=400", stock: 60, unit: "pack", description: "Laundry detergent" },
    { name: "Dish Wash Liquid", price: 45, category: "Household", image: "https://images.pexels.com/photos/123456/dish-wash-123456.jpeg?w=400", stock: 80, unit: "bottle", description: "Dishwashing liquid" },
    { name: "Floor Cleaner", price: 180, category: "Household", image: "https://images.pexels.com/photos/123456/floor-cleaner-123456.jpeg?w=400", stock: 50, unit: "bottle", description: "Floor cleaning liquid" },
    { name: "Toilet Cleaner", price: 120, category: "Household", image: "https://images.pexels.com/photos/123456/toilet-cleaner-123456.jpeg?w=400", stock: 60, unit: "bottle", description: "Toilet bowl cleaner" },
    { name: "Soap", price: 35, category: "Household", image: "https://images.pexels.com/photos/123456/soap-bar-123456.jpeg?w=400", stock: 150, unit: "pack", description: "Bathing soap" },
    { name: "Shampoo", price: 150, category: "Household", image: "https://images.pexels.com/photos/123456/shampoo-bottle-123456.jpeg?w=400", stock: 80, unit: "bottle", description: "Hair shampoo" },
    { name: "Toothpaste", price: 80, category: "Household", image: "https://images.pexels.com/photos/123456/toothpaste-123456.jpeg?w=400", stock: 100, unit: "pack", description: "Mint toothpaste" },
    { name: "Garbage Bags", price: 120, category: "Household", image: "https://images.pexels.com/photos/123456/garbage-bags-123456.jpeg?w=400", stock: 70, unit: "pack", description: "Large garbage bags" },
    { name: "Cleaning Brush", price: 60, category: "Household", image: "https://images.pexels.com/photos/123456/cleaning-brush-123456.jpeg?w=400", stock: 80, unit: "piece", description: "Scrub brush" },
    { name: "Air Freshener", price: 180, category: "Household", image: "https://images.pexels.com/photos/123456/air-freshener-123456.jpeg?w=400", stock: 60, unit: "bottle", description: "Room freshener" },
    { name: "Phenyl", price: 100, category: "Household", image: "https://images.pexels.com/photos/123456/phenyl-123456.jpeg?w=400", stock: 50, unit: "bottle", description: "Floor disinfectant" },
    { name: "Scrub Pads", price: 80, category: "Household", image: "https://images.pexels.com/photos/123456/scrub-pads-123456.jpeg?w=400", stock: 90, unit: "pack", description: "Scouring pads" }
];

async function addAllProducts() {
    try {
        // Clear existing products
        await Product.deleteMany({});
        console.log('✅ Cleared all existing products');

        // Insert all products
        await Product.insertMany(products);
        console.log(`✅ Added ${products.length} products successfully!`);

        // Show category wise count
        const categories = [...new Set(products.map(p => p.category))];
        console.log('\n📊 Category-wise products:');
        categories.forEach(cat => {
            const count = products.filter(p => p.category === cat).length;
            console.log(`  🛒 ${cat}: ${count} items`);
        });

        console.log('\n🎉 Complete Kirana store is ready!');
        console.log('✅ All images from Pexels (better for grocery items)');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

addAllProducts();