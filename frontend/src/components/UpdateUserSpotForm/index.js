import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Redirect, useHistory, useParams } from "react-router-dom"

import { validateSpot } from "../../utils/validation";
import * as spotActions from "../../store/spots";

import "./UpdateUserSpotForm.css"

export default function UpdateUserSpotForm() {
    const history = useHistory();
    const { spotId } = useParams();
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();

    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [spotOwner, setSpotOwner] = useState(true); // initally set to true to prevent early redirect
    const [isLoaded, setIsLoaded] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [serverErrors, setServerErrors] = useState([]);

    // Populate the form with spot data
    useEffect(() => {
        dispatch(spotActions.getSingleSpotThunk(spotId))
            .then(spot => {
                // validate the session user is the spot owner
                if (sessionUser.id !== spot.ownerId) {
                    // set spot owner to false to redirect to landing page
                    setSpotOwner(false);
                } else {
                    // else popoulate the form with data
                    setCountry(spot.country);
                    setAddress(spot.address);
                    setCity(spot.city);
                    setState(spot.state);
                    setLatitude(spot.lat);
                    setLongitude(spot.lng);
                    setDescription(spot.description);
                    setName(spot.name);
                    setPrice(spot.price);
                    setIsLoaded(true)
                }
            })
    }, [dispatch])

    // redirect to landing page if not logged in or not spot owner
    if (!sessionUser || !spotOwner) return <Redirect to="/" />

    if (!isLoaded) return <h2>Loading...</h2>


    const handleSubmit = (e) => {
        e.preventDefault();
        // validate inputs
        const updatedSpot = {
            country,
            address,
            city,
            state,
            lat: Number(latitude),
            lng: Number(longitude),
            description,
            name,
            price
        }

        const errors = validateSpot(updatedSpot);

        if (!Object.values(errors).length) {
            // if there are no validation errors dispatch update thunk
            // redirect to updated spots detail page
            dispatch(spotActions.updateUserSpotThunk(spotId, updatedSpot))
                .then(() => history.push(`/spots/${spotId}`))
                .catch((errors) => {
                    console.log(errors);
                })

        } else {
            // else set validation errors
            setValidationErrors(errors)
        }
    }

    return (
        <form className="update_spot_form" onSubmit={handleSubmit}>
            <h2 className="update_spot_form_title">Update Your Spot</h2>
            {serverErrors.length > 0 && (
                <ul className="update_spot_server_errors_list">
                    {serverErrors.map(error => (
                        <li key={error} className="error">{error}</li>
                    ))}
                </ul>
            )}
            <div className="update_spot_form_location_div form_block">
                <h3>Where's your place located?</h3>
                <p>Guests will only get your exact address once they have booked a reservation.</p>
                <div>
                    Country: {validationErrors.country && <span className="error">{validationErrors.country}</span>}
                    <input
                        type="text"
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </div>
                <div>
                    Street Address: {validationErrors.address && <span className="error">{validationErrors.address}</span>}
                    <input
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <div>
                    City: {validationErrors.city && <span className="error">{validationErrors.city}</span>}
                    <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />,
                </div>
                <div>
                    State: {validationErrors.state && <span className="error">{validationErrors.state}</span>}
                    <input
                        type="text"
                        placeholder="STATE"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />
                </div>
                <div>
                    Latitude:
                    <input
                        type="text"
                        placeholder="Latitude"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                    />
                </div>
                <div>
                    Longitude
                    <input
                        type="text"
                        placeholder="Longitude"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                    />
                </div>
            </div>
            <div className="update_spot_form_description_div form_block">
                <h3>Describe your place to guests</h3>
                <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                <textarea
                    className="update_spot_form_description_textarea"
                    placeholder="Please write at least 30 characters"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                {validationErrors.description && <span className="error">{validationErrors.description}</span>}
            </div>
            <div className="update_spot_form_title_wrapper form_block">
                <h3>Create a tile for your spot</h3>
                <p>Catch guests' attention with a spot title that highlights what makes your place special</p>
                <input
                    type="text"
                    placeholder="Name of your spot"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            {validationErrors.title && <span className="error">{validationErrors.title}</span>}
            <div className="update_spot_form_price_wrapper form_block">
                <h3>Set a base price for your spot</h3>
                <p>Competitive pricing can help your listing stand out and rank higher ins search results</p>
                $ <input
                    type="number"
                    placeholder="Price per night (USD)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                {validationErrors.price && <span className="error">{validationErrors.price}</span>}
            </div>
            <button className="update_spot_form_submit_button button" type="submit">Update Spot</button>
        </form>
    )
}
