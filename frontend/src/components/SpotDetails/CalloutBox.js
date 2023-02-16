import ReviewsSummary from "./ReviewsSummary"

export default function CalloutBox({ spot }) {
    return (
        <>
            <div className="callout_box_price_reviews">
                <div className="spot_details_callout_info_box_price">${spot.price} night</div>
                <div className="callout_box_reviews">
                    <ReviewsSummary spot={ spot } />
                </div>
            </div>
            <button onClick={() => alert("Feature coming soon")} className="spot_details_callout_info_box_register_button button">Reserve</button>
        </>
    )
}
