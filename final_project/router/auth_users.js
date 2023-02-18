const express = require("express");
const jwt = require("jsonwebtoken");
const session = require('express-session')
let books = require("./booksdb.js");
const regd_users = express.Router();
/*const session = require('express-session')
const routes = require('./router/lndex.js')*/
let users = [];
/*    {
        username: "user1",
        password: "password1",
      },
      {
        username: "user2",
        password: "password2",
      },
      {
        username: "user3",
        password: "password3",
      },
    ];*/

const isValid = (username) => {
  //returns boolean
  //write code to check if username is already present in records.
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
 }

 /* return users.some((user) => user.username === username);
}; */
/* for (let i = 0; i < users.length; i++)
  if (username === users[i].username)
    return false;

return true;
}*/

/*const doesExist = (username)=>{*/
   

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password are present in records.
/*  return users.some(
    (user) => user.username === username && user.password === password
  );
};*/
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
 }
 
 /* for (let i = 0; i < users.length; i++)
    if (users[i].username === username && users[i].password === password)
      return true;

  return false;
}*/

//only registered users can login
/*{
    "username":"abc",
    "password":"1234"
} */
regd_users.post("/login", (req, res) => {
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
} else {
  return res.status(208).json({message: "Invalid Login. Check username and password"});
}

});
// const { username, password } = req.body;

/*  if (!(username && password)) {
    return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60});

    req.session.authorization = {
      accessToken, username
    }

    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});*/
/*if (!req.body.username || !req.body.password) {
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
});*/

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    /*let isbn = req.params.isbn;
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
    }*/
    const isbn = req.params.isbn + "";
    const review = req.query.review;
    const username = req.user.data;
    const book = books[isbn];
    if (book) {
        book.reviews[username] = review;
        return res.status(200).json(book);
    }
    return res.status(404).json({ message: "Invalid ISBN" });
  
  
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
  //module.exports.doesExit = doesExit;
  module.exports.users = users;
  module.exports.authenticatedUser = authenticatedUser;
