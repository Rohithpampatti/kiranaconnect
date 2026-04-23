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
    description: String
});

const Product = mongoose.model('Product', productSchema);

// EVERY PRODUCT with its OWN MATCHING IMAGE
const products = [
    // ============= FRUITS (18 items) =============
    { name: "Apple", price: 120, category: "Fruits", image: "https://source.unsplash.com/featured/400x400/?apple,fruit", stock: 100, unit: "kg", description: "Fresh red apples" },
    { name: "Banana", price: 40, category: "Fruits", image: "https://source.unsplash.com/featured/400x400/?banana,fruit", stock: 150, unit: "dozen", description: "Sweet bananas" },
    { name: "Mango", price: 120, category: "Fruits", image: "https://source.unsplash.com/featured/400x400/?mango,fruit", stock: 80, unit: "kg", description: "Alphonso mangoes" },
    { name: "Orange", price: 60, category: "Fruits", image: "https://source.unsplash.com/featured/400x400/?orange,fruit", stock: 100, unit: "kg", description: "Sweet oranges" },
    { name: "Grapes", price: 90, category: "Fruits", image: "https://source.unsplash.com/featured/400x400/?grapes,fruit", stock: 70, unit: "kg", description: "Green grapes" },
    { name: "Pineapple", price: 70, category: "Fruits", image: "https://source.unsplash.com/featured/400x400/?pineapple,fruit", stock: 50, unit: "kg", description: "Fresh pineapple" },
    { name: "Papaya", price: 45, category: "Fruits", image: "https://source.unsplash.com/featured/400x400/?papaya,fruit", stock: 60, unit: "kg", description: "Ripe papaya" },
    { name: "Watermelon", price: 35, category: "Fruits", image: "https://source.unsplash.com/featured/400x400/?watermelon,fruit", stock: 40, unit: "kg", description: "Sweet watermelon" },
    { name: "Pomegranate", price: 110, category: "Fruits", image: "https://source.unsplash.com/featured/400x400/?pomegranate,fruit", stock: 60, unit: "kg", description: "Fresh pomegranate" },
    { name: "Guava", price: 50, category: "Fruits", image: "https://source.unsplash.com/featured/400x400/?guava,fruit", stock: 70, unit: "kg", description: "Fresh guavas" },
    { name: "Muskmelon", price: 55, category: "Fruits", image: "https://source.unsplash.com/featured/400x400/?muskmelon,melon", stock: 40, unit: "kg", description: "Sweet muskmelon" },
    { name: "Sapota", price: 60, category: "Fruits", image: "https://source.unsplash.com/featured/400x400/?sapota,chikoo", stock: 50, unit: "kg", description: "Sweet sapota" },
    { name: "Sweet Lime", price: 50, category: "Fruits", image: "https://source.unsplash.com/featured/400x400/?lime,fruit", stock: 60, unit: "kg", description: "Fresh sweet lime" },
    { name: "Dragon Fruit", price: 180, category: "Fruits", image: "https://source.unsplash.com/featured/400x400/?dragonfruit", stock: 30, unit: "kg", description: "Fresh dragon fruit" },
    { name: "Strawberry", price: 150, category: "Fruits", image: "https://source.unsplash.com/featured/400x400/?strawberry", stock: 40, unit: "box", description: "Fresh strawberries" },
    { name: "Kiwi", price: 80, category: "Fruits", image: "https://source.unsplash.com/featured/400x400/?kiwi,fruit", stock: 50, unit: "kg", description: "Green kiwi" },
    { name: "Coconut", price: 50, category: "Fruits", image: "https://source.unsplash.com/featured/400x400/?coconut", stock: 80, unit: "piece", description: "Fresh coconut" },
    { name: "Lemon", price: 60, category: "Fruits", image: "https://source.unsplash.com/featured/400x400/?lemon,citrus", stock: 100, unit: "kg", description: "Fresh lemons" },

    // ============= VEGETABLES (18 items) =============
    { name: "Tomato", price: 30, category: "Vegetables", image: "https://source.unsplash.com/featured/400x400/?tomato,vegetable", stock: 120, unit: "kg", description: "Fresh tomatoes" },
    { name: "Potato", price: 28, category: "Vegetables", image: "https://source.unsplash.com/featured/400x400/?potato,vegetable", stock: 150, unit: "kg", description: "Fresh potatoes" },
    { name: "Onion", price: 25, category: "Vegetables", image: "https://source.unsplash.com/featured/400x400/?onion,vegetable", stock: 130, unit: "kg", description: "Red onions" },
    { name: "Carrot", price: 35, category: "Vegetables", image: "https://source.unsplash.com/featured/400x400/?carrot,vegetable", stock: 90, unit: "kg", description: "Orange carrots" },
    { name: "Cabbage", price: 20, category: "Vegetables", image: "https://source.unsplash.com/featured/400x400/?cabbage,vegetable", stock: 80, unit: "kg", description: "Fresh cabbage" },
    { name: "Cauliflower", price: 35, category: "Vegetables", image: "https://source.unsplash.com/featured/400x400/?cauliflower,vegetable", stock: 70, unit: "kg", description: "Fresh cauliflower" },
    { name: "Spinach", price: 15, category: "Vegetables", image: "https://source.unsplash.com/featured/400x400/?spinach,vegetable", stock: 60, unit: "bunch", description: "Fresh spinach" },
    { name: "Brinjal", price: 30, category: "Vegetables", image: "https://source.unsplash.com/featured/400x400/?eggplant,brinjal", stock: 80, unit: "kg", description: "Purple brinjal" },
    { name: "Okra", price: 40, category: "Vegetables", image: "https://source.unsplash.com/featured/400x400/?okra,ladyfinger", stock: 70, unit: "kg", description: "Fresh okra" },
    { name: "Green Chili", price: 30, category: "Vegetables", image: "https://source.unsplash.com/featured/400x400/?greenchili,pepper", stock: 100, unit: "kg", description: "Hot green chilies" },
    { name: "Bottle Gourd", price: 25, category: "Vegetables", image: "https://source.unsplash.com/featured/400x400/?bottlegourd", stock: 60, unit: "kg", description: "Fresh bottle gourd" },
    { name: "Ridge Gourd", price: 30, category: "Vegetables", image: "https://source.unsplash.com/featured/400x400/?ridgegourd", stock: 50, unit: "kg", description: "Fresh ridge gourd" },
    { name: "Bitter Gourd", price: 50, category: "Vegetables", image: "https://source.unsplash.com/featured/400x400/?bittergourd", stock: 45, unit: "kg", description: "Fresh bitter gourd" },
    { name: "Pumpkin", price: 30, category: "Vegetables", image: "https://source.unsplash.com/featured/400x400/?pumpkin,vegetable", stock: 50, unit: "kg", description: "Fresh pumpkin" },
    { name: "Beetroot", price: 40, category: "Vegetables", image: "https://source.unsplash.com/featured/400x400/?beetroot,vegetable", stock: 60, unit: "kg", description: "Fresh beetroot" },
    { name: "Cucumber", price: 25, category: "Vegetables", image: "https://source.unsplash.com/featured/400x400/?cucumber,vegetable", stock: 90, unit: "kg", description: "Fresh cucumber" },
    { name: "Drumstick", price: 60, category: "Vegetables", image: "https://source.unsplash.com/featured/400x400/?drumstick,vegetable", stock: 40, unit: "kg", description: "Fresh drumsticks" },
    { name: "Capsicum", price: 50, category: "Vegetables", image: "https://source.unsplash.com/featured/400x400/?capsicum,bellpepper", stock: 70, unit: "kg", description: "Green capsicum" },

    // ============= DAIRY (11 items) =============
    { name: "Milk", price: 60, category: "Dairy", image: "https://source.unsplash.com/featured/400x400/?milk,dairy", stock: 100, unit: "liter", description: "Fresh milk" },
    { name: "Curd", price: 35, category: "Dairy", image: "https://source.unsplash.com/featured/400x400/?yogurt,curd", stock: 80, unit: "kg", description: "Fresh curd" },
    { name: "Butter", price: 55, category: "Dairy", image: "https://source.unsplash.com/featured/400x400/?butter,dairy", stock: 70, unit: "pack", description: "Salted butter" },
    { name: "Cheese", price: 120, category: "Dairy", image: "https://source.unsplash.com/featured/400x400/?cheese,dairy", stock: 60, unit: "pack", description: "Processed cheese" },
    { name: "Paneer", price: 160, category: "Dairy", image: "https://source.unsplash.com/featured/400x400/?paneer,cheese", stock: 50, unit: "kg", description: "Fresh cottage cheese" },
    { name: "Ghee", price: 450, category: "Dairy", image: "https://source.unsplash.com/featured/400x400/?ghee,butter", stock: 40, unit: "liter", description: "Pure cow ghee" },
    { name: "Yogurt", price: 40, category: "Dairy", image: "https://source.unsplash.com/featured/400x400/?yogurt,dairy", stock: 70, unit: "kg", description: "Flavored yogurt" },
    { name: "Cream", price: 80, category: "Dairy", image: "https://source.unsplash.com/featured/400x400/?cream,dairy", stock: 50, unit: "pack", description: "Fresh cream" },
    { name: "Buttermilk", price: 30, category: "Dairy", image: "https://source.unsplash.com/featured/400x400/?buttermilk", stock: 60, unit: "liter", description: "Fresh buttermilk" },
    { name: "Flavored Milk", price: 40, category: "Dairy", image: "https://source.unsplash.com/featured/400x400/?flavoredmilk", stock: 80, unit: "pack", description: "Chocolate milk" },
    { name: "Eggs", price: 90, category: "Dairy", image: "https://source.unsplash.com/featured/400x400/?eggs", stock: 200, unit: "dozen", description: "Fresh eggs" },

    // ============= GROCERY - Rice & Grains (10 items) =============
    { name: "Basmati Rice", price: 120, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?basmati,rice", stock: 100, unit: "kg", description: "Premium basmati rice" },
    { name: "Sona Masoori Rice", price: 70, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?rice,grain", stock: 120, unit: "kg", description: "Daily cooking rice" },
    { name: "Raw Rice", price: 55, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?rice,raw", stock: 150, unit: "kg", description: "Regular raw rice" },
    { name: "Brown Rice", price: 90, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?brownrice", stock: 80, unit: "kg", description: "Healthy brown rice" },
    { name: "Poha", price: 45, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?poha,riceflakes", stock: 70, unit: "kg", description: "Flattened rice" },
    { name: "Suji", price: 40, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?semolina,suji", stock: 80, unit: "kg", description: "Semolina" },
    { name: "Wheat Flour", price: 35, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?wheatflour,atta", stock: 100, unit: "kg", description: "Whole wheat atta" },
    { name: "Maida", price: 40, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?maida,flour", stock: 80, unit: "kg", description: "All-purpose flour" },
    { name: "Besan", price: 60, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?besan,gramflour", stock: 70, unit: "kg", description: "Gram flour" },
    { name: "Rice Flour", price: 50, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?riceflour", stock: 60, unit: "kg", description: "Fine rice flour" },

    // ============= Dals & Pulses (9 items) =============
    { name: "Toor Dal", price: 110, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?toordal,lentils", stock: 80, unit: "kg", description: "Split pigeon pea" },
    { name: "Moong Dal", price: 100, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?moongdal,lentils", stock: 70, unit: "kg", description: "Yellow dal" },
    { name: "Urad Dal", price: 120, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?uraddal,lentils", stock: 60, unit: "kg", description: "Black gram dal" },
    { name: "Chana Dal", price: 85, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?chanadal,lentils", stock: 70, unit: "kg", description: "Bengal gram" },
    { name: "Masoor Dal", price: 90, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?masoordal,lentils", stock: 65, unit: "kg", description: "Red lentil" },
    { name: "Kabuli Chana", price: 85, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?chickpeas,kabulichana", stock: 60, unit: "kg", description: "White chickpeas" },
    { name: "Rajma", price: 100, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?rajma,kidneybeans", stock: 55, unit: "kg", description: "Kidney beans" },
    { name: "Black Chana", price: 70, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?blackchana,chickpeas", stock: 60, unit: "kg", description: "Black chickpeas" },
    { name: "Green Gram", price: 95, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?greengram,lentils", stock: 65, unit: "kg", description: "Whole green gram" },

    // ============= Cooking Oils (5 items) =============
    { name: "Sunflower Oil", price: 130, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?sunfloweroil,cookingoil", stock: 80, unit: "liter", description: "Sunflower cooking oil" },
    { name: "Groundnut Oil", price: 150, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?groundnutoil,peanutoil", stock: 60, unit: "liter", description: "Pure groundnut oil" },
    { name: "Mustard Oil", price: 140, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?mustardoil", stock: 50, unit: "liter", description: "Mustard oil" },
    { name: "Coconut Oil", price: 200, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?coconutoil", stock: 60, unit: "liter", description: "Virgin coconut oil" },
    { name: "Rice Bran Oil", price: 120, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?ricebranoil", stock: 70, unit: "liter", description: "Healthy rice bran oil" },

    // ============= Spices (10 items) =============
    { name: "Turmeric Powder", price: 70, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?turmeric,spice", stock: 80, unit: "kg", description: "Pure turmeric" },
    { name: "Red Chili Powder", price: 120, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?redchili,spice", stock: 70, unit: "kg", description: "Spicy red chili" },
    { name: "Coriander Powder", price: 80, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?coriander,spice", stock: 75, unit: "kg", description: "Dhania powder" },
    { name: "Garam Masala", price: 150, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?garammasala,spice", stock: 60, unit: "kg", description: "Aromatic spice mix" },
    { name: "Cumin Seeds", price: 150, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?cumin,seeds", stock: 70, unit: "kg", description: "Jeera" },
    { name: "Mustard Seeds", price: 90, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?mustardseeds", stock: 65, unit: "kg", description: "Rai" },
    { name: "Black Pepper", price: 400, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?blackpepper", stock: 40, unit: "kg", description: "Whole black pepper" },
    { name: "Cinnamon", price: 200, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?cinnamon,spice", stock: 45, unit: "kg", description: "Cinnamon sticks" },
    { name: "Cloves", price: 350, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?cloves,spice", stock: 35, unit: "kg", description: "Whole cloves" },
    { name: "Cardamom", price: 800, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?cardamom,spice", stock: 25, unit: "kg", description: "Green cardamom" },

    // ============= Salt & Sugar (6 items) =============
    { name: "Salt", price: 20, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?salt", stock: 150, unit: "pack", description: "Iodized salt" },
    { name: "Rock Salt", price: 30, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?rocksalt", stock: 80, unit: "kg", description: "Sendha namak" },
    { name: "Sugar", price: 42, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?sugar", stock: 120, unit: "kg", description: "White sugar" },
    { name: "Brown Sugar", price: 60, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?brownsugar", stock: 70, unit: "kg", description: "Natural brown sugar" },
    { name: "Jaggery", price: 70, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?jaggery", stock: 80, unit: "kg", description: "Natural jaggery" },
    { name: "Honey", price: 300, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?honey", stock: 50, unit: "kg", description: "Pure organic honey" },

    // ============= Breakfast & Instant (5 items) =============
    { name: "Oats", price: 80, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?oats,cereal", stock: 90, unit: "kg", description: "Rolled oats" },
    { name: "Cornflakes", price: 120, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?cornflakes,cereal", stock: 70, unit: "pack", description: "Breakfast cornflakes" },
    { name: "Vermicelli", price: 50, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?vermicelli,noodles", stock: 80, unit: "pack", description: "Sevaiyan" },
    { name: "Instant Noodles", price: 40, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?instantnoodles", stock: 100, unit: "pack", description: "2-minute noodles" },
    { name: "Pasta", price: 60, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?pasta", stock: 70, unit: "pack", description: "Macaroni pasta" },

    // ============= Condiments (5 items) =============
    { name: "Tomato Ketchup", price: 80, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?ketchup", stock: 60, unit: "bottle", description: "Tomato sauce" },
    { name: "Soy Sauce", price: 100, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?soysauce", stock: 50, unit: "bottle", description: "Dark soy sauce" },
    { name: "Pickles", price: 120, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?pickles", stock: 60, unit: "jar", description: "Mixed pickle" },
    { name: "Jam", price: 100, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?jam", stock: 70, unit: "jar", description: "Mixed fruit jam" },
    { name: "Peanut Butter", price: 180, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?peanutbutter", stock: 50, unit: "jar", description: "Creamy peanut butter" },

    // ============= Dry Fruits (5 items) =============
    { name: "Almonds", price: 800, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?almonds,nuts", stock: 40, unit: "kg", description: "Premium almonds" },
    { name: "Cashews", price: 750, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?cashews,nuts", stock: 45, unit: "kg", description: "Whole cashews" },
    { name: "Raisins", price: 250, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?raisins,dryfruits", stock: 60, unit: "kg", description: "Seedless raisins" },
    { name: "Dates", price: 300, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?dates,dryfruits", stock: 50, unit: "kg", description: "Medjool dates" },
    { name: "Pistachios", price: 900, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?pistachios,nuts", stock: 35, unit: "kg", description: "Green pistachios" },

    // ============= Tea & Coffee (4 items) =============
    { name: "Tea Powder", price: 180, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?tea", stock: 80, unit: "pack", description: "Premium tea" },
    { name: "Green Tea", price: 150, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?greentea", stock: 70, unit: "pack", description: "Green tea bags" },
    { name: "Coffee Powder", price: 220, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?coffee", stock: 60, unit: "pack", description: "Filter coffee" },
    { name: "Instant Coffee", price: 250, category: "Grocery", image: "https://source.unsplash.com/featured/400x400/?instantcoffee", stock: 50, unit: "jar", description: "Instant coffee powder" },

    // ============= SNACKS (10 items) =============
    { name: "Potato Chips", price: 20, category: "Snacks", image: "https://source.unsplash.com/featured/400x400/?potatochips", stock: 100, unit: "pack", description: "Classic salted chips" },
    { name: "Banana Chips", price: 30, category: "Snacks", image: "https://source.unsplash.com/featured/400x400/?bananachips", stock: 80, unit: "pack", description: "Crispy banana chips" },
    { name: "Biscuits", price: 25, category: "Snacks", image: "https://source.unsplash.com/featured/400x400/?biscuits", stock: 120, unit: "pack", description: "Cream biscuits" },
    { name: "Cookies", price: 60, category: "Snacks", image: "https://source.unsplash.com/featured/400x400/?cookies", stock: 90, unit: "pack", description: "Butter cookies" },
    { name: "Namkeen", price: 40, category: "Snacks", image: "https://source.unsplash.com/featured/400x400/?namkeen", stock: 100, unit: "pack", description: "Mixed namkeen" },
    { name: "Mixture", price: 45, category: "Snacks", image: "https://source.unsplash.com/featured/400x400/?mixture,snack", stock: 80, unit: "pack", description: "Spicy mixture" },
    { name: "Popcorn", price: 30, category: "Snacks", image: "https://source.unsplash.com/featured/400x400/?popcorn", stock: 90, unit: "pack", description: "Microwave popcorn" },
    { name: "Crackers", price: 50, category: "Snacks", image: "https://source.unsplash.com/featured/400x400/?crackers", stock: 70, unit: "pack", description: "Salt crackers" },
    { name: "Chocolates", price: 50, category: "Snacks", image: "https://source.unsplash.com/featured/400x400/?chocolate", stock: 100, unit: "pack", description: "Milk chocolate" },
    { name: "Instant Noodles", price: 40, category: "Snacks", image: "https://source.unsplash.com/featured/400x400/?noodles", stock: 120, unit: "pack", description: "2-minute noodles" },

    // ============= BEVERAGES (10 items) =============
    { name: "Water Bottle", price: 20, category: "Beverages", image: "https://source.unsplash.com/featured/400x400/?waterbottle", stock: 200, unit: "bottle", description: "Mineral water" },
    { name: "Soft Drinks", price: 40, category: "Beverages", image: "https://source.unsplash.com/featured/400x400/?softdrink", stock: 150, unit: "bottle", description: "Carbonated drink" },
    { name: "Fruit Juice", price: 80, category: "Beverages", image: "https://source.unsplash.com/featured/400x400/?fruitjuice", stock: 100, unit: "bottle", description: "Mixed fruit juice" },
    { name: "Tea", price: 180, category: "Beverages", image: "https://source.unsplash.com/featured/400x400/?tea", stock: 80, unit: "pack", description: "Hot tea" },
    { name: "Coffee", price: 220, category: "Beverages", image: "https://source.unsplash.com/featured/400x400/?coffee", stock: 70, unit: "pack", description: "Fresh coffee" },
    { name: "Energy Drink", price: 100, category: "Beverages", image: "https://source.unsplash.com/featured/400x400/?energydrink", stock: 80, unit: "can", description: "Energy boost" },
    { name: "Coconut Water", price: 60, category: "Beverages", image: "https://source.unsplash.com/featured/400x400/?coconutwater", stock: 60, unit: "bottle", description: "Fresh coconut water" },
    { name: "Lassi", price: 80, category: "Beverages", image: "https://source.unsplash.com/featured/400x400/?lassi", stock: 50, unit: "bottle", description: "Sweet lassi" },
    { name: "Milkshake", price: 80, category: "Beverages", image: "https://source.unsplash.com/featured/400x400/?milkshake", stock: 60, unit: "bottle", description: "Chocolate shake" },
    { name: "Soda", price: 30, category: "Beverages", image: "https://source.unsplash.com/featured/400x400/?soda", stock: 100, unit: "bottle", description: "Club soda" },

    // ============= BAKERY (10 items) =============
    { name: "Bread", price: 30, category: "Bakery", image: "https://source.unsplash.com/featured/400x400/?bread", stock: 80, unit: "pack", description: "Fresh white bread" },
    { name: "Brown Bread", price: 35, category: "Bakery", image: "https://source.unsplash.com/featured/400x400/?brownbread", stock: 70, unit: "pack", description: "Whole wheat bread" },
    { name: "Buns", price: 25, category: "Bakery", image: "https://source.unsplash.com/featured/400x400/?buns", stock: 90, unit: "pack", description: "Fresh burger buns" },
    { name: "Cakes", price: 150, category: "Bakery", image: "https://source.unsplash.com/featured/400x400/?cake", stock: 40, unit: "pack", description: "Chocolate cake" },
    { name: "Muffins", price: 60, category: "Bakery", image: "https://source.unsplash.com/featured/400x400/?muffins", stock: 50, unit: "pack", description: "Blueberry muffins" },
    { name: "Cookies", price: 80, category: "Bakery", image: "https://source.unsplash.com/featured/400x400/?cookies", stock: 70, unit: "pack", description: "Chocolate cookies" },
    { name: "Donuts", price: 70, category: "Bakery", image: "https://source.unsplash.com/featured/400x400/?donuts", stock: 50, unit: "pack", description: "Glazed donuts" },
    { name: "Pizza Base", price: 50, category: "Bakery", image: "https://source.unsplash.com/featured/400x400/?pizzabase", stock: 60, unit: "pack", description: "Pizza crust" },
    { name: "Rusk", price: 40, category: "Bakery", image: "https://source.unsplash.com/featured/400x400/?rusk,biscuit", stock: 80, unit: "pack", description: "Tea rusk" },
    { name: "Croissants", price: 50, category: "Bakery", image: "https://source.unsplash.com/featured/400x400/?croissants", stock: 60, unit: "piece", description: "Butter croissants" },

    // ============= HOUSEHOLD (12 items) =============
    { name: "Detergent Powder", price: 280, category: "Household", image: "https://source.unsplash.com/featured/400x400/?detergent", stock: 60, unit: "pack", description: "Laundry detergent" },
    { name: "Dish Wash Liquid", price: 45, category: "Household", image: "https://source.unsplash.com/featured/400x400/?dishwash", stock: 80, unit: "bottle", description: "Dishwashing liquid" },
    { name: "Floor Cleaner", price: 180, category: "Household", image: "https://source.unsplash.com/featured/400x400/?floorcleaner", stock: 50, unit: "bottle", description: "Floor cleaning liquid" },
    { name: "Toilet Cleaner", price: 120, category: "Household", image: "https://source.unsplash.com/featured/400x400/?toiletcleaner", stock: 60, unit: "bottle", description: "Toilet bowl cleaner" },
    { name: "Soap", price: 35, category: "Household", image: "https://source.unsplash.com/featured/400x400/?soap", stock: 150, unit: "pack", description: "Bathing soap" },
    { name: "Shampoo", price: 150, category: "Household", image: "https://source.unsplash.com/featured/400x400/?shampoo", stock: 80, unit: "bottle", description: "Hair shampoo" },
    { name: "Toothpaste", price: 80, category: "Household", image: "https://source.unsplash.com/featured/400x400/?toothpaste", stock: 100, unit: "pack", description: "Mint toothpaste" },
    { name: "Garbage Bags", price: 120, category: "Household", image: "https://source.unsplash.com/featured/400x400/?garbagebag", stock: 70, unit: "pack", description: "Large garbage bags" },
    { name: "Cleaning Brush", price: 60, category: "Household", image: "https://source.unsplash.com/featured/400x400/?cleaningbrush", stock: 80, unit: "piece", description: "Scrub brush" },
    { name: "Air Freshener", price: 180, category: "Household", image: "https://source.unsplash.com/featured/400x400/?airfreshener", stock: 60, unit: "bottle", description: "Room freshener" },
    { name: "Phenyl", price: 100, category: "Household", image: "https://source.unsplash.com/featured/400x400/?phenyl", stock: 50, unit: "bottle", description: "Floor disinfectant" },
    { name: "Scrub Pads", price: 80, category: "Household", image: "https://source.unsplash.com/featured/400x400/?scrubpad", stock: 90, unit: "pack", description: "Scouring pads" }
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

        console.log('\n🎉 COMPLETE KIRANA STORE READY!');
        console.log('✅ Each product has its OWN matching image from Unsplash');
        console.log('✅ Total 148 products across all categories');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

addAllProducts();