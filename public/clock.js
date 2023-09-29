
// Display the current hour
var date = new Date();
var hour = date.getHours();
document.getElementById("clock").innerHTML = "Current time: ";

// Update the digital clock every second
setInterval(updateClock, 1000);

function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();

    // Format the time in HH:MM:SS format
    var timeString = hours.toString().padStart(2, '0') + ':'
                    + minutes.toString().padStart(2, '0') + ':'
                    + seconds.toString().padStart(2, '0');

    // Update the clock display
    document.getElementById("clock").innerHTML = "Current time: " + timeString;
}
