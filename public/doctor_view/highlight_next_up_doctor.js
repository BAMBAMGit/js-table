// this function takes the imported data from firebase (result), finds the proper next up doctor's element and assigns the next up class to that element

function highlight_next_up_doctor_cell (result) {

    // id of cell that's highlighted with the next up doctor
    next_up_id_realtime_ = result['next_up_data']

    // Remove 'next_up' class from all cells with class 'next_up'
    const cellsWithNextUpClass = document.querySelectorAll('.next_up');
    cellsWithNextUpClass.forEach(cell => {
        cell.classList.remove('next_up');
    });

    // Assign 'next_up' class to the specific cell with ID 'next_up_id_realtime_'
    const specificCell = document.getElementById(next_up_id_realtime_);
    if (specificCell) {
        specificCell.classList.add('next_up');
    }

}