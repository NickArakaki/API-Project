import { useModal } from "../../context/Modal"
import { useDispatch } from "react-redux"

import * as bookingActions from "../../store/bookings"
import "./DeleteModal.css"

export default function DeleteReservationModal({ reservation }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDeleteConfirmation = () => {
        alert("functionality coming soon")
    }

    return (
        <div className="delete_confirmation_modal">
            <h1 className="delete_confirmation_title">Confirm Cancellation</h1>
            <p className="delete_confirmation_info">Are you sure that you want to cancel this reservation?</p>
            <button onClick={handleDeleteConfirmation} className="delete_confirmation_button">{"Yes (Cancel Reservation)"}</button>
            <button onClick={closeModal} className="delete_cancel_button">{"No (Keep Reservation)"}</button>
        </div>
    )

}
