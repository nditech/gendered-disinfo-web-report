'use strict';

// --- Datetime ---
export function getFormattedDateTime(extra_seconds) {

    // Get datetime now
    let today = new Date();

    // Format time
    let second = String((today.getSeconds() + extra_seconds) % 60);
    if(second.length !== 2){
        second = "0" + second;
    }

    let extra_minute = Math.floor((today.getSeconds() + extra_seconds)/60.0);
    let minute = String((today.getMinutes() + extra_minute) % 60);
    if(minute.length !== 2){
        minute = "0" + minute;
    }

    let extra_hour = Math.floor((today.getMinutes() + extra_minute)/60.0);
    let hour = String((today.getHours() + extra_hour) % 24);
    if(hour.length !== 2){
        hour = "0" + hour;
    }

    // Format date
    let extra_day = Math.floor((today.getHours() + extra_hour)/24.0);
    let day = String(today.getDate() + extra_day);
    if(day.length !== 2){
        day = "0" + day;
    }

    let month = String(today.getMonth() + 1);   // JavaScript months are 0-based.
    if(month.length !== 2){
        month = "0" + month;
    }

    let year = String(today.getFullYear());

    // Return full datetime
    return year + "-" + month + "-" + day + "_" + hour + ":" + minute + ":" + second;
}


export function date_to_month_year(date){

    // months
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    let month = monthNames[(date.getMonth() + 1) - 1];   // JavaScript months are 0-based.
    let year = String(date.getFullYear());

    return `${month}, ${year}`;
}
