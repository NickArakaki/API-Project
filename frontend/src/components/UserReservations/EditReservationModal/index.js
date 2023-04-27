import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import ReservationForm from "../../SpotDetails/ReservationForm"
import * as spotActions from "../../../store/spots"
import * as bookingActions from "../../../store/bookings"
import "./EditReservationModal.css"
import { useEffect } from "react"

function EditReservationModal({ reservation }) {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const spotDetails = useSelector(state => state.spots.singleSpot)
    const spotBookings = useSelector(state => Object.values(state.bookings.spotBookings))

    useEffect(() => {
        dispatch(spotActions.getSingleSpotThunk(reservation.spotId))
            .then(() => setIsLoaded(true))
    }, [])

    if (!isLoaded) return <div>Loading...</div>

    return (
        <>
            <div>Hello from edit reservation modal</div>

            <ReservationForm spot={spotDetails}/>
        </>
    )
}

export default EditReservationModal;
