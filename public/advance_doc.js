// text field and button to assign 'next_up' class to doctor in the who_up order

// Get the table element
const table = document.getElementById('myTable');
// Get the button element
const button = document.getElementById('advance_doc');

// Attach a click event listener to the button
button.addEventListener('click', promise_function_for_advance_to_next_doc);

// need this promis function so that when the advance button is clicked, it waits long enough to get updates before uploading to firebase 
function promise_function_for_advance_to_next_doc() {
    advance_to_next_doc().then(()=>{
        // Finally, upload to firebase
        const hiddenButton = document.getElementById('upload_to_firebase_button');
        // Simulate a click on the hidden button
        hiddenButton.click();
    })
}

function advance_to_next_doc() {

    return new Promise(resolve => {
        // Your code for advance_to_next_doc
        // ...


        // Get the text field element
        const textField = document.querySelector('.advance_doc_input');

        // Get the value of the text field
        var next_doc = textField.value;
        
        // get row with doctor order
        const who_up_row = document.querySelectorAll('.who_up_row');

        // Iterate the who_up_row and find the matching index of next_doc
        for (let i = 0; i < who_up_row.length; i++) {

            if (next_doc == '') {break}

            if (who_up_row[i].innerText == next_doc) {

                // erase class name 'next_up' of old box
                const next_up_cells = document.querySelector('.next_up')
                
                if (next_up_cells) {  // need to add condition so it doesn't break if there are no next_up cells
                    next_up_cells.classList.remove('next_up');
                }

                // add class name 'next_up' to the newly selected box
                who_up_row[i].classList.add('next_up');

                // update next_up_data placeholder (for synchronization with firebase)
                const next_upp_cell = document.getElementsByClassName('next_up')
                const nextUpCellId = next_upp_cell[0].id
                const next_up_div = document.getElementById('next_up_data')
                next_up_div.setAttribute('data-info', nextUpCellId)

                // erase the value of input text box if doctor advances
                document.querySelector('.advance_doc_input').value = '';
                

            }
            else {}
        }



        resolve();
    });


}
