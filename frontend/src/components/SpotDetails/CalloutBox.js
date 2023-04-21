// import AddBookingModal from "../Bookings/AddBookingModal"
// import OpenModalButton from "../OpenModalButton"
import ReviewsSummary from "./ReviewsSummary"
import ReservationForm from "./ReservationForm"

export default function CalloutBox({ spot }) {
    return (
        <>
            <div className="callout_box_price_reviews">
                <div className="spot_details_callout_info_box_price">
                    ${Number(spot.price).toFixed(2)} <span className="spot_details_callout_info_box_night">night</span>
                </div>
                <div className="callout_box_reviews">
                    <ReviewsSummary spot={ spot } />
                </div>
            </div>
            <ReservationForm />
        </>
    )
}
