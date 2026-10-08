const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 2));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
    const keys = Object.keys(books);
    const foundBooks = [];
    keys.forEach(key => {
        if (books[key].author === author) {
            foundBooks.push(books[key]);
        }
    });
    if (foundBooks.length > 0) {
        res.json(foundBooks);
    } else {
        res.status(404).json({ message: "No books found for this author" });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
    const keys = Object.keys(books);
    const foundBooks = [];
    keys.forEach(key => {
        if (books[key].title === title) {
            foundBooks.push(books[key]);
        }
    });
    if (foundBooks.length > 0) {
        res.json(foundBooks);
    } else {
        res.status(404).json({ message: "No books found for this title" });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
