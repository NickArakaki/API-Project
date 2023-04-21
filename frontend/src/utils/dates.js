import { formatDate } from "./formatting";

export const formatDateYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    return formatDate(year, month, day);
}
