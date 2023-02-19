const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();
let users = [];

 const isValid = (username) => {
  //returns boolean
  //write code to check if username is already present in records.
  //return users[username] !== undefined;
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}  
 

const authenticatedUser = (username,password) => {
  //returns boolean
  //write code to check if username and password are present in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
//write code to check if username and password match the one we have in records.  
 }
 
 //only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  //const username = req.body.username;
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
}

if (authenticatedUser(username,password)) {
  let accessToken = jwt.sign({
    data: password
 }, 'access', { expiresIn: 60 * 60  });
//  }, 'access', { expiresIn: 60 });

  req.session.authorization = {
    accessToken,username
}
return res.status(200).send("User successfully logged in");
}
else {
  return res.status(208).json({message: "Invalid Login. Check username and password"});
}
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const review = req.query.review;
    const user = req.session.authorization["username"];

    books[isbn]["reviews"][user] =review;
    
    res.send(isbn + " new review added!" + user + ":" + review)
});
  
  
  // delete book review
  regd_users.delete("/auth/review/:isbn", (req, res) => {
   //*Write your code here

  const isbn = req.params.isbn;
  const user = req.session.authorization["username"];
  delete books[isbn]["reviews"][user];
  res.send("delete success!" + books[isbn]["reviews"])
  })
  
  module.exports.authenticated = regd_users;
  module.exports.isValid = isValid;
  module.exports.users = users;