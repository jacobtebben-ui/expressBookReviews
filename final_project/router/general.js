const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');   


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users.some(user => user.username === username)) {
        return res.status(404).json({ message: "User already exists" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 2));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {   
const isbn = req.params.isbn;
    axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`)
        .then(response => {
            const book = response.data[`ISBN:${isbn}`];
            if (book) {
                res.json(book);
            } else {
                res.status(404).json({ message: "Book not found" });
            }
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
    axios.get(`https://openlibrary.org/search.json?author=${encodeURIComponent(author)}`)
        .then(response => {
            const books = response.data.docs.map(doc => ({
                title: doc.title,
                author: author,
                isbn: doc.isbn_13 ? doc.isbn_13[0] : null
            }));
            if (books.length > 0) {
                res.json(books);
            } else {
                res.status(404).json({ message: "No books found for this author" });
            }
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
    axios.get(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`)
        .then(response => {
            const books = response.data.docs.map(doc => ({
                title: doc.title,
                author: doc.author_name ? doc.author_name[0] : "Unknown",
                isbn: doc.isbn_13 ? doc.isbn_13[0] : null
            }));
            if (books.length > 0) {
                res.json(books);
            } else {
                res.status(404).json({ message: "No books found for this title" });
            }
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.json(book.reviews);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
