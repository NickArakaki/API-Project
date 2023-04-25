import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getListOfBookedDates } from '../../../utils/reservationUtils/dates';
import * as bookingActions from "../../../store/bookings"
import { useParams } from 'react-router-dom';

import "react-dates/initialize"
import { DateRangePicker } from 'react-dates';
import "react-dates/lib/css/_datepicker.css"

import './ReservationForm.css'

function ReservationForm() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user)
    const calendarRef = useRef(null);
    const {spotId} = useParams()

    const bookings = useSelector(state => Object.values(state.bookings.spotBookings))
    const bookedDates = getListOfBookedDates(bookings)

    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [focusedInput, setFocusedInput] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();

        const newReservation = {
            startDate: startDate.format("YYYY-MM-DD"),
            endDate: endDate.format("YYYY-MM-DD")
        }

        console.log(newReservation)

        dispatch(bookingActions.postSpotBookingThunk(spotId, newReservation))
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
                onDatesChange={({ startDate, endDate }) => {
                    setStartDate(startDate)
                    setEndDate(endDate)
                }}
                focusedInput={focusedInput}
                onFocusChange={(focusedInput) => {
                    setFocusedInput(focusedInput)
                }}
            />
            <button type='submit'>Reserve</button>
        </form>
    )
}

export default ReservationForm;
