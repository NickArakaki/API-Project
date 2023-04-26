import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    checkIfOutOfRange,
    findFirstValidDate,
    findMaxEndDate,
    findMinStartDate,
    sortBookingsByStart
} from '../../../utils/reservationUtils/dates';
import { isValidDay } from '../../../utils/reservationUtils/dates';
import * as bookingActions from "../../../store/bookings"
import { useHistory, useParams } from 'react-router-dom';

import "react-dates/initialize"
import { DateRangePicker } from 'react-dates';
import "react-dates/lib/css/_datepicker.css"

import './ReservationForm.css'
import moment from 'moment';

// TODO: find first available date with appropriate range
//       sort reservations by start date

function ReservationForm({ spot }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user)
    const {spotId} = useParams()
    const bookings = useSelector(state => Object.values(state.bookings.spotBookings))

    const bookedDates = bookings.map(booking => {
        return [booking.startDate, booking.endDate]
        }
    )

    const sortedBookedDates = sortBookingsByStart(bookedDates);

    const firstValidDate = findFirstValidDate(sortedBookedDates)

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [minDate, setMinDate] = useState(null);
    const [maxDate, setMaxDate] = useState(null);
    const [focusedInput, setFocusedInput] = useState();

    useEffect(() => {
        const maxEndDate = findMaxEndDate(startDate, sortedBookedDates);
        const minStartDate = findMinStartDate(startDate, sortedBookedDates);
        setMaxDate(maxEndDate)
        setMinDate(minStartDate)
    }, [startDate])

    useEffect(() => {
        const minStartDate = findMinStartDate(endDate, sortedBookedDates);
        const maxEndDate = findMaxEndDate(endDate, sortedBookedDates)
        setMinDate(minStartDate);
        setMaxDate(maxEndDate)
    }, [endDate])

    useEffect(() => {
        setMinDate(firstValidDate)
    }, [])

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
                .then(() => {
                    history.push("/mytrips")
                })
        }

    }

    return (
        <form className='reservation-form' onSubmit={handleSubmit}>
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
                isOutsideRange={(day) => checkIfOutOfRange(day, minDate, maxDate)}
            />
            <button disabled={spot.Owner.id === sessionUser?.id} type='submit'>Reserve</button>
        </form>
    )
}

export default ReservationForm;
