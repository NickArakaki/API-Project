import { useState } from 'react';
import { DateRange } from 'react-date-range';
// import {} from "../../../utils/reservationUtils"

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

function ReservationForm() {

    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ])

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("this is the submit button working")
    }

    return (
        <form onSubmit={handleSubmit}>
            <DateRange
                onChange={item => setDateRange([item.selection])}
                editableDateInputs={true}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                months={2}
                direction="horizontal"
                className="booking-input"
            />
            <button type='submit'>Reserve</button>
        </form>
    )
}

export default ReservationForm;
