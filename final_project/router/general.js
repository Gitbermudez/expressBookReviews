const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

/*const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }*/


public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
 //  getAllBooks().then((books) => {
 //   return res.status(200).json({ books });
 //  });
 res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  //const { isbn } = req.params;
  //getBookByISBN(isbn)
  //  .then((book) => {
  //    return res.status(200).json({ book });
  //  })
  //  .catch((err) => {
  //    return res.status(404).json({ message: "Book not found" });
  //  });
  const isbn = req.params.isbn;
  res.send(books[isbn])

});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
 // const { author } = req.params;
 // getBookByAuthor(author)
 //   .then((book) => {
 //     return res.status(200).json({ book });
 //   })
 //   .catch((err) => {
 //     return res.status(404).json({ message: "Book not found" });
 //   });
 const author = req.params.author;
 var filtered_book;
 let i = 1;
 while(books[i]){
     if (books[i]["author"]===author) {
         filtered_book = books[i];
         break;
     }
     i++;
 }
res.send(filtered_book)
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  //const { title } = req.params;
  //getBookByTitle(title)
  //  .then((book) => {
  //    return res.status(200).json({ book });
  //  })
  //  .catch((err) => {
  //    return res.status(404).json({ message: "Book not found" });
  //  });
  const title = req.params.title;
  var filtered_book;
    let i = 1;
    while(books[i]){
        if (books[i]["title"]===title) {
            filtered_book = books[i];
            break;
        }
        i++;
    }
   res.send(filtered_book)
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
 // const { isbn } = req.params;
 // const book = books[isbn];
 // if (!book) {
 //   return res.status(404).json({ message: "Book not found" });
 // }
 // return res.status(200).json({ review: book.review });
 const isbn = req.params.isbn;
 res.send(books[isbn]["reviews"])

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



