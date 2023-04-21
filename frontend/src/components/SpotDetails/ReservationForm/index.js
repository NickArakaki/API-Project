import { useState } from 'react';
import { useSelector } from 'react-redux';
import { DateRange } from 'react-date-range';
import {formatDateYYYYMMDD} from "../../../utils/dates"
import { getListOfBookedDates } from '../../../utils/reservationUtils/dates';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import './ReservationForm.css'

function ReservationForm() {
    const bookings = useSelector(state => Object.values(state.bookings.spotBookings))
    const bookedDates = getListOfBookedDates(bookings)

    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ])

    const handleSubmit = (e) => {
        e.preventDefault();

        // validate the form data
        const newReservation = {
            startDate: formatDateYYYYMMDD(dateRange[0].startDate),
            endDate: formatDateYYYYMMDD(dateRange[0].endDate)
        }

        console.log(newReservation)
        alert("this is the submit button working")
    }

    return (
        <form onSubmit={handleSubmit}>
            <DateRange
                className="reservation-form-date-input"
                onChange={item => setDateRange([item.selection])}
                ranges={dateRange}
                months={2}
                minDate={new Date()}
                editableDateInputs={true}
                moveRangeOnFirstSelection={false}
                direction="horizontal"
                disabledDates={bookedDates}
            />
            <button type='submit'>Reserve</button>
        </form>
    )
}

export default ReservationForm;
