// async function to return array of [firstdocs, all docs]. first docs are the docs who should be filled in first --> gets rid of on call, extra shift, flex, and split shifts
async function fetch_docs_from_amion() {

    // get current year
    var now = new Date()
    var y = now.getFullYear().toString();
    var m = (now.getMonth() + 1).toString();  // +1 because javascript's base is 0 and amion's is 1
    var d = now.getDate().toString();

    //// get around CORS issues by using CORS-anywhere development demo https://cors-anywhere.herokuapp.com/corsdemo as seen on https://medium.com/swlh/avoiding-cors-errors-on-localhost-in-2020-5a656ed8cefa
    // fetch tsv data from amion
    // var url = 'https://cors-anywhere.herokuapp.com/https://www.amion.com/cgi-bin/ocs?Lo=kpsbed&Rpt=619&Month=' + m + '&Year=' + y + '&Day=' + d
    var url = 'https://www.amion.com/cgi-bin/ocs?Lo=kpsbed&Rpt=619&Month=' + m + '&Year=' + y + '&Day=' + d

    try {

        // Check if the request was successful
        const response = await fetch(url)
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
    
        const data = await response.text();
        // Split the data into rows based on line breaks
        const rows = data.split('\n');
        
        // Remove any empty rows
        const nonEmptyRows = rows.filter(row => row.trim() !== '');
        
        // Split the rows into columns based on tabs
        const parsedData = nonEmptyRows.map(row => row.split('\t'));
        
        // Work with the parsed data
        // remove 1st 4 elements which are irrelevent
        parsedData.splice(0, 4);

        // parse the array further so it's not treated as a single string
        var parsedArray = parsedData.map(function(subArray) {
            return subArray[0].split(',')
                .map(value => value.replace(/"/g, '').trim());
            });

        // keep only unique shifts, first occurence (helps to avoid split shift problems)
        var uniqueValues = {};

        var filteredArray = parsedArray.filter(function(subArray) {
            var value = subArray[5];
            
            if (!uniqueValues[value]) {
                uniqueValues[value] = true;
                return true;
            }
            
            return false;
        });

        
        // remove the flex, extra and on call shifts
        filteredArray.splice(7, 1);
        filteredArray.splice(14, 2);

        // get names for first docs
        var firstValues = filteredArray.map(function(subArray) {
            return subArray[0];
            });

        // get names for all docs
        var allValues = parsedArray.map(function(subArray) {
            return subArray[0];
        });

        return Promise.resolve([firstValues, allValues]);

    }
    
    catch(error) {
        // Handle any errors that occurred during the request
        console.error('Error:', error);
        return Promise.reject(error);
    };

}


// container function that can be run in the construct_table() function

function add_fetched_amion_docs_to_doctor_row () {

    // Usage:  --> from what I gather, it runs the async function.
    // My async function fetches the data from amion and and packages the names into 2 distinct arrays, returned as a promise
    // then this script below uses the packaged names to rebuild the dropdown menus so they contain the docs who are working today.


    fetch_docs_from_amion()
        .then(data => {
            
            var dropdowns = document.querySelectorAll('.header-dropdown')

            doctor_names_amion_first_values = data[0]
            doctor_names_amion_all_values = data[1]

            // reset the dropdown menus' options to accurately reflect the doctors who are working today
            for (var i=0; i < dropdowns.length; i++) {

                dropdown = dropdowns[i].options

                // add all doctor's names who are on the schedule as options
                for (j=0; j < doctor_names_amion_all_values.length; j++) {
                    const option_elem = document.createElement('option');
                    option_elem.text = doctor_names_amion_all_values[j];
                    dropdown.add(option_elem);
                }

                // add miscillaneous doctor in case someone just shows up
                const option_elem = document.createElement('option');
                option_elem.text = 'Other';
                dropdown.add(option_elem);
            }


            // preselect the correct doctor in each doctor row
            for (var i = 0; i < dropdowns.length; i++) {

                dropdown_options = dropdowns[i].options
                valueToPreselect = doctor_names_amion_first_values[i]

                for (var j = 0; j < dropdown_options.length; j++) {
                current_option = dropdown_options[j];
                current_option_value = current_option.value
                
                if (current_option_value == valueToPreselect) {
                    dropdowns[i].options[j].selected = true
                }

                }

            }

        })
        .catch(error => {
        console.error('Error:', error); // Handle any errors that occurred during the fetch or data processing
        });
    
}








    
    //// use this as downloaded development data.
    // parsedData = [
    //     ['Assignments for 5-30-23     (as of May 30 19:06 2023 US ET)'],
    //     ['Field  1 -  3: Staff name, unique ID, backup ID'],
    //     ['Field  4 -  6: Assignment name, unique ID, backup ID'],
    //     ['Field  7 -  9: Date and time of assignment (GMTO=7 1 1 Pacific)'] ,
    //     ['"DDonson",19,1,"6a-4p",48,18,5-30-23,0600,1600'],
    //     ['"Blair",38,20,"6a-4p",65,19,5-30-23,0600,1600'],
    //     ['"Angemi",39,21,"6a-5p",66,20,5-30-23,0600,1700'],
    //     ['"Tsai",108,102,"8a-6p",49,21,5-30-23,0800,1800'],
    //     ['"Zhang",212,995,"9a-8p (Triage until 12p)",51,22,5-30-23,0900,2000'],
    //     ['"Nguyen",29,11,"12p-12a (Triage until 3p)",52,23,5-30-23,1200,0000'],
    //     ['"Talamo",33,15,"2p-12a",53,24,5-30-23,1400,0000'],
    //     ['"Torregrossa",41,23,"Flex Shift (Default 3p-11p)",145,25,5-30-23,1600,0000'],
    //     ['"Sun",163,749,"2p-12a",132,27,5-30-23,1400,0000'],
    //     ['"Chu",150,468,"3p-2a (Triage until 6p)",55,28,5-30-23,1500,0200'],
    //     ['"Fukunaga",201,984,"4p-2a",56,29,5-30-23,1600,0200'] ,
    //     ['"Tse",135,212,"6p-4a (Triage until 10p)",57,30,5-30-23,1800,0400'] ,
    //     ['"Jason Lee",113,158,"10p-8a",58,31,5-30-23,2200,0800'],
    //     ['"Patel",191,976,"10p-8a (Triage until 12a)",59,32,5-30-23,2200,0800'],
    //     ['"Kare",82,39,"10p-8a",63,33,5-30-23,2200,0800'],
    //     ['"Fletcher",76,33,"ON CALL",62,34,5-30-23,0600,0600'],
    //     ['"Rejali",214,997,"Extra Shift",129,35,5-30-23,0600,1000'],
    //     ['"---",198,981,"Extra Shift",129,35,5-30-23,1000,1400'],
    //     ['"Wu",42,24,"Extra Shift",129,35,5-30-23,1400,1800']
    // ]

    // // remove 1st 4 elements which are irrelevent
    // parsedData.splice(0, 4);

    // // parse the array further so it's not treated as a single string
    // var parsedArray = parsedData.map(function(subArray) {
    //     return subArray[0].split(',')
    //         .map(value => value.replace(/"/g, '').trim());
    //     });

    // // keep only unique shifts, first occurence (helps to avoid split shift problems)
    // var uniqueValues = {};

    // var filteredArray = parsedArray.filter(function(subArray) {
    //     var value = subArray[5];
        
    //     if (!uniqueValues[value]) {
    //         uniqueValues[value] = true;
    //         return true;
    //     }
        
    //     return false;
    // });

    // // remove the flex, extra and on call shifts
    // filteredArray.splice(7, 1);
    // filteredArray.splice(14, 2);

    // // get names for first docs
    // var firstValues = filteredArray.map(function(subArray) {
    //     return subArray[0];
    //     });

    // // get names for all docs
    // var allValues = parsedArray.map(function(subArray) {
    //     return subArray[0];
    // });

    // return [firstValues, allValues]