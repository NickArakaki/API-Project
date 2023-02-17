export const formatDate = (year, month, day) => {
    year = year.toString();
    if (month < 10) month = "0" + month.toString();
    if (day < 10) day = "0" + day.toString();

    return `${year}-${month}-${day}`
}
