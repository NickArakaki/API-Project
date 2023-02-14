import { Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import UserSpotTiles from './UserSpotTiles';
import "./UserSpots.css"

export default function UserSpots() {
    const history = useHistory();
    const sessionUser = useSelector((state) => state.session.user);

    if (!sessionUser) history.push('/');

    return (
        <div className="manage_spots_title">
            <h1>Manage Your Spots</h1>
            <Link to="/spots/add" >
                <button className='manage_spots_create_new_spot_button button'>Create a New Spot</button>
            </Link>
            <div className='manage_spots_spot_tiles_div'>
                <UserSpotTiles user={sessionUser} />
            </div>
        </div>
    )
}
