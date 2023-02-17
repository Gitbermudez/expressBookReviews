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
  const isbn = req.params.isbn;
  let filtered_book = books[isbn]
  if (filtered_book) {
      let review = req.query.review;
      let reviewer = req.session.authorization['username'];
      if(review) {
          filtered_book['reviews'][reviewer] = review;
          books[isbn] = filtered_book;
      }
      res.send(`The review for the book with ISBN  ${isbn} has been added/updated.`);
  }
  else{
      res.send("Unable to find this ISBN!");
  }
});


// delete book review
/*regd_users.delete("/auth/review/:isbn", (req, res) => {
 //Write your code here


const isbn = req.params.isbn;
const user = req.session.authorization["username"];
delete books[isbn]["reviews"][user];
res.send("delete success!" + books[isbn]["reviews"])
});*/

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
//module.exports.authenticatedUser = authenticatedUser;