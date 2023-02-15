export default function SpotTile({ spot }) {
    return (
        <div className="spot_tile">
            <img className="spot_tile_img" src={spot.previewImage} alt={`${spot.name} preview image`}/>
            <div className="spot_tile_details_div">
                <div className="spot_tile_location_and_price_div">
                    <div className="spot_tile_spot_location">{spot.city}, {spot.state}</div>
                    <div className="spot_tile_price">${spot.price} night</div>
                </div>
                <div className="spot_tile_avg_stars"><i className="fa-solid fa-star" /> {spot.avgRating ? Number(spot.avgRating).toFixed(1) : "new"}</div>
            </div>
        </div>
    )
}
