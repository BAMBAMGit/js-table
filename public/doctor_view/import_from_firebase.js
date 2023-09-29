import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, get } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";

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


function get_database() {
    return new Promise((resolve, reject) => {
      // Read data once using the get() function
    get(dataRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log("Retrieved data from get (one time request):", data);
                resolve(data); // Resolve the Promise with the data
            } else {
                console.log("No data available");
                reject("No data available"); // Reject the Promise if no data
            }   
        })
        .catch((error) => {
            console.error("Error retrieving data:", error);
            reject(error); // Reject the Promise if there's an error
        });
    });
  }
  
  // handle the click by awaiting the data, then writing the data to the table
  async function handleClick() {
    try {
        const result = await get_database();
        console.log("Data called upon by handleClick function:", result);

        write_data_to_table_function (result)
        

    } catch (error) {
        console.error("An error occurred:", error);
    }
  }
  

// Get the button element by its id
const button = document.getElementById('myButton');

// Attach the function to the button's click event
button.addEventListener('click', handleClick);
