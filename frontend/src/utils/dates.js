import { formatDate } from "./formatting";

export const formatDateYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return formatDate(year, month, day);
}
