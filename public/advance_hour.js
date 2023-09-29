// calculate key:value pairs object for what advancing the hour should look like.
// this will be run and uploaded to firebase with every change to the table.
// then when the hour changes, a different node.js will be run and will update the who up row and next up data in firebase which will in turn update the assignment sheet


function advance_hour() {

    // get who_up data
    var who_up_row = document.querySelectorAll('.who_up_row');
    who_up_cells = Array.from(who_up_row).filter(i => i.innerText != '');  // cells
    who_up_cell_values = who_up_cells.map((x) => {return Number(x.innerText)});  // array of values in who_up_row  [1,2,4,3 etc]  these are strings
    who_up_cell_numbers = who_up_cell_values.map(Number)  // convert to numbers

    // get new hour row data
    const now_hour_cells = document.querySelectorAll('.cells_in_current_hour');


    // Initialize an array to store the cells with input boxes
    var now_hour_input_cells = [];

    // Iterate through the 'now_hour_cells' array
    for (var i = 0; i < now_hour_cells.length; i++) {
        var cell = now_hour_cells[i];

        // Check if the cell has any child nodes
        if (cell.childNodes) {
            // Iterate through the child nodes of the cell
            for (var j = 0; j < cell.childNodes.length; j++) {
                var child = cell.childNodes[j];

                // Check if the child node is an input element
                if (child.nodeName === 'INPUT') {
                    // If it is, add the cell to the 'now_hour_input_cells' array
                    now_hour_input_cells.push(cell);  // 'now_hour_input_cells' now contains only the cells with input boxes as child nodes
                    // No need to check this cell's other child nodes; move to the next cell
                    break;
                }
            }
        }
    }

    // Initialize arrays to store the elements
    var first_patient_cells = [];
    var non_first_patient_cells = [];

    // Iterate through the cells in the 'now_hour_input_row'
    for (var i = 0; i < now_hour_input_cells.length; i++) {
        var cell = now_hour_input_cells[i];

        // Iterate through the child nodes of the cell
        for (var j = 0; j < cell.childNodes.length; j++) {
            var child = cell.childNodes[j];

            // Check if the child has the class 'first_patient'
            if (child.classList && child.classList.contains('first_patient') && (child.nodeName === 'INPUT')) {
                parentElement = child.parentNode
                first_patient_cells.push(parentElement);
                break
            } else if (child.nodeName === 'INPUT'){
                parentElement = child.parentNode
                non_first_patient_cells.push(parentElement);
                break
            }
        }
    }

    // get overlapping cells: iterate over who_up row and new hour row to find overlapping cells via index
    var overlappingCells = [];
    for (let i = 0; i < who_up_cells.length; i++) {
        var cellIndex = who_up_cells[i].cellIndex;
        
        if (now_hour_input_cells.some(cell => cell.cellIndex === cellIndex)) {
            overlappingCells.push(who_up_cells[i]);
        }
    }

    // get non-overlapping cells: filter who_up row and new hour row to find non-overlapping cells via cellIndex
    var nonOverlappingCells = Array.from(who_up_row).filter(cell1 => !now_hour_input_cells.some(cell2 => cell2.cellIndex === cell1.cellIndex));
    nonOverlappingCells.shift()  // remove the hour column value before erasing data
    
    //// sort cells starting from next_up cell.
    // first find the next_up cell
    var next_up_cell = document.querySelectorAll('.next_up')[0]
    var current_value = Number(next_up_cell.textContent);

    sorted_cells = []
    var first_overlapping_cell = false
    
    for (i=0; i < who_up_cells.length; i++) {
        // found the cell whose number is the current value
        var foundCell = who_up_cells.find(function (element) {
            return Number(element.textContent) === current_value;
        });

        // then go through sorted cells and when you first land on a cell that's in overlapping cells, make this one the next_up
        if (overlappingCells.includes(foundCell) && !first_overlapping_cell) {
            first_overlapping_cell = foundCell
            first_overlapping_cell.classList.add('next_up')
        }

        // if it's a overlapping cell, then add it to sorted cells
        if (overlappingCells.includes(foundCell)) {
            sorted_cells.push(foundCell)
        }

        // advance to the next number
        if (current_value == Math.max(...who_up_cell_numbers)) {
            current_value = 1
        }
        else {current_value++}

    }

    // this object will contain what next hour's who up row should be, and will be uploaded to firebase
    who_up_object = {}
        
    // reassign the overlapping cells to the correct new numbers
    for (i = 0; i < sorted_cells.length; i++) {
        var cell__ = sorted_cells[i]

        // add cell id and value to who_up_object as key:value pair
        who_up_object[cell__.id] = i + first_patient_cells.length + 1

        // label first sorted cell as next up. this may be overwritten later if there are 'first patient' cells
        if (i == 0) {
            who_up_object['next_up'] = cell__.id
        }
    }

    // add the 'first_patients'
    for (i=0; i < first_patient_cells.length; i++) {
        cell_index = first_patient_cells[i].cellIndex
        cellid = who_up_row[cell_index].id
        who_up_object[cellid] = i + 1

        // label 1st one as next_up
        if (i==0) {
            who_up_object['next_up'] = cellid
        }

    }

    // add empty cells to who_up_object
    for (const cell of who_up_row) {
        const cellId = cell.id 
        // Check if the cell's id is not a key in 'who_up_object'
        if (!(cellId in who_up_object)) {
            // If not, add it with an empty string value
            who_up_object[cellId] = "";
        }
    }

    return who_up_object

}


// run advance_hour() to get an key:value pair object representing next hour's who up row and store it as a div-data element in the DOM.
// once stored in the DOM, it can be easily uploaded to firebase
function calculate_advance_hour_and_store_in_div_data () {

    const who_up_object = advance_hour()

    // Serialize 'who_up_object' to a JSON string so it can be stored in div attribute
    const jsonString = JSON.stringify(who_up_object);
    console.log(jsonString)

    // Create a new div element for data storage
    const who_up_next_hour_data_div = document.createElement('div');
    who_up_next_hour_data_div.id = 'who_up_next_hour'

    // Append the new div to the body
    document.body.appendChild(who_up_next_hour_data_div);

    // Set the JSON string as the value of the 'data-my-object' attribute
    who_up_next_hour_data_div.setAttribute('data-my-object', jsonString);


    // retrieve and parse the data from the div attribute
    const jsonString_retrieved = who_up_next_hour_data_div.getAttribute('data-my-object');
    const parsedObject = JSON.parse(jsonString_retrieved);
    // 'parsedObject' now contains the deserialized object.

    console.log('hihi')
    console.log(parsedObject)
    

}
