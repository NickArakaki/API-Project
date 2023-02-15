import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import spotsReducer, * as spotActions from '../../store/spots';
import validateAddSpotForm from "../../utils/validation";
import "./AddSpotForm.css"

export default function AddSpotForm({ spotId }) { // Refactoring idea: maybe use the rest operator for image1...image4
    const history = useHistory();
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const spot = useSelector(state => state.spots.singleSpot);
    const updateForm = sessionUser.id === spot.ownerId;

    const [country, setCountry] = useState(updateForm ? spot.country : '');
    const [streetAddress, setStreetAddress] = useState(updateForm ? spot.address : '');
    const [city, setCity] = useState(updateForm ? spot.city : '');
    const [state, setState] = useState(updateForm ? spot.state : '');
    const [latitude, setLatitude] = useState(updateForm ? spot.lat : '');
    const [longitude, setLongitude] = useState(updateForm ? spot.lng : '');
    const [description, setDescription] = useState(updateForm ? spot.description : '');
    const [title, setTitle] = useState(updateForm ? spot.name : '');
    const [price, setPrice] = useState(updateForm ? spot.price : '');
    const [previewImage, setPreviewImage] = useState('');
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [image4, setImage4] = useState('');
    const [validationErrors, setValidationErrors] = useState([]);
    const [serverErrors, setServerErrors] = useState([]);

    if (!sessionUser) history.push('/');

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = validateAddSpotForm(
            country,
            streetAddress,
            city,
            state,
            description,
            title,
            price,
            previewImage,
            image1,
            image2,
            image3,
            image4
        )

        if (!Object.values(errors).length) {
            // make post request
            setValidationErrors([]);
            const spotData = {
                address: streetAddress,
                city,
                state,
                country,
                lat: 37.7645358,
                lng: -122.4730327,
                name: title,
                description,
                price
            };

            const spotImages = [
                {
                    url: previewImage,
                    preview: true
                }
            ]

            if (image1) spotImages.push({
                url: image1,
                preview: false
            })
            if (image2) spotImages.push({
                url: image2,
                preview: false
            })
            if (image3) spotImages.push({
                url: image3,
                preview: false
            })
            if (image4) spotImages.push({
                url: image4,
                preview: false
            })

            dispatch(spotActions.addSpotThunk(spotData))
                .then((spot) => {
                    // iterate over spotImages and add to spotId
                    spotImages.forEach(spotImage => {
                        dispatch(spotActions.addSpotImageThunk(spot.id, spotImage))
                    })
                    history.push(`/spots/${spot.id}`);
                })
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && Object.values(data.errors).length > 0) {
                        setServerErrors(Object.values(data.errors));
                    }
                })

        } else {
            // else set the errors
            console.log("there are errors")
            setValidationErrors(errors);
        }
    }

    return (
        <form className="add_spot_form" onSubmit={handleSubmit}>
            <h2 className="add_spot_form_title">{updateForm ? "Update Your Spot" : "Create a New Spot"}</h2>
            {serverErrors.length > 0 && (
                <>
                    {serverErrors.map(error => (
                        <li key={error}>{error}</li>
                    ))}
                </>
            )}
            <div className="add_spot_form_location_div form_block">
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
                    Street Address: {validationErrors.streetAddress && <span className="error">{validationErrors.streetAddress}</span>}
                    <input
                        type="text"
                        placeholder="Address"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
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
            <div className="add_spot_form_description_div form_block">
                <h3>Describe your place to guests</h3>
                <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                <textarea
                    className="add_spot_form_description_textarea"
                    placeholder="Please write at least 30 characters"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                {validationErrors.description && <span className="error">{validationErrors.description}</span>}
            </div>
            <hr />
            <div className="add_spot_form_title_wrapper form_block">
                <h3>Create a tile for your spot</h3>
                <p>Catch guests' attention with a spot title that highlights what makes your place special</p>
                <input
                    type="text"
                    placeholder="Name of your spot"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            {validationErrors.title && <span className="error">{validationErrors.title}</span>}
            <hr />
            <div className="add_spot_form_price_wrapper form_block">
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
            <div className="add_spot_form_photo_wrapper form_block">
                <h3>Liven up your spot with photos</h3>
                <p>Submit a link to at least one photo to publish your spot</p>
                <input
                    className="add_spot_form_preview_image"
                    type="text"
                    placeholder="Preview Image URL"
                    value={previewImage}
                    onChange={(e) => setPreviewImage(e.target.value)}
                />
                {validationErrors.previewImage && <span className="error">{validationErrors.previewImage}</span>}
                {validationErrors.previewImageType && <span className="error">{validationErrors.previewImageType}</span>}
                <input
                    className="add_spot_form_image"
                    type="text"
                    placeholder="Image URL"
                    value={image1}
                    onChange={(e) => setImage1(e.target.value)}
                />
                {validationErrors.image1Type && <span className="error">{validationErrors.image1Type}</span>}
                <input
                    className="add_spot_form_image"
                    type="text"
                    placeholder="Image URL"
                    value={image2}
                    onChange={(e) => setImage2(e.target.value)}
                />
                {validationErrors.image2Type && <span className="error">{validationErrors.image2Type}</span>}
                <input
                    className="add_spot_form_image"
                    type="text"
                    placeholder="Image URL"
                    value={image3}
                    onChange={(e) => setImage3(e.target.value)}
                />
                {validationErrors.image3Type && <span className="error">{validationErrors.image3Type}</span>}
                <input
                    className="add_spot_form_image"
                    type="text"
                    placeholder="Image URL"
                    value={image4}
                    onChange={(e) => setImage4(e.target.value)}
                />
                {validationErrors.image3Type && <span className="error">{validationErrors.image3Type}</span>}
            </div>
            <button className="add_spot_form_submit_button" type="submit">{updateForm ? "Update Spot" : "Create Spot"}</button>
        </form>
    )
}
