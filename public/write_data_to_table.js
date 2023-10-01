function write_data_to_table_function (result) {

    // write result to table
    for (const key in result) {

        if (result.hasOwnProperty(key)) {

            // get value
            const value_ = result[key];
            
            // get element from doctor_view.html DOM
            const element_ = document.getElementById(key);
            
            try {

                // assign value or textContent depending on if it's an input or cell. First check to see if it's an input box.
                if (element_ instanceof HTMLInputElement) {  // is it an input box?
                    // only update the current value if different from the new value
                    if (element_.value !== value_) { 
                        // add value to input box
                        element_.value = value_;
                    }

                }

                else if (element_ instanceof HTMLSelectElement){

                    // only update the current value if different from the new value
                    if (element_.value != value_) {
                        element_.value = value_;
                    }
                }

                else if (element_ instanceof HTMLTableCellElement){

                    // Get the parent node of 'element_'
                    const parent = element_.parentNode;

                    // Check if the parent node has the class 'doctor_names_row' or 'shift_names_row', if so, skip them
                    if (parent.classList.contains('doctor_names_row')) {
                        // Parent has the class 'doctor_names_row'
                        // console.log('Parent has class "doctor_names_row"');
                    } else if (parent.classList.contains('shift_names_row')) {
                        // Parent has the class 'shift_names_row'
                        // console.log('Parent has class "shift_names_row"');
                    } 
                    
                    // if not class 'doctor_names_row' or 'shift_names_row', then update text node accordingly...
                    else {

                        // count number of text nodes, if zero, then we'll need to make one and assign textContent to value_
                        let textNodeCount = 0;
                        for (let i = 0; i < element_.childNodes.length; i++) {
                            const childNode = element_.childNodes[i];

                            // Check if the childNode is a text node (nodeType 3 represents text nodes)
                            if (childNode.nodeType === Node.TEXT_NODE) {
                                textNodeCount++;
                            }
                        }

                        // if no text nodes exist, we'll make one and assign value_ to textContent. this represents the cells from firebase that are new and updating the client side table
                        if (textNodeCount == 0) {
                            // Create a new text node with the textContent set to "value_"
                            const newText = document.createTextNode(value_);

                            // Append the new text node to the element_
                            element_.appendChild(newText);
                        }

                        // otherwise merge all text nodes and assign value_ to its textContent. this step is needed to prevent duplicates, as when you free type into a cell, it automatically creates a new text node. you don't want to have multiple text nodes because then weird stuff happens.
                        else {

                            // Create a new text node to store the merged content
                            const mergedTextNode = document.createTextNode('');

                            // Iterate through the child nodes of 'element_'
                            for (let i = 0; i < element_.childNodes.length; i++) {
                                const childNode = element_.childNodes[i];

                                // Check if it's a text node
                                if (childNode.nodeType === Node.TEXT_NODE) {
                                    // Concatenate the text content to the merged text node
                                    mergedTextNode.textContent += childNode.textContent;
                                    
                                    // Remove the current text node
                                    element_.removeChild(childNode);
                                    i--; // Decrement i to account for the removed node
                                }
                            }

                            // assign value_ to the merged text node
                            mergedTextNode.textContent = value_

                            // Append the merged text node back to 'element_'
                            element_.appendChild(mergedTextNode);

                        }
                    }

                }

            }

            catch (error) {
                console.error("An error occurred:", error);
            }

        
        }
    }    

}