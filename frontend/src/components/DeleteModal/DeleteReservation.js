import { useState } from "react"
import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"

import * as bookingActions from "../../store/bookings"
import "./DeleteModal.css"

export default function DeleteReservationModal({ reservation }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [errors, setErrors] = useState([])

    const handleDeleteConfirmation = () => {
        dispatch(bookingActions.deleteSpotBookingThunk(reservation.id))
            .then(closeModal)
            .catch(async (error) => {
                const data = await error.json()
                setErrors([data.message])
            })
    }

    return (
        <div className="delete_confirmation_modal">
            <h1 className="delete_confirmation_title">Confirm Cancellation</h1>
            <p className="delete_confirmation_info">Are you sure that you want to cancel this reservation?</p>
            {errors.map((error, idx) => {
                return (
                    <div key={idx}>{error}</div>
                )
            })}
            <button onClick={handleDeleteConfirmation} className="delete_confirmation_button">{"Yes (Cancel Reservation)"}</button>
            <button onClick={closeModal} className="delete_cancel_button">{"No (Keep Reservation)"}</button>
        </div>
    )

}
