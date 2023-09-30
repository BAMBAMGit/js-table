const express = require('express');
const path = require('path'); // Node.js path module
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Define a route to serve the HTML file
app.get('/api/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Reference the API endpoint code
const advance_who_up_row_functions = require('./advance_who_up_row.js');

// Define a route to handle GET requests to /advance_who_up_row
// if it's not the index.js file:
//    remember to make a vercel.json file to help with routing, otherwise you'll get a 404 file not found error
app.get('/advance_who_up_row', async (req, res) => {

  const parsedObject = await advance_who_up_row_functions.updateWhoIsUpNext();
  res.json({ message: 'Handling GET request to /advance_who_up_row: ' + parsedObject });

});


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
