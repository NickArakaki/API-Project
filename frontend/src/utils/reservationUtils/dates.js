import { formatDateYYYYMMDD } from "../dates";

// takes in a list objects
// each object contains a startDate and an endDate string 'yyyy-mm-dd'
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
    // if startDate is after today get list of date objects between start and end dates (inclusive)
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
