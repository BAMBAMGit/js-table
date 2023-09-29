// <!-- Create table rows -->
// <!-- Use nested loop to create x rows and y columns -->
// <!-- Use "contenteditable" attribute to make cells editable -->
// <!-- Use "oninput" attribute to bind a function to cell input event -->
// <!-- The function will update the cell data in an array -->
// <!-- The array can be used to retrieve and manipulate the table data -->

// add unique IDs to each item. this will help when exporting and importing table data.

function construct_table(){
    delete_data()  // delete existing table so new one can be constructed

    // Create a new div element for data storage for NEXT UP
    var next_up_div = document.createElement('div');
    next_up_div.id = 'next_up_data'
    document.body.appendChild(next_up_div);  // Append the new div to the body
    console.log('div created', next_up_div)

    // create rows
    fetch("table.json")
      .then(response => response.json())
      .then(data => {
        const table = document.getElementById("myTable");

        // add shift_names row
        var row = document.createElement("tr");  // new row
        row.className = 'shift_names_row';
        for (let i = 0; i < data.cols; i++) {
          const cell = document.createElement('td');
          cell.innerText = data.shift_names[i];
          cell.id = row.className + i  // add unique id for each DOM element
          row.appendChild(cell);
        }
        table.appendChild(row)

        // add doctor_names row
        var row = document.createElement("tr");  // new row
        row.className = 'doctor_names_row';
        for (var i = 0; i < data.cols; i++) {
          if (i==0) {
            var cell = document.createElement('td');
            // make first cell background color match
            if (i==0) {cell.classList.add('hour_col')}
            row.appendChild(cell);
            continue
          }

          var cell = document.createElement('td');
          const dropdown = document.createElement('select');
          dropdown.classList.add('header-dropdown');
          dropdown.disabled = true;
          cell.appendChild(dropdown)
          cell.id = row.className + i  // add unique id for each DOM element
          dropdown.id = dropdown.className + i  // add unique id for each DOM element
          row.appendChild(cell);
          
          // add each name to the dropdown menu
          options = data.doctor_names
          options.forEach((option) => {
            const option_elem = document.createElement('option');
            option_elem.text = option;
            dropdown.add(option_elem);
          });

        }

        table.appendChild(row)


        // add who_up row
        var row = document.createElement("tr");  // new row
        row.className = 'doctor_order_row';
        for (let i = 0; i < data.cols; i++) {
          const cell = document.createElement('td');
          cell.classList.add('who_up_row');
          cell.contentEditable = false;
          
          cell.id = row.className + i  // add unique id for each DOM element
          
          // Create a new span element
          const newSpan = document.createElement('span');
          newSpan.textContent = '';
          cell.appendChild(newSpan);  // Append the span to the cell
    
          if (i==0) {
            cell.classList.add('hour_col');
          }

          row.appendChild(cell);
        }
        table.appendChild(row)

        // Create table rows and cells based on JSON data
        for (let i = 0; i < data.rows; i++) {

          // new row
          const row = document.createElement("tr");
          // add class to each row --> helps with highlighting a row for each hour
          row.classList.add('row' + data.hour_list[i])

          for (let j = 0; j < data.cols; j++) {
            // create cell
            const cell = document.createElement("td");
            cell.contentEditable = false
            cell.id = row.className + 'cell' + j  // add unique id for each DOM element

            // Create a new span element (container) so we can edit the cell's textContent without affecting its children
            const newSpan = document.createElement('span');
            newSpan.textContent = '';

            // Append the span to the cell
            cell.appendChild(newSpan);

            // label cell with class to assign background color within css
            cell.classList.add(data.cells_backgrounds[i][j]);
            
            // add hour to first column
            if (j == 0) {
              cell.innerText = data.hour_list[i];
              cell.classList.add('hour_col');
              cell.contentEditable = false;
            };
            row.appendChild(cell); // Add index cell to row, this is the hour column

            // Create textboxes inside the cell based on JSON data
            for (let k = 0; k < data.cells[i][j]; k++) {
              const box = document.createElement("input");
              box.type = "text";
              box.id = cell.id + 'box' + k  // add unique id for each DOM element
              box.readOnly  = true;
              
              // assign custom background color to first patient of the shift
              if (k ==0 & data.first_patient[i][j] == 1) {
                box.classList.add('first_patient');
              }

              // box.value = Math.floor(Math.random() * 100); // Fill cell with random number
              box.classList.add('input_box');
              cell.appendChild(box);
            }

            row.appendChild(cell);
          }
          table.appendChild(row);
        }

      })
      .then( () => {
        // console.log('HERE is where i HIGHLIGHT')
        highlight_row_for_current_hour()
      })
      .catch(error => console.error("Error fetching JSON data:", error));
  }


  function delete_data(){  // this fxn is needed to delete the table before it's updated or constructed so it doesn't append repeatedly
    // delete headers
    var table = document.getElementById("myTable");
    table.deleteTHead()
    var header = table.createTHead()  // make header
    var row = header.insertRow(0)  // make row in the header, names go here
    var cell = row.insertCell(0)
    cell.innerHTML = "<b> </b>";

    var rowCount = table.rows.length;
    for (var i = rowCount - 1; i > 0; i--) {
        table.deleteRow(i);
    }
  }