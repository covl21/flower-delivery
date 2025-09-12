// server/seed.js
const mongoose = require("mongoose");
const Shop = require("./models/Shop");
require("dotenv").config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/flower-delivery";


const API_BASE_URL = "https://flower-delivery-warp.onrender.com";


function daysAgo(num) {
  const d = new Date();
  d.setDate(d.getDate() - num);
  return d;
}

const shops = [
  {
    name: "Flower Shop A",
    products: [
      { name: "Rose", price: 10, image: `${API_BASE_URL}/images/rose.jpg`, dateAdded: daysAgo(1) },
      { name: "Tulip", price: 8, image: `${API_BASE_URL}/images/tulip.jpg`, dateAdded: daysAgo(2) },
      { name: "Daisy", price: 5, image: `${API_BASE_URL}/images/daisy.jpg`, dateAdded: daysAgo(3) },
      { name: "Lavender", price: 7, image: `${API_BASE_URL}/images/lavender.jpg`, dateAdded: daysAgo(4) },
      { name: "Daffodil", price: 7, image: `${API_BASE_URL}/images/daffodil.jpg`, dateAdded: daysAgo(1) },
      { name: "Jasmine", price: 9, image: `${API_BASE_URL}/images/jasmine.jpg`, dateAdded: daysAgo(2) },
      { name: "Peony", price: 14, image: `${API_BASE_URL}/images/peony.jpg`, dateAdded: daysAgo(3) },
      { name: "Poppy", price: 5, image: `${API_BASE_URL}/images/poppy.jpg`, dateAdded: daysAgo(4) },
      { name: "Chrysanthemum", price: 6, image: `${API_BASE_URL}/images/chrysanthemum.jpg`, dateAdded: daysAgo(5) },
      { name: "Gardenia", price: 13, image: `${API_BASE_URL}/images/gardenia.jpg`, dateAdded: daysAgo(6) },
      { name: "Lily", price: 12, image: `${API_BASE_URL}/images/lily.jpg`, dateAdded: daysAgo(1) },
      { name: "Orchid", price: 15, image: `${API_BASE_URL}/images/orchid.jpg`, dateAdded: daysAgo(2) },
      { name: "Carnation", price: 6, image: `${API_BASE_URL}/images/carnation.jpg`, dateAdded: daysAgo(3) },
      { name: "Violet", price: 4, image: `${API_BASE_URL}/images/violet.jpg`, dateAdded: daysAgo(4) },
    ]
  },
  {
    name: "Flower Shop B",
    products: [
      { name: "Lily", price: 12, image: `${API_BASE_URL}/images/lily.jpg`, dateAdded: daysAgo(1) },
      { name: "Orchid", price: 15, image: `${API_BASE_URL}/images/orchid.jpg`, dateAdded: daysAgo(2) },
      { name: "Carnation", price: 6, image: `${API_BASE_URL}/images/carnation.jpg`, dateAdded: daysAgo(3) },
      { name: "Violet", price: 4, image: `${API_BASE_URL}/images/violet.jpg`, dateAdded: daysAgo(4) },
      { name: "Rose", price: 10, image: `${API_BASE_URL}/images/rose.jpg`, dateAdded: daysAgo(1) },
      { name: "Tulip", price: 8, image: `${API_BASE_URL}/images/tulip.jpg`, dateAdded: daysAgo(2) },
      { name: "Daisy", price: 5, image: `${API_BASE_URL}/images/daisy.jpg`, dateAdded: daysAgo(3) },
      { name: "Lavender", price: 7, image: `${API_BASE_URL}/images/lavender.jpg`, dateAdded: daysAgo(4) },
      { name: "Daffodil", price: 7, image: `${API_BASE_URL}/images/daffodil.jpg`, dateAdded: daysAgo(1) },
      { name: "Jasmine", price: 9, image: `${API_BASE_URL}/images/jasmine.jpg`, dateAdded: daysAgo(2) },
      { name: "Peony", price: 14, image: `${API_BASE_URL}/images/peony.jpg`, dateAdded: daysAgo(3) },
      { name: "Poppy", price: 5, image: `${API_BASE_URL}/images/poppy.jpg`, dateAdded: daysAgo(4) },
      { name: "Chrysanthemum", price: 6, image: `${API_BASE_URL}/images/chrysanthemum.jpg`, dateAdded: daysAgo(5) },
      { name: "Gardenia", price: 13, image: `${API_BASE_URL}/images/gardenia.jpg`, dateAdded: daysAgo(6) },
    ]
  },
  {
    name: "Flower Shop C",
    products: [
      { name: "Daffodil", price: 7, image: `${API_BASE_URL}/images/daffodil.jpg`, dateAdded: daysAgo(1) },
      { name: "Jasmine", price: 9, image: `${API_BASE_URL}/images/jasmine.jpg`, dateAdded: daysAgo(2) },
      { name: "Peony", price: 14, image: `${API_BASE_URL}/images/peony.jpg`, dateAdded: daysAgo(3) },
      { name: "Poppy", price: 5, image: `${API_BASE_URL}/images/poppy.jpg`, dateAdded: daysAgo(4) },
      { name: "Chrysanthemum", price: 6, image: `${API_BASE_URL}/images/chrysanthemum.jpg`, dateAdded: daysAgo(5) },
      { name: "Gardenia", price: 13, image: `${API_BASE_URL}/images/gardenia.jpg`, dateAdded: daysAgo(6) },
      { name: "Lily", price: 12, image: `${API_BASE_URL}/images/lily.jpg`, dateAdded: daysAgo(1) },
      { name: "Orchid", price: 15, image: `${API_BASE_URL}/images/orchid.jpg`, dateAdded: daysAgo(2) },
      { name: "Carnation", price: 6, image: `${API_BASE_URL}/images/carnation.jpg`, dateAdded: daysAgo(3) },
      { name: "Violet", price: 4, image: `${API_BASE_URL}/images/violet.jpg`, dateAdded: daysAgo(4) },
      { name: "Rose", price: 10, image: `${API_BASE_URL}/images/rose.jpg`, dateAdded: daysAgo(1) },
      { name: "Tulip", price: 8, image: `${API_BASE_URL}/images/tulip.jpg`, dateAdded: daysAgo(2) },
      { name: "Daisy", price: 5, image: `${API_BASE_URL}/images/daisy.jpg`, dateAdded: daysAgo(3) },
      { name: "Lavender", price: 7, image: `${API_BASE_URL}/images/lavender.jpg`, dateAdded: daysAgo(4) },
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding");

    await Shop.deleteMany({});
    await Shop.insertMany(shops);

    console.log("Seed completed successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();

