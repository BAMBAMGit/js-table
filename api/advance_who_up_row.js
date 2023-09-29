const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set, get, update } = require("firebase/database");

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
const dateString = `${year}-${month}-${day}`;

const dataRef = ref(database, dateString);


async function get_database() {
    try {
      const snapshot = await get(dataRef);
  
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("Retrieved data from get (one-time request), stored in const: data");
        return data;
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
      const data = await get_database();
  
      // Check if 'who_up_next_hour' exists in the data
      if ('who_up_next_hour' in data) {
        const jsonString_retrieved = data['who_up_next_hour'];
        const parsedObject = JSON.parse(jsonString_retrieved);
        console.log('parsedObject')
        console.log(parsedObject)
  
        await update(dataRef, parsedObject)
        // // Loop through the key-value pairs and update Firebase
        // for (const key in parsedObject) {
        //     console.log('key')
        //     console.log(key)
            
        //     if (parsedObject.hasOwnProperty(key)) {

        //         const value = parsedObject[key];
        //         console.log('value')
        //         console.log(value)
    
        //         // Create an object to update the specific key in Firebase
        //         const updateObject = {key,value};
    
        //         // Update Firebase using the updateObject
        //         await update(dataRef, updateObject);
    
        //         console.log(`Updated ${key} with value ${value} in Firebase.`);
        //     }
        // }

        return parsedObject

      } else {
        console.log("No 'who_up_next_hour' data in the retrieved data.");
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
}

exports.updateWhoIsUpNext = updateWhoIsUpNext

//   // handle the click by awaiting the data, then writing the data to the table
//   async function handleClick() {
//     try {
//         const result = await get_database();
//         console.log("Data called upon by handleClick function:", result);

//         write_data_to_table_function (result)
        

//     } catch (error) {
//         console.error("An error occurred:", error);
//     }
//   }
  

// // Get the button element by its id
// const button = document.getElementById('myButton');

// // Attach the function to the button's click event
// button.addEventListener('click', handleClick);
