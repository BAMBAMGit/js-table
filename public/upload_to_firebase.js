import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";


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
// const dataRef = ref(database, 'myfolder');
const dataRef = ref(database);



// Define the function
export function upload_to_firebase_function() {

    // Create datestring for foldername
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(today.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    // reference databases and foldername
    var dataRef_custom_key = ref(database, dateString);

    // get table data
    const table_data_ = all_ids_to_key_values_pairs()

    // Write the table data to the database
    set(dataRef_custom_key, table_data_)
    .then(() => {
        console.log('Data was successfully pushed to the database.');
    })
    .catch(error => {
        console.error('Error writing data:', error);
    });
    
}

// Get a reference to the button element
const buttonElement = document.getElementById('upload_to_firebase_button');

// Attach the function as an event listener to the button's click event
buttonElement.addEventListener('click', upload_to_firebase_function);
