// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, get, update } from "firebase/database";

const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get, update } = require('firebase/database');


// Replace with your Firebase project's config
const firebaseConfig = {
    apiKey: "AIzaSyDyVbPfBCRArRgbYphKKCTz1Nct9ioiOsY",
    authDomain: "assignment-sheet-data.firebaseapp.com",
    projectId: "assignment-sheet-data",
    storageBucket: "assignment-sheet-data.appspot.com",
    messagingSenderId: "967747761020",
    appId: "1:967747761020:web:60206494052c448718eaf9",
    measurementId: "G-PLCQPB986R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database
const database = getDatabase(app);

// Reference a specific location in the database
// today's date in format '2023-03-24' (string)
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
const day = String(today.getDate()).padStart(2, '0');
const dateString = String(`${year}-${month}-${day}`);

// const dataRef = ref(database, dateString);
const dataRef = ref(database);

const x = get(dataRef)
console.log('get dataRef')
console.log(x)

async function get_database() {
    try {
      const snapshot = await get(dataRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("Retrieved data from get (one-time request), stored in const: data");

        console.log('data1')
        // Convert the object to a JSON string
        const jsonString = JSON.stringify(data);
        console.log(jsonString); // JSON string representation of the object
        console.log('jsonString1')
        
        return jsonString;

      } else {
        console.log("No data available");
        throw new Error("No data available");
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
      throw error;
    }
  }

async function updateWhoIsUpNext() {
    try {
      // Call get_database to retrieve the data
      const jsonString = await get_database();
      const data = JSON.parse(jsonString);
  
      // Check if 'who_up_next_hour' exists in the data
      if ('who_up_next_hour' in data) {
        const who_up_data_object = data['who_up_next_hour'];
  
        // update the who_up_next_hour data to firebase (use update instead of set, set will replace entire existing data with new data)
        await update(dataRef, who_up_data_object)

        return jsonString

      } else {
        console.log("No 'who_up_next_hour' data in the retrieved data.");
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
}

exports.updateWhoIsUpNext = updateWhoIsUpNext

// // Import necessary dependencies
// const express = require('express');
// const app_express = express();


// // Define a route to handle GET requests to /advance_who_up_row
// // if it's not the index.js file:
// //    remember to make a vercel.json file to help with routing, otherwise you'll get a 404 file not found error
// app_express.get('/advance_who_up_row', async (req, res) => {

//   const parsedObject = await updateWhoIsUpNext();
//   res.json({ message: 'Handling GET request to /advance_who_up_row: ' + parsedObject });

// });

// // Start the Express server
// const port = process.env.PORT || 3000;
// app_express.listen(port, () => {
//   console.log(`Server is listening on port ${port}`);
// });




// updateWhoIsUpNext()

// exports.updateWhoIsUpNext = updateWhoIsUpNext

// // new ES module syntax to export functions
// export { updateWhoIsUpNext };
