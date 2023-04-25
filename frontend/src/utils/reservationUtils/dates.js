// takes in a list objects
// each object contains a startDate and an endDate string 'yyyy-mm-dd'

import moment from "moment";

// returns a list of date objects within each date range for dates on/after today
export const getListOfBookedDates = (dateRanges) => {
    const bookedDates = []
    const today = new Date(formatDateYYYYMMDD(new Date()));

    // iterate over list of dateRanges
    dateRanges.forEach(dateRange => {
        if (new Date(dateRange.endDate) >= today) { // if end date is today or in the future
            const dateList = getListOfDates(dateRange.startDate, dateRange.endDate)
            bookedDates.push(...dateList)
        }
    })
    // return list of booked dates
    return bookedDates;
}

// takes in a start date and end date strings "yyyy-mm-dd"
// returns a list of date objects from start date to end date (inclusive)
// can assume endDate is after startDate
export const getListOfDates = (start, end) => {
    const dateList = []

    const startDate = new Date(start)
    const endDate = new Date(end)

    for (const date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        dateList.push(new Date(date))
    }

    return dateList;
}

// formatDateYYYYMMDD
export const formatDateYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return formatDate(year, month, day);
}


export const formatDate = (year, month, day) => {
    year = year.toString();
    if (month < 10) month = "0" + month.toString();
    if (day < 10) day = "0" + day.toString();

    return `${year}-${month}-${day}`
}


// Input: 2D array, each element is a [ [startDate, endDate], ...]
// Output: boolean indicating if inputDate is in one of the ranges
export const isValidDay = (inputDate, bookedDateRanges) => {
    let isNotValid = false

    for (const bookedDateRange of bookedDateRanges) {
        if (inputDate.isBetween(bookedDateRange[0], bookedDateRange[1])) {
            isNotValid=true;
            break
        }
    }

    return isNotValid;
}
