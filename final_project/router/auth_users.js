const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
 return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const user = users.find(u => u.username === username && u.password === password);
    return user !== undefined;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!isValid(username)) {
        return res.status(404).json({ message: "Invalid username" });
    }

    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, "access", { expiresIn: "1h" });
        req.session.authorization = { accessToken: token };
        return res.status(200).json({ token });
    } else {
        return res.status(403).json({ message: "Invalid username or password" });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
 const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.user.username;

    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!Array.isArray(book.reviews)) {
        book.reviews = [];
    }

    const existingReview = book.reviews.find(r => r.username === username);

    if (existingReview) {
        existingReview.review = review;
    } else {
        book.reviews.push({ username, review });
    }

    return res.status(200).json({ message: "Review added successfully", reviews: book.reviews });
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
