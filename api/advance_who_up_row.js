// This is to be run every hour at start of the hour

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

// Reference a specific location in the database -- today's date in format '2023-03-24' (string)
const { DateTime } = require('luxon');  // use luxon to account for timezones (instead of new Date())
const currentDateTimeLocal = DateTime.now();  // Get the current DateTime in your local timezone
const currentDateTimeUTC = currentDateTimeLocal.toUTC();  // Convert the current DateTime to UTC
const losAngelesDateTime = currentDateTimeUTC.setZone('America/Los_Angeles');  // Set the timezone to Los Angeles (Pacific Time)

// Get yesterday's dateString
const oneDayPrevious = losAngelesDateTime.minus({ days: 1 });
const year_prev = String(oneDayPrevious['c']['year']);
const month_prev = String(oneDayPrevious['c']['month']).padStart(2, '0'); // Months are 0-based
const day_prev = String(oneDayPrevious['c']['day']).padStart(2, '0');
const dateString_prev = year_prev + '-' + month_prev + '-' + day_prev;

// Get today's dateString
const year = String(losAngelesDateTime['c']['year']);
const month = String(losAngelesDateTime['c']['month']).padStart(2, '0'); // Months are 0-based
const day = String(losAngelesDateTime['c']['day']).padStart(2, '0');
const dateString = year + '-' + month + '-' + day;

console.log("Current Date/Time (Local):", currentDateTimeLocal.toString());
console.log("Current Date/Time (UTC):", currentDateTimeUTC.toString());
console.log("Los Angeles Date/Time:", losAngelesDateTime.toString());
console.log('losAngelesDateTime', losAngelesDateTime);
console.log('dateString', dateString);
console.log('dateString_prev', dateString_prev);

const dataRef = ref(database, dateString);
const dataRef_prev = ref(database, dateString_prev);

async function get_database() {
    try {

      const snapshot = await get(dataRef);

      // get data if it exists
      if (snapshot.exists()) {

        const data = await snapshot.val();
        console.log("Retrieved data from get (one-time request), stored in const: data");        
        return data;

      } else {

        // if it's midnight, get yesterday's data and copy it to today's new database folder
        if (losAngelesDateTime['c']['hour'] == 0) {
          
          // get yesterday's data
          const snapshot = await get(dataRef_prev);
          const data = await snapshot.val();

          // set to today's new folder
          await set(dataRef, data)

          return data
        
        }

        else {
          console.log("No data available");
          throw new Error("No data available");
        }

      }



    } catch (error) {
      console.error("Error retrieving data:", error);
      throw error;
    }
  }

async function updateWhoIsUpNext() {
    try {

      // Call get_database to retrieve the data
      const data = await get_database();
  
      // Check if 'who_up_next_hour' exists in the data
      if ('who_up_next_hour' in data) {

        const jsonString = data['who_up_next_hour'];
        console.log('jsonString')
        console.log(jsonString)

        // Parse the JSON string back to a JavaScript object
        const parsedObject = JSON.parse(jsonString);
        console.log('parsedObject')
        console.log(parsedObject)

        // update the who_up_next_hour data to firebase (use update instead of set, set will replace entire existing data with new data)
        await update(dataRef, parsedObject)

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
