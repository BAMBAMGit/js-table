# Test_github

<!-- DONE ---- next to do: import data_table and write it to doctor_view.html. -->
<!-- button works -_> able to click and receive table data. -->
<!-- able to write received data to table. -->

<!-- DONE now write data to a folder with the current day, not the whole datetime
DONE get the data from that folder - open connection and have it update in realtime.

need to figure out how to get the latest entry to the firebase realtime database
write that latest entry to table via iterating ids
.... what i did instead was just export a single version of the table to the database.

done once we can do it with the click of a button, then set it up so it loads the latest value upon initial open of the website.
done then get it so it loads the latest value upon any change to firebase realtime database. -->

<!-- DONE Had to fix the sign up doctor -- so it transfers the highlight too. -->
<!-- DONE change button colors. remove buttons that don't do anything -->
<!-- DONE Next set up the thrive view table so it loads the table upon initial open of the website. -->
<!-- DONE need to make a promise wrapper function that runs a promise on construct_table(), then highlight row. Otherwise assign next doc function doens't work. -->

<!-- DONE if it's a brand new day 12am, then load yesterday's version. -->
<!-- THIS IS TOO EXPENSIVE to set up Chron jobs through vercel. will use free timers instead: -->
<!-- DONE 6am - reconstruct brand new table -->
<!-- DONE 12am - duplicate firebase from yesterday to today -->

<!-- DONE need to fix advance hour so it actually advances the doctor next up row on the hour
also it's not giving 2 patients to the docs who need it first... -->

<!-- run fetch/axios/http request or something similar to get the website. then use cheerio or DOMParser to access the DOM elements to
run advance_hour as a node.js script/API run in a serverless function. -->
instead I will run advance_hour every time a change is made to the website. however this time advance_hour sets a value of what next hour's who up row should look like. It's sitting there waiting for the next hour, and when it happens, then it can serve as a template for changin gthe doctor_order_row key value pairs in firebase (via a node.js triggered function)
This end goal of the function is to update each doctor_order_rowX key:value pair in firebase. In turn, this will automatically update the Thrive RN view of the assignment sheet.

Save backup before 6a clear all, 'archive' folder?

clean up the js files into thriveRN view folder

make settings page to alter shape of the table -- maybe save it in firebase?
add a password to the site?