# CSE 341 – Books REST API

A read-only REST API developed for the CSE 341 Week 01 assignment. The application uses Node.js, Express, and MongoDB Atlas to retrieve book records.

## Live Deployment

https://cse341-books-api-ej8x.onrender.com

## Technologies Used

- Node.js
- Express.js
- MongoDB Atlas
- JavaScript
- Render
- Git and GitHub

## Database

- Database name: `cse341-books-db`
- Collection name: `books`

Each book contains:

- `id`: Unique book identifier
- `author`: Author's name
- `title`: Book title
- `publicationDate`: Publication date in ISO date format

## API Endpoints

### 1. Get All Books

`GET /books`

Returns all books in the database.

### 2. Get a Single Book

`GET /books/:id`

Example:

`GET /books/b2`

Returns the book matching the supplied ID.

### Error Responses

- `404`: `{ "message": "Book not found" }`
- `500`: `{ "message": "Internal server error" }`

## Run Locally

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Create a `.env` file in the project root.
4. Add your MongoDB connection string:

   `MONGODB_URI=your_mongodb_connection_string`

   `PORT=3000`

5. Start the application:

   `node server.js`

6. Visit `http://localhost:3000/books`.

## Deployment

The API is deployed using Render and connects to MongoDB Atlas. Environment variables are configured securely in the Render dashboard.

## Repository

https://github.com/L33hy/cse341-books-api
