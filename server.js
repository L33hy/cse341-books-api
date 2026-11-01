
require("dotenv").config();

const express = require("express");
const { connectToDatabase } = require("./config/database");
const booksRoutes = require("./routes/books");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/books", booksRoutes);

const startServer = async () => {
  try {
    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  }
};

startServer();
