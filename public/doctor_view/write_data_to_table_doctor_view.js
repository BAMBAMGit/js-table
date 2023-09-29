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
                
                    // add value to input box
                    element_.value = value_;
            
                }

                else if (element_ instanceof HTMLSelectElement){

                    // create new option for select element
                    const newOption = document.createElement('option');
                    newOption.value = value_;
                    newOption.innerHTML = value_;
                
                    // Append the new option to the select element
                    element_.appendChild(newOption);

                    if (element_.value != value_) {
                        element_.value = value_;
                    }
                }

                else if (element_ instanceof HTMLTableCellElement){

                    const spanInCell = element_.querySelector('span');

                    if (spanInCell) {
                            spanInCell.textContent = value_;
                    }

                }

            }

            catch (error) {
                console.error("An error occurred:", error);
            }

        
        }
    }

}