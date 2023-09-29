// adjust background color of the current hour to light blue
function highlight_row_for_current_hour() {

    // remove all cells from "cells_in_current_hour" class
    var cells_in_current_hour = document.querySelectorAll(".cells_in_current_hour");
    for (var i=0; i < cells_in_current_hour.length; i++) {
      cells_in_current_hour[i].classList.remove('cells_in_current_hour');
    }

    // add className to current hour --> css will highlight row
    var hours = new Date().getHours();
    var cellsInRow = document.querySelectorAll('.row' + hours + ' td');
    for (var i = 0; i < cellsInRow.length; i++) {
      cellsInRow[i].classList.add('cells_in_current_hour');
      }
      
}
