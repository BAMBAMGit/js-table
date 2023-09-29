

// const express = require('express');
// const path = require('path'); // Node.js path module

// ES module syntax
import express from 'express';
import * as path from 'path';

// add this to make __dirname compatible with ES module
import { fileURLToPath } from 'url'; // Import the fileURLToPath function
const __filename = fileURLToPath(import.meta.url); // Get the current file's path
const __dirname = path.dirname(__filename); // Get the directory name

const app = express();
const port = 3000;
// const { exec } = require('child_process');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Define a route to serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});



// const advance_who_up_row_functions = require('./advance_who_up_row.js');

// Reference the API endpoint code
// ES module syntax
import { updateWhoIsUpNext } from './advance_who_up_row.js';


// make the API (GET)    --> remember to make a vercel.json file to help with routing, otherwise you'll get a 404 file not found error
app.get('/advance_who_up_row', async (req, res) => {
  try {

    // Call your function
    const result = await updateWhoIsUpNext();

    // Send the result as JSON response
    res.json({ result });

  } catch (error) {
    console.error('Error in running the API to check firebase and sell accordingly:', error.message);
  }

});





app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
