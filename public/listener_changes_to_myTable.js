import { upload_to_firebase_function } from './upload_to_firebase.js';

// Listen to all changes in myTable values then upload to firebase. This is for direct user input changes.

    // need to wait an until input value changed until uploading to firebase. maybe try to fix this with a promise later? Nah --> it's pretty much an instant wait so promise isn't necessary. 
    
        const targetElementId = 'myTable';
        const targetElement = document.getElementById(targetElementId);

        if (targetElement) {
            targetElement.addEventListener('input' || 'td', function(event) {
                console.log('Input value changed:', event.target.value || event.target.textContent);
                
                // // Handle the input value change here
                // // Finally, upload to firebase
                // const hiddenButton = document.getElementById('upload_to_firebase_button');
                // // Simulate a click on the hidden button
                // hiddenButton.click();

                // update next_up_data placeholder (for synchronization with firebase). Need to add this so the next_up_div data-info isn't set to 'blank initialization data' which is what it is set to when the table is first constructed. Otherwise, if a text box is edited before the data-info is updated by setting a patient with the button, then it will lose the next up doc class.
                const next_upp_cell = document.getElementsByClassName('next_up')
                const nextUpCellId = next_upp_cell[0].id
                const next_up_div = document.getElementById('next_up_data')
                next_up_div.setAttribute('data-info', nextUpCellId)

                upload_to_firebase_function()

            });
        } else {
            console.log(`#${targetElementId} not found in the DOM.`);
        }
    
