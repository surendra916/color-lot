module.exports = function convertMS(milliseconds) {
    var day, hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
        day: day,
        hour: hour,
        minute: minute,
        seconds: seconds
    };
}

//var years = days/365
//convertMS(new Date().getTime())

var d = new Date(new Date().getTime());

d.toLocaleString()     // 7/25/2016, 1:35:07 PM
d.toLocaleDateString() // 7/25/2016
d.toDateString()       // Mon Jul 25 2016
d.toTimeString()       // 13:35:07 GMT+0530 (India Standard Time)
d.toLocaleTimeString() // 1:35:07 PM
d.toISOString();       // 2016-07-25T08:05:07.836Z
d.toJSON();            // 2016-07-25T08:05:07.836Z
d.toString();          // Mon Jul 25 2016 13:35:07 GMT+0530 (India Standard Time)
d.toUTCString();       // Mon, 25 Jul 2016 08:05:07 GMT