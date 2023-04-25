import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkIfOutOfRange, findMaxEndDate, getListOfBookedDates, sortBookingsByStart } from '../../../utils/reservationUtils/dates';
import { isValidDay } from '../../../utils/reservationUtils/dates';
import * as bookingActions from "../../../store/bookings"
import { useParams } from 'react-router-dom';

import "react-dates/initialize"
import { DateRangePicker } from 'react-dates';
import "react-dates/lib/css/_datepicker.css"

import './ReservationForm.css'
import moment from 'moment';

// TODO: find first available date with appropriate range
//       sort reservations by start date

function ReservationForm() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user)
    const {spotId} = useParams()

    const bookings = useSelector(state => Object.values(state.bookings.spotBookings))

    const bookedDates = bookings.map(booking => {
        return [booking.startDate, booking.endDate]
        }
    )

    const sortedBookedDates = sortBookingsByStart(bookedDates);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    // const [minDate, setMinDate] = useState(null);
    const [maxDate, setMaxDate] = useState(null);
    const [focusedInput, setFocusedInput] = useState();

    useEffect(() => {
        const maxEndDate = findMaxEndDate(startDate, sortedBookedDates);
        console.log(maxEndDate)
        setMaxDate(maxEndDate)
    }, [startDate])

    // const handleDateChange = ({ newStartDate, newEndDate }) => {
    //     setStartDate(newStartDate);
    //     setEndDate(newEndDate);
    // }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            alert("please select a valid start and/or end date")
        } else {
            const newReservation = {
                startDate: startDate.format("YYYY-MM-DD"),
                endDate: endDate.format("YYYY-MM-DD")
            }

            dispatch(bookingActions.postSpotBookingThunk(spotId, newReservation))
        }

    }

    return (
        <form className='reservation-form' onSubmit={handleSubmit}>
            <div className='date-container'>
            </div>
            <DateRangePicker
                minimumNights={1}
                showClearDates={true}
                startDate={startDate}
                startDateId='start-date-id'
                endDate={endDate}
                endDateId='end-date-id'
                onDatesChange={({startDate, endDate}) => {
                    setStartDate(startDate);
                    setEndDate(endDate);
                }}
                focusedInput={focusedInput}
                onFocusChange={(focusedInput) => {
                    setFocusedInput(focusedInput)
                }}
                isDayBlocked={(day) => isValidDay(day, bookedDates)}
                isOutsideRange={(day) => checkIfOutOfRange(day, startDate, maxDate)}
            />
            <button type='submit'>Reserve</button>
        </form>
    )
}

export default ReservationForm;
