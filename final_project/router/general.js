const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

//My own defined Utility functions for register functionality
const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  //Write your code here

  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "The user details have been successfully registered."});
    } else {
      return res.status(404).json({message: "Username already exists!"});
    }
  }
  else if (!username || !password) {
    return res.status(404).json({message: "Please provide registration details!"});
  }
  else
      return res.status(404).json({message: "Error unable to register user."});

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    res.send(JSON.stringify({books},null,4));
});




// Get the book list available in the shop asynchronously
public_users.get('/books',async function (req, res) {
  try {
    // Make a GET request to fetch data from the books API
    const response = await axios.get('http://localhost:5000/');
    
    // Extract the data from the response
    const books = response.data;

    // Respond with the books data
    res.send(books);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);

 });
  

 // Get book details based on ISBN asynchronously
public_users.get('/asyncisbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    // Make a GET request to fetch data from the books API
    const response = await axios.get('http://localhost:5000/isbn/'+isbn);
    
    // Extract the data from the response
    const books = response.data;

    // Respond with the books data
    res.send(books);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let filteredBooks = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if(books[isbn]["author"] === req.params.author) {
      filteredBooks.push({//"isbn":isbn,
                          "author":books[isbn]["author"],
                          "title":books[isbn]["title"],
                          "reviews":books[isbn]["reviews"]});
    }
  });
  res.send(JSON.stringify({filteredBooks}, null, 4));

});

// Get book details based on author asynchronously
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    // Make a GET request to fetch data from the books API
    const response = await axios.get('http://localhost:5000/author/'+author);
    
    // Extract the data from the response
    const filteredBooks = response.data;

    // Respond with the books data
    res.send(filteredBooks);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let filteredBooks = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if(books[isbn]["title"] === req.params.title) {
      filteredBooks.push({//"isbn":isbn,
                          "author":books[isbn]["author"],
                          "title":books[isbn]["title"],
                          "reviews":books[isbn]["reviews"]});
    }
  });
  res.send(JSON.stringify({filteredBooks}, null, 4));

});

// Get all books based on title asynchronously
public_users.get('/title/:title',async function (req, res) {
  try {
    const title = req.params.title;
    // Make a GET request to fetch data from the books API
    const response = await axios.get('http://localhost:5000/title/'+title);
    
    // Extract the data from the response
    const filteredBooks = response.data;

    // Respond with the books data
    res.send(filteredBooks);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]["reviews"])

});

module.exports.general = public_users;
