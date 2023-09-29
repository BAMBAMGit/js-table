// Assign pt and advance box

var assign_pt_button = document.getElementById('assign_pt_button');

// Attach a click event listener to the button
assign_pt_button.addEventListener('click', function() {

    ///////////// ASSIGN PATIENT /////////////
    // Get the text field element
    const textField = document.querySelector('.assign_pt_input');

    // Get the value of the text field
    var pt = textField.value;
    if (pt.length == 0) {return} // if text field is blank, then don't advance 
    
    // get boxes for current hour
    const h = new Date().getHours();
    
    // next doctor up
    next_up_col = document.querySelectorAll('.next_up')[0].cellIndex;

    // next up cell, box, set value
    var hour_row = document.querySelectorAll('.row' + h + ' > td')

    next_up_cell = Array.from(hour_row).filter(item => item.cellIndex == next_up_col);
    next_up_boxes = next_up_cell[0].childNodes;
    next_up_boxes = Array.from(next_up_boxes).filter(item => item.value == '');  // array of open boxes
    next_up_box = next_up_boxes[0];
    

    ///////////// MANAGE ROW OF NEXT UP DOCTOR /////////////
    var who_up_row = document.querySelectorAll('.who_up_row')
    who_up_cell_nodes = Array.from(who_up_row).filter(i => i.innerText != '');  // cell
    who_up_cell_values = who_up_cell_nodes.map((x) => {return Number(x.innerText)});  // array of values in who_up_row  [1,2,4,3 etc]

    // are there any first_patient inputs in current row?
    var current_hour_cells = document.querySelectorAll('.cells_in_current_hour')

    // keep count of how many open 'first_patient' boxes there are
    lowest_first_pt_index = 100
    empty_first_pt_count = 0

    for (let i = 0; i < current_hour_cells.length; i++) {
        var cell = current_hour_cells[i];
        var childNodes = cell.childNodes;
      
        // Check if the first child node exists and has the class 'first_patient'
        if (childNodes.length > 0) {
            var firstChild = childNodes[0];
            
            if (firstChild.nodeType === 1 &&
                firstChild.classList.contains('first_patient') &&
                firstChild.value.length == 0) {
                
                // record count
                empty_first_pt_count += 1 

            }
        }
    }


    // otherwise calculate the next up doctor, ie 3 -> 4,  5 -> 1, etc.        
    current_number = Number(document.querySelectorAll('.next_up')[0].innerText);  // highlighted next up value within the who up row
    
    if (current_number == Math.max(...who_up_cell_values)) {
        next_number = 1
    }
    else {
        next_number = current_number + 1
    }
    
    // after all 'first_patient' boxes are filled, then advance back to the who_up #1 patient
    if (empty_first_pt_count == 1) {
        next_number = 1
    }

    // set patient into corresponding box (ASSIGN PATIENT)
    if (next_up_box) {next_up_box.value = pt}  
    else if (next_up_boxes.length == 0) {return}  // if no more open boxes, then don't allow it to advance doctor.
    else {};

    // advance to next doctor
    const textField_advance = document.querySelector('.advance_doc_input');
    textField_advance.value = next_number;

    advance_to_next_doc().then(() => {
        textField.value = ''; // Erase input text field
    
        // Finally, upload to firebase
        const hiddenButton = document.getElementById('upload_to_firebase_button');
        // Simulate a click on the hidden button
        hiddenButton.click();
    });


});


