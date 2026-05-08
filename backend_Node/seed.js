const { MongoClient } = require("mongodb");
const dotenv = require('dotenv');

// Load .env to get your Atlas URI
dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const customerNames = [
  "Rahul Sharma", "Priya Verma", "Amit Singh", "Neha Kapoor", "Rohit Yadav",
  "Sneha Patel", "Arjun Mehta", "Pooja Jain", "Karan Malhotra", "Anjali Gupta"
];

const products = [
  { productId: "PROD-101", productName: "iPhone 15", brand: "Apple", category: "Mobile", price: 79999 },
  { productId: "PROD-102", productName: "Samsung Galaxy S24", brand: "Samsung", category: "Mobile", price: 69999 },
  { productId: "PROD-103", productName: "AirPods Pro", brand: "Apple", category: "Accessories", price: 24999 },
  { productId: "PROD-104", productName: "Sony Headphones", brand: "Sony", category: "Accessories", price: 8999 },
  { productId: "PROD-105", productName: "Dell Laptop", brand: "Dell", category: "Laptop", price: 65999 }
];

const orderStatuses = ["Pending", "Confirmed", "Packed", "Shipped", "Out For Delivery", "Delivered", "Cancelled"];

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateOrder(index) {
  const customerName = randomItem(customerNames);
  const product = randomItem(products);
  const status = randomItem(orderStatuses);
  const quantity = Math.floor(Math.random() * 3) + 1;
  const subtotal = product.price * quantity;
  const tax = Math.floor(subtotal * 0.18);

  return {
    orderId: `ORD-2026-${100000 + index}`,
    customer: {
      customerId: `CUS-${9000 + index}`,
      name: customerName,
      email: customerName.toLowerCase().replace(" ", ".") + "@gmail.com",
      phone: `+91-98${Math.floor(10000000 + Math.random() * 89999999)}`
    },
    orderStatus: status,
    payment: {
      method: randomItem(["UPI", "Credit Card", "Debit Card", "COD"]),
      status: "Paid",
      paidAt: new Date()
    },
    products: [{ ...product, quantity, currency: "INR" }],
    pricing: { totalAmount: subtotal + tax, currency: "INR" },
    shipping: {
      address: { city: "Mumbai", state: "Maharashtra", country: "India" },
      courierPartner: randomItem(["Delhivery", "BlueDart", "Ekart", "DTDC"]),
      trackingNumber: `TRK${Math.floor(100000000 + Math.random() * 999999999)}`,
      deliveredAt: status === "Delivered" ? new Date() : null
    },
    createdAt: new Date()
  };
}

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await client.connect();
    const db = client.db("ecommerce_ai");
    const collection = db.collection("orders");

    // 1. Clear existing orders to prevent duplicates
    console.log("Cleaning up existing orders...");
    await collection.deleteMany({});

    // 2. Create unique index on orderId
    await collection.createIndex({ orderId: 1 }, { unique: true });

    const orders = [];
    let orderCount = 1;
    
    // Ensure every customer has 5 orders
    customerNames.forEach((customerName) => {
      for (let i = 0; i < 5; i++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const subtotal = product.price * quantity;
        const tax = Math.floor(subtotal * 0.18);
        const email = customerName.toLowerCase().replace(" ", ".") + "@gmail.com";

        orders.push({
          orderId: `ORD-2026-${100000 + orderCount}`,
          customer: {
            customerId: `CUS-${9000 + orderCount}`,
            name: customerName,
            email: email,
            phone: `+91-98${Math.floor(10000000 + Math.random() * 89999999)}`
          },
          orderStatus: status,
          payment: {
            method: ["UPI", "Credit Card", "Debit Card", "COD"][Math.floor(Math.random() * 4)],
            status: "Paid",
            paidAt: new Date()
          },
          products: [{ ...product, quantity, currency: "INR" }],
          pricing: { totalAmount: subtotal + tax, currency: "INR" },
          shipping: {
            address: { city: "Mumbai", state: "Maharashtra", country: "India" },
            courierPartner: ["Delhivery", "BlueDart", "Ekart", "DTDC"][Math.floor(Math.random() * 4)],
            trackingNumber: `TRK${Math.floor(100000000 + Math.random() * 999999999)}`,
            deliveredAt: status === "Delivered" ? new Date() : null
          },
          createdAt: new Date()
        });
        orderCount++;
      }
    });

    await collection.insertMany(orders);
    console.log(`SUCCESS: ${orders.length} guaranteed orders inserted (5 per customer)!`);
  } catch (err) {
    console.error("Error seeding:", err);
  } finally {
    await client.close();
  }
}

seedDatabase();