const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');





public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Simulating async call to get books data
const getBooks = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(books);
        }, 1000); // Simulating a delay
    });
};


    //Write your code here
// Get the list of books available in the shop
public_users.get('/', async function (req, res) {
    try {
        const books = await getBooks();
        return res.status(200).send(JSON.stringify(books, null, 4));
    } catch (error) {
        return res.status(500).json({message: "Error fetching books."});
    }
});

// Async call using Promise
const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject('Book not found');
            }
        }, 1000); // Simulating a delay
    });
};

// Get book details based on ISBN using Promises with Axios
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    getBookByISBN(isbn)
        .then(book => {
            res.status(200).send(JSON.stringify(book, null, 4));
        })
        .catch(error => {
            res.status(500).json({message: "Error fetching book details."});
        });
});
  
// Get book details based on Author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const books = await getBooks();
        let result = [];
        for (let isbn in books) {
            if (books[isbn]["author"] === author) {
                result.push({
                    isbn: isbn,
                    title: books[isbn]["title"],
                    reviews: books[isbn]["reviews"]
                });
            }
        }
        return res.status(200).send(JSON.stringify({booksbyauthor: result}, null, 4));
    } catch (error) {
        return res.status(500).json({message: "Error fetching books by author."});
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const books = await getBooks();
        let result = [];
        for (let isbn in books) {
            if (books[isbn]["title"] === title) {
                result.push({
                    isbn: isbn,
                    author: books[isbn]["author"],
                    reviews: books[isbn]["reviews"]
                });
            }
        }
        return res.status(200).send(JSON.stringify({booksbytitle: result}, null, 4));
    } catch (error) {
        return res.status(500).json({message: "Error fetching books by title."});
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    getBookByISBN(isbn)
        .then(book => {
            res.status(200).send(JSON.stringify(book.reviews, null, 4));
        })
        .catch(error => {
            res.status(500).json({message: "Error fetching book reviews."});
        });
});


module.exports.general = public_users;
