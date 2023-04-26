import { useHistory } from "react-router-dom";
import OpenModalButton from "../../OpenModalButton"
import DeleteReservationModal from "../../DeleteModal/DeleteReservation";
import { formatDateYYYYMMDD } from "../../../utils/reservationUtils/dates";
import "./UserReservationSummary.css"

function UserReservationSummary({ reservation }) {
    const history = useHistory();
    const startDate = new Date(reservation.startDate)
    const endDate = new Date(reservation.endDate)
    const today = new Date();

    const handleClick = () => {
        history.push(`/spots/${reservation.Spot.id}`)
    }

    const handleEdit = () => {
        alert("Edit Feature Coming Soon")
    }

    const handleDelete = () => {
        alert("Delete Feature Coming Soon")
    }

    return (
        <>
        <div onClick={handleClick} className="reservation-summary-container">
            <div className="reservation-summary-image-container">
                <img className="reservation-summary-preview-image" src={reservation.Spot.previewImage}></img>
            </div>
            <div className="reservation-summary-spot-details">
                <div className="reservation-summary-spot-title">{reservation.Spot.name}</div>
                {/* <div className="reservation-summary-host"></div> */}
                <div className="reservation-summary-dates">{`${formatDateYYYYMMDD(startDate)} to ${formatDateYYYYMMDD(endDate)}`}</div>
            </div>
        </div>
        {startDate > today && (
            <div className="reservation-summary-buttons-div">
                <OpenModalButton
                    buttonText={"edit"}
                    modalComponent={<h1>Hello From Edit Reservation</h1>}
                />
                <OpenModalButton
                    buttonText={"delete"}
                    modalComponent={<DeleteReservationModal reservation={reservation} />}
                />
            </div>
        )}
        </>
    )
}

export default UserReservationSummary;
