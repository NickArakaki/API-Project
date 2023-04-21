import { useState } from 'react';
import { useSelector } from 'react-redux';
import { DateRange } from 'react-date-range';
import {formatDateYYYYMMDD} from "../../../utils/dates"

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import './ReservationForm.css'

function ReservationForm() {
    const bookings = useSelector(state => Object.values(state.bookings.spotBookings))

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
                onChange={item => setDateRange([item.selection])}
                editableDateInputs={true}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                minDate={new Date()}
                months={2}
                direction="horizontal"
                className="reservation-form-date-input"
            />
            <button type='submit'>Reserve</button>
        </form>
    )
}

export default ReservationForm;
