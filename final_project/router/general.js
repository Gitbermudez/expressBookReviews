const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
//public_users.post("/login", (req, res) => {    
  //Write your code here
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (users[req.body.username]) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users[req.body.username] = {
    password: req.body.password,
  };

  return res.status(200).json({ message: "Successfully registered" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
 //return res.status(200).json({ message: "Book list:", books: books });
 res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  //res.send(books[isbn])
  res.send(JSON.stringify({isbn},null,4));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  let booksByAuthor = [];
  for (let i = 0; i < books.length; i++) {
    if (books[i].author === req.params.author) {
      booksByAuthor.push(books[i]);
    }
  }
  if (!booksByAuthor.length) {
    return res.status(400).json({ message: "Books not found" });
  }
  return res.status(200).json({ books: booksByAuthor });

});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  let booksByTitle = [];
  for (let i = 0; i < books.length; i++) {
    if (books[i].title === req.params.title) {
      booksByTitle.push(books[i]);
    }
  }
  if (!booksByTitle.length) {
    return res.status(400).json({ message: "Books not found" });
  }
  return res.status(200).json({ books: booksByTitle });

});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
/*const { isbn } = req.params;
 const book = books[isbn];
const isbn = req.params.isbn;
 res.send(books[isbn]["reviews"])
*/
  let isbn = req.params.isbn;

  let book = books.find(book => book.isbn === isbn); 
  
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json({ review: book.review });
});


// Get all books – Using async callback function
function getAllBooks() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 2000);

    return;
  });
}

// Search by ISBN – Using Promises
function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbn];
      if (!book) {
        reject("Book not found");
      }
      resolve(book);
    }, 2000);
  });
}

// Search by author – Using async callback function
function getBookByAuthor(author) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksByAuthor = [];
      for (const key in books) {
        if (books[key].author === author) {
          booksByAuthor.push(books[key]);
        }
      }
      if (booksByAuthor.length === 0) {
        reject("Book not found");
      }
      resolve(booksByAuthor);
    }, 2000);
  });
}

// Search by title – Using async callback function
function getBookByTitle(title) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      for (const key in books) {
        if (books[key].title === title) {
          resolve(books[key]);
        }
      }
      reject("Book not found");
    }, 2000);
  });
}

module.exports.general = public_users;



