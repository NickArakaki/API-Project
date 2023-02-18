import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Redirect, useHistory, useParams } from "react-router-dom"

import { validateSpot } from "../../utils/validation";
import * as spotActions from "../../store/spots";

import "./SpotForm.css"

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
    }, [dispatch, sessionUser, spotId])

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
                .catch(async res => {
                    const data = await res.json();
                    if (data && Object.values(data.errors).length > 0) {
                        setServerErrors(Object.values(data.errors));
                    }
                })

        } else {
            // else set validation errors
            setValidationErrors(errors)
        }
    }

    return (
        <form className="spot_form" onSubmit={handleSubmit}>
            <h2 className="spot_form_title">Create a New Spot</h2>
            {serverErrors.length > 0 && (
                <ul className="spot_form_server_errors_list">
                    {serverErrors.map(error => (
                        <li key={error} className="spot_error spot_server_error">{error}</li>
                    ))}
                </ul>
            )}
            <div className="spot_form_location_div spot_form_block">
                <div className="spot_form_block_heading">Where's your place located?</div>
                <p className="spot_form_prompt">Guests will only get your exact address once they have booked a reservation.</p>
                <div className="spot_form_location_inputs_div">
                    <div className="spot_form_input_div">
                        <div className="spot_form_input_title">
                            Country: {validationErrors.country && <span className="spot_error">{validationErrors.country}</span>}
                        </div>
                        <input
                            className="spot_form_input"
                            type="text"
                            placeholder="Country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </div>
                    <div className="spot_form_input_div">
                        <div className="spot_form_input_title">
                            Street Address: {validationErrors.address && <span className="spot_error">{validationErrors.address}</span>}
                        </div>
                        <input
                            className="spot_form_input"
                            type="text"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="spot_form_input_div">
                        <div className="spot_form_city_state_div">
                            <div className="spot_form_city_input_div">
                                <div className="spot_form_input_title">
                                    City: {validationErrors.city && <span className="spot_error">{validationErrors.city}</span>}
                                </div>
                                <input
                                    className="add_spot_form_input"
                                    type="text"
                                    placeholder="City"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    />
                            </div>
                            <div className="spot_form_state_input_div">
                                <div className="spot_form_input_title">
                                    State: {validationErrors.state && <span className="spot_error">{validationErrors.state}</span>}
                                </div>
                                <input
                                    className="add_spot_form_input"
                                    type="text"
                                    placeholder="STATE"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    />
                            </div>
                        </div>
                    </div >
                    <div className="spot_form_input_div">
                        <div className="spot_form_lat_lng_div">
                            <div className="spot_form_lat_input_div">
                                <div className="spot_form_input_title">
                                    Latitude:
                                </div>
                                <input
                                    className="add_spot_form_input"
                                    type="text"
                                    placeholder="Latitude"
                                    value={latitude}
                                    onChange={(e) => setLatitude(e.target.value)}
                                    />
                            </div>
                            <div className="spot_form_lng_input_div">
                                <div className="spot_form_input_title">
                                    Longitude:
                                </div>
                                <input
                                    className="add_spot_form_input"
                                    type="text"
                                    placeholder="Longitude"
                                    value={longitude}
                                    onChange={(e) => setLongitude(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="spot_form_description_div spot_form_block">
                <div className="spot_form_block_heading">Describe your place to guests</div>
                <p className="spot_form_prompt">Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                {validationErrors.description && <span className="spot_error">{validationErrors.description}</span>}
                <textarea
                    className="spot_form_input spot_form_description_input"
                    placeholder="Please write at least 30 characters"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className="spot_form_title_div spot_form_block">
                <div className="spot_form_block_heading">Create a tile for your spot</div>
                <p className="spot_form_prompt">Catch guests' attention with a spot title that highlights what makes your place special</p>
                {validationErrors.title && <span className="spot_error">{validationErrors.title}</span>}
                <input
                    className="spot_form_input spot_from_title_input"
                    type="text"
                    placeholder="Name of your spot"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="spot_form_price_div spot_form_block">
                <div className="spot_form_block_heading">Set a base price for your spot</div>
                <p className="spot_form_prompt">Competitive pricing can help your listing stand out and rank higher ins search results</p>
                {validationErrors.price && <span className="spot_error">{validationErrors.price}</span>}
                <div className="spot_form_price_input_div">
                    <div className="spot_form_price_input_div">
                        <div className="spot_form_price_label">$</div>
                        <input
                            className="spot_form_input spot_form_price_input"
                            type="number"
                            placeholder="Price per night (USD)"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <button className="spot_form_submit_button" type="submit">Create Spot</button>
        </form>
    )
}
