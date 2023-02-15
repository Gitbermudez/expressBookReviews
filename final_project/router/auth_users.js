const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
  

const isValid = (username) => {
  //returns boolean
  //write code to check if username is already present in records.
 // return users.some((user) => user.username === username);
 return users[username] !== undefined; 
}

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password are present in records.
  return users[username] !== undefined && users[username].password === password;
}

//only registered users can login
/*{
    "username":"abc",
    "password":"1234"
} */
regd_users.post("/login", (req, res) => {
  //Write your code here
    if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!isValid(req.body.username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  if (!authenticatedUser(req.body.username, req.body.password)) {
    return res.status(400).json({ message: "Incorrect password" });
  }

  const token = jwt.sign({ username: req.body.username }, "secretkey");

  return res.status(200).json({ token }); 
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;

  let token = req.headers["x-access-token"];

  try {
    let decoded = jwt.verify(token, "secretkey");

    if (books[isbn] === undefined) {
      return res.status(400).json({ message: "Invalid ISBN" });
    }

    books[isbn].reviews = books[isbn].reviews || {};
    books[isbn].reviews[decoded.username] = req.query.review;

    return res.status(200).json({ message: "Successfully added review" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});


// delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  /*Write your code here
  const { isbn } = req.params;
  const { username } = req.session;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  book.reviews = book.reviews.filter((review) => review.username !== username);
  return res.status(200).json({ message: "Review deleted" });
});*/

const isbn = req.params.isbn;
const user = req.session.authorization["username"];
delete books[isbn]["reviews"][user];
res.send("delete success!" + books[isbn]["reviews"])
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
//module.exports.authenticatedUser = authenticatedUser;