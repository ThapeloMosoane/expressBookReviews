const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  /* let validuser = users.filter((user)=>{
    return (user.username === username)
  });
  if(validuser.length > 0){
    return true;
  } else {
    return false;
  } */
  for (var user in users) {
    if (user["username"]===username) {
        return true;
    }
  }
  return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validuser = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validuser.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Please provide login details"});
    }
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const isbn = req.params.isbn;
    let filteredBook = books[isbn]
    //let completeReview = {};
    if (filteredBook) { //Check is book exists
        let review = req.body.review;
        //Add similarly for key2
        //Add similarly for key3

        let user = req.session.authorization['username'];
        //if review the review has been changed, update the review 
        if(review) {
            //completeReview = { user : review }
            //book["review"] = review
            //update for specific user
            filteredBook['reviews'][user] = review;
            //Add similarly for key2
            //Add similarly for key3
            books[isbn]=filteredBook;


        }

        res.send(`Book review by reviewer: ${user}, for book with the isbn  ${isbn} has been updated.`);
    }
    else{
        res.send("Unable to find specified book!");
    }
  
  //return res.status(300).json({message: "Yet to be implemented"});
});

// user can delete only his/her reviews and not other users
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  let filteredBook = books[isbn];

  //let completeReview = {};
  if (filteredBook) { //Check is book exists
    let user = req.session.authorization['username'];
      let review = filteredBook['reviews'][user];
      //Add similarly for key2
      //Add similarly for key3


      //if review for the specified user exists
      if(review) {
          delete books[isbn]['reviews'][user];
          //Add similarly for key2
      }
      else{
        res.send("Unable to find review for current user!");
      }

      res.send(`Book review by reviewer: ${user}, for book with the isbn  ${isbn} has been deleted.`);
  }
  else{
      res.send("Unable to find specified book!");
  }

  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
