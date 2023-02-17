import { Link } from "react-router-dom";

import OpenModalButton from "../OpenModalButton"
import DeleteSpotModal from "../DeleteSpotModal";

export default function UserSpotTile({ spot }) {
    return (
        <>
            <Link to={`/spots/${spot.id}`}>
                <img className="spot_tile_img" src={spot.previewImage} alt={`${spot.name} preview image`}/>
                <div className="spot_name_star_review_div">
                    <div className="spot_tile_details_div">
                        <div className="spot_tile_location_and_price_div">
                            <div className="spot_tile_location_div">
                                <div className="spot_tile_spot_name spot_tile_info">{spot.name}</div>
                            </div>
                            <br />
                        </div>
                    </div>
                    <div className="spot_tile_avg_stars spot_tile_info">
                        <i className="fa-solid fa-star" /> {spot.avgRating ? Number(spot.avgRating).toFixed(1) : "New"}
                    </div>
                </div>
            </Link>
            <div className="user_spot_tile_reviews_management_div">
                <div className="spot_tile_price spot_tile_info">${Number(spot.price).toFixed(2)} night</div>
                <div className="user_spot_tile_management_div">
                    <div className="manage_user_spot_button_container">
                        <Link to={`/myspots/${spot.id}/edit`}>
                            <button className="user_spot_tile_update_button">Update</button>
                        </Link>
                    </div>
                    <div className="manage_user_spot_button_container">
                        <OpenModalButton
                            modalComponent={<DeleteSpotModal spot={spot} />}
                            buttonText="Delete"
                            />
                    </div>
                </div>
            </div>
        </>
    )
}
