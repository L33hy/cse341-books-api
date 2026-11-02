
const express = require("express");
const router = express.Router();

const { getDatabase } = require("../config/database");


router.get("/", async (req, res) => {
  try {
    const db = getDatabase();

    const books = await db.collection("books")
      .find({})
      .project({
        _id: 0,
        id: 1,
        author: 1,
        title: 1,
        publicationDate: 1
      })
      .toArray();

    res.status(200).json(books);
  } catch (error) {
    console.error("Error retrieving books:", error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const db = getDatabase();
    const book = await db.collection("books").findOne(
      { id: req.params.id },
      {
        projection: {
          _id: 0,
          id: 1,
          author: 1,
          title: 1,
          publicationDate: 1
        }
      }
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("Error retrieving book:", error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
});


module.exports = router;
