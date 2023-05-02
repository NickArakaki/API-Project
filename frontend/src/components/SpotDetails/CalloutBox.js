// import AddBookingModal from "../Bookings/AddBookingModal"
// import OpenModalButton from "../OpenModalButton"
import ReviewsSummary from "./ReviewsSummary"
import ReservationForm from "./ReservationForm"
// import { useSelector } from "react-redux"

export default function CalloutBox({ spot }) {
    // const sessionUser = useSelector(state => state.session.user)
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
            <ReservationForm spot={spot} />
        </>
    )
}
