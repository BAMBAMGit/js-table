const express = require('express');
const path = require('path'); // Node.js path module
const app = express();
const port = 3000;
const { exec } = require('child_process');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Define a route to serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});


// Reference the API endpoint code
const advance_who_up_functions = require('./advance_who_up_row.js');

// make the API (GET)
app.get('/api/advance_who_up_row', async (req, res) => {
  try {

    // Call your function
    const result = await advance_who_up_functions.updateWhoIsUpNext();

    // Send the result as JSON response
    res.json({ result });

  } catch (error) {
    console.error('Error in running the API to check firebase and sell accordingly:', error.message);
  }

});





app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
