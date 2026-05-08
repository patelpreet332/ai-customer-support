const { MongoClient } = require("mongodb");
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const customerNames = [
  "Rahul Sharma", "Priya Verma", "Amit Singh", "Neha Kapoor", "Rohit Yadav",
  "Sneha Patel", "Arjun Mehta", "Pooja Jain", "Karan Malhotra", "Anjali Gupta"
];

async function seedUsers() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await client.connect();
    const db = client.db("ecommerce_ai");
    const collection = db.collection("users");

    // Clear existing users
    await collection.deleteMany({});

    const users = customerNames.map(name => ({
      name: name,
      email: name.toLowerCase().replace(" ", ".") + "@gmail.com",
      password: "password123",
      createdAt: new Date()
    }));

    await collection.insertMany(users);
    console.log(`SUCCESS: ${users.length} synced users inserted into Atlas!`);
  } catch (err) {
    console.error("Error seeding users:", err);
  } finally {
    await client.close();
  }
}

seedUsers();
