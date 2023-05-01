import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useModal } from '../../../context/Modal';

// Redux Store Booking Thunks
import * as bookingActions from "../../../store/bookings"

// React-Dates Required Files
import "react-dates/initialize"
import { DateRangePicker } from 'react-dates';
import "react-dates/lib/css/_datepicker.css"

// Custom Helper Functions For React-Dates
import {
    checkIfOutOfRange,
    findFirstValidDate,
    findMaxEndDate,
    findMinStartDate,
    sortBookingsByStart,
    isValidDay
} from '../../../utils/reservationUtils/dates';

// Custom CSS File to Overwrite React-Dates CSS file and apply custom styling
import './ReservationForm.css'


function ReservationForm({ spot, reservation }) {
    //TODO: if there is a reservation passed, we need to exclude that reservation from the sorted booked list
    //      when the form is submitted and there is a reservation passed to this component we need to pass the updated
    //      reservation instead of newReservation to the thunk
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();
    const sessionUser = useSelector(state => state.session.user)
    const bookings = useSelector(state => state.bookings.spotBookings)

    if (reservation?.id in bookings) {
        delete bookings[reservation.id]
    }

    const bookedDates = Object.values(bookings).map(booking => [booking.startDate, booking.endDate])

    const sortedBookedDates = sortBookingsByStart(bookedDates);
    const firstValidDate = findFirstValidDate(sortedBookedDates)

    const [errors, setErrors] = useState([])
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

        if (!sessionUser) {
            setErrors(["Please login to make a reservation"])
        }

        if (spot.Onwer.id === sessionUser.id) {
            setErrors(["You are not allowed to reserve your own listing"])
        }

        if (!startDate || !endDate) {
            setErrors(["please select a valid start and/or end date"])
        } else if (reservation) {
            reservation.startDate = startDate.format("YYYY-MM-DD");
            reservation.endDate = endDate.format("YYYY-MM-DD");
            dispatch(bookingActions.updateSpotBookingThunk(reservation))
                .then(() => closeModal())
                .catch(async (error) => {
                    const data = await error.json();
                    setErrors([data.message])
                })
        } else {
            const newReservation = {
                startDate: startDate.format("YYYY-MM-DD"),
                endDate: endDate.format("YYYY-MM-DD")
            }

            dispatch(bookingActions.postSpotBookingThunk(spot.id, newReservation))
                .then(() => {
                    history.push("/mytrips")
                })
                .catch(async (error) => {
                    const data = await error.json();
                    setErrors([data.message]);
                })
        }

    }

    // const isSubmitDisabled = (!sessionUser || spot.Owner.id === sessionUser.id);

    return (
        <form className='reservation-form' onSubmit={handleSubmit}>
            {errors.map((error, idx) => (
                <div className='reservation-form-error' key={idx}>{error}</div>
            ))}
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
            <button className='submit_button' type='submit'>Reserve</button>
        </form>
    )
}

export default ReservationForm;
