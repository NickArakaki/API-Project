import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {formatDateYYYYMMDD} from "../../../utils/dates"
import { getListOfBookedDates } from '../../../utils/reservationUtils/dates';
import * as bookingActions from "../../../store/bookings"
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import './ReservationForm.css'
import { useParams } from 'react-router-dom';

import "react-dates/initialize";
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";

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
    }

    return (
        <form className='reservation-form' onSubmit={handleSubmit}>
            <div className='date-container'>
            </div>
            <DateRangePicker
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
            <button disabled={true} type='submit'>Reserve</button>
        </form>
    )
}

export default ReservationForm;
