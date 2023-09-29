import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getDatabase, ref, onValue, get } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";

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

// Reference to the location in the database where your data is stored

// today's date in format '2023-03-24' (string)
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
const day = String(today.getDate()).padStart(2, '0');
const dateString = `${year}-${month}-${day}`;

const dataRef = ref(database, dateString);

// Listen for changes in the data
function write_data_table_changes_in_realtime () {

    onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        console.log("Retrieved data from OnValue (realtime updates):", data);

        // write imported data from firebase to my table
        write_data_to_table_function (data)

        // highlight the appropriate 'next_up' doctor cell
        highlight_next_up_doctor_cell (data)

    }, {
        // Optional error callback
        errorCallback: (error) => {
            console.error("Error retrieving data:", error);
        }
    });

}

write_data_table_changes_in_realtime ()