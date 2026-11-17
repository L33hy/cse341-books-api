
const express = require("express");
const router = express.Router();

const { getDatabase } = require("../config/database");

// GET all authors
router.get("/", async (req, res) => {
  try {
    const db = getDatabase();

    const authors = await db.collection("authors")
      .find({})
      .project({
        _id: 0,
        id: 1,
        name: 1,
        birthYear: 1
      })
      .toArray();

    res.status(200).json(authors);

  } catch (error) {
    console.error("Error retrieving authors:", error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
});

// GET a single author by ID
router.get("/:id", async (req, res) => {
  try {
    const db = getDatabase();

    const author = await db.collection("authors").findOne(
      { id: req.params.id },
      {
        projection: {
          _id: 0,
          id: 1,
          name: 1,
          birthYear: 1
        }
      }
    );

    if (!author) {
      return res.status(404).json({
        message: "Author not found"
      });
    }

    res.status(200).json(author);

  } catch (error) {
    console.error("Error retrieving author:", error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
});

// POST - Create a new author
router.post("/", async (req, res) => {
  try {
    const db = getDatabase();

    const { id, name, birthYear } = req.body;

    // Validate required fields
    if (
      typeof id !== "string" || !id.trim() ||
      typeof name !== "string" || !name.trim() ||
      !Number.isInteger(birthYear) ||
      birthYear > new Date().getFullYear()
    ) {
      return res.status(400).json({
        message: "Invalid or missing author fields"
      });
    }

    const authorId = id.trim();

    // Check for duplicate author ID
    const existingAuthor = await db.collection("authors")
      .findOne({ id: authorId });

    if (existingAuthor) {
      return res.status(400).json({
        message: "Author ID already exists"
      });
    }

    const newAuthor = {
      id: authorId,
      name: name.trim(),
      birthYear
    };

    await db.collection("authors").insertOne(newAuthor);

    res.status(201).json(newAuthor);

  } catch (error) {
    console.error("Error creating author:", error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
});

// PUT - Update an existing author
router.put("/:id", async (req, res) => {
  try {
    const db = getDatabase();

    const { name, birthYear } = req.body;
    const authorId = req.params.id;

    // Validate required fields
    if (
      typeof name !== "string" || !name.trim() ||
      !Number.isInteger(birthYear) ||
      birthYear > new Date().getFullYear()
    ) {
      return res.status(400).json({
        message: "Invalid or missing author fields"
      });
    }

    // Update author
    const result = await db.collection("authors").updateOne(
      { id: authorId },
      {
        $set: {
          name: name.trim(),
          birthYear
        }
      }
    );

    // Check whether the author exists
    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Author not found"
      });
    }

    // Retrieve the updated author
    const updatedAuthor = await db.collection("authors").findOne(
      { id: authorId },
      {
        projection: {
          _id: 0,
          id: 1,
          name: 1,
          birthYear: 1
        }
      }
    );

    res.status(200).json(updatedAuthor);

  } catch (error) {
    console.error("Error updating author:", error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
});


// DELETE - Remove an author
router.delete("/:id", async (req, res) => {
  try {
    const db = getDatabase();
    const authorId = req.params.id;

    // Check whether the author exists
    const author = await db.collection("authors").findOne({
      id: authorId
    });

    if (!author) {
      return res.status(404).json({
        message: "Author not found"
      });
    }

    // Check whether any books reference this author
    const existingBook = await db.collection("books").findOne({
      authorId: authorId
    });

    if (existingBook) {
      return res.status(409).json({
        message: "Cannot delete author because books still reference this author"
      });
    }

    // Delete the author
    await db.collection("authors").deleteOne({
      id: authorId
    });

    res.status(204).send();

  } catch (error) {
    console.error("Error deleting author:", error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
});


module.exports = router;
