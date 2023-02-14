import { useHistory } from "react-router-dom";

export default function SpotTile({ spot }) {
    const history = useHistory();

    const handleClick = () => {
        history.push(`/spots/${spot.id}`);
    }

    return (
        <div onClick={handleClick} className="spot_tile">
            <img className="spot_tile_img" src={spot.previewImage} alt={`${spot.name} preview image`}/>
            <h3 className="spot_tile_spot_name">{spot.name}</h3>
            <div className="spot_tile_avg_stars"><i className="fa-solid fa-star" /> {spot.avgRating}</div>
            <div className="spot_tile_price">${spot.price} night</div>
        </div>
    )
}
