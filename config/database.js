
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);

let database;

const connectToDatabase = async () => {
  try {
    await client.connect();

    database = client.db("cse341-books-db");

    console.log("Successfully connected to MongoDB!");

    return database;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

const getDatabase = () => {
  if (!database) {
    throw new Error("Database has not been connected.");
  }

  return database;
};

module.exports = {
  connectToDatabase,
  getDatabase
};
