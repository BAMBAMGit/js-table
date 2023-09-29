// update who_up row correctly when next hour happens

//// BASIC GAMEPLAN:
// split second after the hour changes:
// need who_up row data
// need new hour row data
// need new hour row data for docs who have 'first_patient' boxes
// if new hour is 6am --> erase all cells and start over

// update the who_up row when the hour is advanced 
// new rows go first
// then go to next_up and loop the who_up row, adding them if they are overlapping

function advance_hour() {

    // get who_up data
    var who_up_row = document.querySelectorAll('.who_up_row');
    who_up_cells = Array.from(who_up_row).filter(i => i.innerText != '');  // cells
    who_up_cell_values = who_up_cells.map((x) => {return Number(x.innerText)});  // array of values in who_up_row  [1,2,4,3 etc]  these are strings
    who_up_cell_numbers = who_up_cell_values.map(Number)  // convert to numbers
    console.log('who_up_cells')
    console.log(who_up_cells)
    console.log('who_up_cell_numbers')
    console.log(who_up_cell_numbers)

    // get new hour row data
    const now_hour_cells = document.querySelectorAll('.cells_in_current_hour');


    // Assuming you have an array 'now_hour_cells' containing cells

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
                    now_hour_input_cells.push(cell);
                    // No need to check this cell's other child nodes; move to the next cell
                    break;
                }
            }
        }
    }

    // 'now_hour_input_cells' now contains only the cells with input boxes as child nodes



    console.log('now_hour_cells')
    console.log(now_hour_cells)
    console.log('now_hour_input_cells')
    console.log(now_hour_input_cells)

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
    console.log('first_patient_cells')
    console.log(first_patient_cells)
    console.log('non_first_patient_cells')
    console.log(non_first_patient_cells)

    // get overlapping cells: iterate over who_up row and new hour row to find overlapping cells via index
    var overlappingCells = [];
    for (let i = 0; i < who_up_cells.length; i++) {
        var cellIndex = who_up_cells[i].cellIndex;
        
        if (now_hour_input_cells.some(cell => cell.cellIndex === cellIndex)) {
            overlappingCells.push(who_up_cells[i]);
        }
    }
    console.log('overlappingCells')
    console.log(overlappingCells)

    // get non-overlapping cells: filter who_up row and new hour row to find non-overlapping cells via cellIndex
    var nonOverlappingCells = Array.from(who_up_row).filter(cell1 => !now_hour_input_cells.some(cell2 => cell2.cellIndex === cell1.cellIndex));
    nonOverlappingCells.shift()  // remove the hour column value before erasing data
    console.log('nonOverlappingCells')
    console.log(nonOverlappingCells)

    // Filter non-overlapping cells that contain text
    var nonOverlappingCellsWithText = Array.from(nonOverlappingCells).filter(cell => cell.textContent.trim() !== '');
    
    //// sort cells starting from next_up cell.
    // first find the next_up cell
    var next_up_cell = document.querySelectorAll('.next_up')[0]
    var current_value = Number(next_up_cell.textContent);
    console.log('next_up_cell')
    console.log(next_up_cell)
    console.log('current_value')
    console.log(current_value)

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
    console.log('sorted_cells')
    console.log(sorted_cells)

    // reassign the overlapping cells to the correct new numbers
    for (i = 0; i < sorted_cells.length; i++) {
        var cell__ = sorted_cells[i]
        cell__.textContent = i + first_patient_cells.length + 1
    }

    // erase next_up class in non overlapping cells
    if (nonOverlappingCells) {
        next_up_in_nonOverlappingCells = nonOverlappingCells.filter(cell__ => cell__.classList.contains('next_up'))
        if (next_up_in_nonOverlappingCells.length > 0) {
            next_up_in_nonOverlappingCells[0].classList.remove("next_up");
        }
    }
    console.log('next_up_in_nonOverlappingCells')
    console.log(next_up_in_nonOverlappingCells)

    // if there are first_patient cells, the erase all previously existing next_up
    if (first_patient_cells.length > 0) {
        all_next_ups = document.querySelectorAll('.who_up_row')
        
        // iterate to remove all next_up classes
        for (var i = 0; i < all_next_ups.length; i++) {
            all_next_ups[i].classList.remove('next_up');
          }
        
    }

    // add the 'first_patients'
    for (i=0; i < first_patient_cells.length; i++) {
        cell_index = first_patient_cells[i].cellIndex
        who_up_row[cell_index].textContent = i + 1

        // add next_up class to 1st one
        if (i==0) {
            who_up_row[cell_index].classList.add('next_up')
        }

    }

    // erase non overlapping cells textContent
    nonOverlappingCells.forEach(cell__ => {
        cell__.textContent = '';
      });

}